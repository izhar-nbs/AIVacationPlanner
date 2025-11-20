import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class AIVacationPlannerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC for the application
    const vpc = new ec2.Vpc(this, 'VacationPlannerVPC', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'Database',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Database credentials secret
    const dbSecret = new secretsmanager.Secret(this, 'DBSecret', {
      secretName: 'vacation-planner-db-credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
      },
    });

    // PostgreSQL Database
    const database = new rds.DatabaseInstance(this, 'VacationPlannerDB', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      credentials: rds.Credentials.fromSecret(dbSecret),
      databaseName: 'vacationplanner',
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT,
      backupRetention: cdk.Duration.days(7),
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'VacationPlannerCluster', {
      vpc,
      clusterName: 'vacation-planner-cluster',
      containerInsights: true,
    });

    // API Keys Secret (for Groq, etc.)
    const apiKeysSecret = new secretsmanager.Secret(this, 'APIKeysSecret', {
      secretName: 'vacation-planner-api-keys',
      secretObjectValue: {
        GROQ_API_KEY: cdk.SecretValue.unsafePlainText('your-groq-api-key'),
        TOGETHER_API_KEY: cdk.SecretValue.unsafePlainText('your-together-api-key'),
        HUGGINGFACE_API_KEY: cdk.SecretValue.unsafePlainText('your-huggingface-api-key'),
      },
    });

    // Fargate Service for Backend API
    const backendService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'BackendService',
      {
        cluster,
        serviceName: 'vacation-planner-backend',
        cpu: 512,
        memoryLimitMiB: 1024,
        desiredCount: 2,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset('.', {
            file: 'Dockerfile.backend',
          }),
          containerPort: 5000,
          environment: {
            NODE_ENV: 'production',
            PORT: '5000',
          },
          secrets: {
            DATABASE_URL: ecs.Secret.fromSecretsManager(dbSecret),
            GROQ_API_KEY: ecs.Secret.fromSecretsManager(apiKeysSecret, 'GROQ_API_KEY'),
            TOGETHER_API_KEY: ecs.Secret.fromSecretsManager(apiKeysSecret, 'TOGETHER_API_KEY'),
            HUGGINGFACE_API_KEY: ecs.Secret.fromSecretsManager(apiKeysSecret, 'HUGGINGFACE_API_KEY'),
          },
        },
        publicLoadBalancer: true,
      }
    );

    // Allow backend to connect to database
    database.connections.allowFrom(
      backendService.service,
      ec2.Port.tcp(5432),
      'Allow backend to connect to database'
    );

    // Health check configuration
    backendService.targetGroup.configureHealthCheck({
      path: '/health',
      interval: cdk.Duration.seconds(30),
      timeout: cdk.Duration.seconds(5),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3,
    });

    // S3 bucket for frontend static files
    const frontendBucket = new s3.Bucket(this, 'FrontendBucket', {
      bucketName: `vacation-planner-frontend-${this.account}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFront Origin Access Identity
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'OAI',
      {
        comment: 'OAI for Vacation Planner Frontend',
      }
    );

    frontendBucket.grantRead(originAccessIdentity);

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(frontendBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new origins.HttpOrigin(
            backendService.loadBalancer.loadBalancerDnsName,
            {
              protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            }
          ),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        },
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Deploy frontend to S3
    new s3deploy.BucketDeployment(this, 'DeployFrontend', {
      sources: [s3deploy.Source.asset('./client/dist')],
      destinationBucket: frontendBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Outputs
    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
    });

    new cdk.CfnOutput(this, 'BackendURL', {
      value: `http://${backendService.loadBalancer.loadBalancerDnsName}`,
      description: 'Backend Load Balancer URL',
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.dbInstanceEndpointAddress,
      description: 'Database Endpoint',
    });

    new cdk.CfnOutput(this, 'DatabaseSecretArn', {
      value: dbSecret.secretArn,
      description: 'Database Secret ARN',
    });

    new cdk.CfnOutput(this, 'APIKeysSecretArn', {
      value: apiKeysSecret.secretArn,
      description: 'API Keys Secret ARN',
    });
  }
}
