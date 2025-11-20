# AWS Deployment Guide

This guide walks you through deploying the AI Vacation Planner to AWS using Infrastructure as Code (CDK).

## Architecture Overview

The application is deployed with the following AWS services:

- **Amazon ECS Fargate**: Runs the Node.js backend API in containers
- **Application Load Balancer**: Distributes traffic to backend containers
- **Amazon RDS PostgreSQL**: Managed database for application data
- **Amazon S3**: Hosts the React frontend static files
- **Amazon CloudFront**: CDN for fast global content delivery
- **AWS Secrets Manager**: Securely stores database credentials and API keys
- **Amazon VPC**: Isolated network with public, private, and database subnets

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Install and configure AWS CLI
3. **Node.js**: Version 18 or higher
4. **Docker**: Required for building container images

## Step 1: Install AWS CLI

### Windows
```powershell
# Download and install from: https://aws.amazon.com/cli/
# Or use chocolatey:
choco install awscli
```

### Verify installation
```bash
aws --version
```

## Step 2: Configure AWS Credentials

```bash
aws configure
```

You'll be prompted for:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., us-east-1)
- Default output format (json)

## Step 3: Install CDK CLI

```bash
npm install -g aws-cdk
```

Verify installation:
```bash
cdk --version
```

## Step 4: Bootstrap CDK (First Time Only)

This creates the necessary AWS resources for CDK deployments:

```bash
npm run cdk:bootstrap
```

Or manually:
```bash
cdk bootstrap aws://ACCOUNT-NUMBER/REGION
```

## Step 5: Update API Keys

Before deploying, update the API keys in the CDK stack:

1. Open `infrastructure/stacks/vacation-planner-stack.ts`
2. Find the `apiKeysSecret` section
3. Replace placeholder values with your actual API keys:

```typescript
const apiKeysSecret = new secretsmanager.Secret(this, 'APIKeysSecret', {
  secretName: 'vacation-planner-api-keys',
  secretObjectValue: {
    GROQ_API_KEY: cdk.SecretValue.unsafePlainText('your-actual-groq-key'),
    TOGETHER_API_KEY: cdk.SecretValue.unsafePlainText('your-actual-together-key'),
    HUGGINGFACE_API_KEY: cdk.SecretValue.unsafePlainText('your-actual-hf-key'),
  },
});
```

**Better approach**: Use AWS Secrets Manager after deployment:
```bash
aws secretsmanager update-secret \
  --secret-id vacation-planner-api-keys \
  --secret-string '{"GROQ_API_KEY":"your-key","TOGETHER_API_KEY":"your-key","HUGGINGFACE_API_KEY":"your-key"}'
```

## Step 6: Build Frontend

```bash
npm run build:frontend
```

This creates the production build in `client/dist/`.

## Step 7: Preview Changes (Optional)

See what resources will be created:

```bash
npm run cdk:diff
```

## Step 8: Deploy to AWS

```bash
npm run cdk:deploy
```

This will:
1. Build the frontend
2. Create all AWS resources
3. Deploy the backend container
4. Upload frontend to S3
5. Configure CloudFront

The deployment takes approximately 10-15 minutes.

## Step 9: Access Your Application

After deployment completes, you'll see outputs:

```
Outputs:
AIVacationPlannerStack.CloudFrontURL = https://d1234567890.cloudfront.net
AIVacationPlannerStack.BackendURL = http://vacation-alb-123456.us-east-1.elb.amazonaws.com
AIVacationPlannerStack.DatabaseEndpoint = vacation-db.abc123.us-east-1.rds.amazonaws.com
```

Access your application at the **CloudFrontURL**.

## Step 10: Run Database Migrations

Connect to your backend container and run migrations:

```bash
# Get the task ARN
aws ecs list-tasks --cluster vacation-planner-cluster

# Execute command in the container
aws ecs execute-command \
  --cluster vacation-planner-cluster \
  --task TASK_ARN \
  --container vacation-planner-backend \
  --interactive \
  --command "npm run db:push"
```

## Monitoring and Logs

### View Backend Logs
```bash
aws logs tail /ecs/vacation-planner-backend --follow
```

### View CloudFront Metrics
Go to AWS Console → CloudFront → Your Distribution → Monitoring

### View ECS Service Status
```bash
aws ecs describe-services \
  --cluster vacation-planner-cluster \
  --services vacation-planner-backend
```

## Updating the Application

### Update Backend Code
1. Make your changes
2. Commit to git
3. Run: `npm run cdk:deploy`

CDK will automatically rebuild and deploy the new container.

### Update Frontend Code
1. Make your changes
2. Build: `npm run build:frontend`
3. Deploy: `npm run cdk:deploy`

## Cost Estimation

Approximate monthly costs (us-east-1):

- **ECS Fargate** (2 tasks, 0.5 vCPU, 1GB): ~$30
- **Application Load Balancer**: ~$20
- **RDS PostgreSQL** (db.t3.micro): ~$15
- **NAT Gateway**: ~$35
- **CloudFront**: ~$1 + data transfer
- **S3**: ~$1
- **Secrets Manager**: ~$1

**Total**: ~$103/month (varies with usage)

### Cost Optimization Tips

1. **Reduce to 1 Fargate task** for development:
   ```typescript
   desiredCount: 1,
   ```

2. **Use smaller RDS instance**:
   ```typescript
   instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO)
   ```

3. **Remove NAT Gateway** (backend won't have internet access):
   ```typescript
   natGateways: 0,
   ```

## Cleanup

To delete all resources and stop incurring charges:

```bash
npm run cdk:destroy
```

**Warning**: This will delete:
- All containers and tasks
- The database (a snapshot will be created)
- All S3 files
- CloudFront distribution

## Troubleshooting

### Deployment Fails
- Check AWS credentials: `aws sts get-caller-identity`
- Ensure Docker is running
- Check CDK version: `cdk --version`

### Backend Health Check Fails
- Check logs: `aws logs tail /ecs/vacation-planner-backend --follow`
- Verify environment variables in ECS task definition
- Check security group rules

### Frontend Not Loading
- Verify S3 bucket has files: `aws s3 ls s3://vacation-planner-frontend-ACCOUNT/`
- Check CloudFront distribution status
- Clear CloudFront cache: `aws cloudfront create-invalidation --distribution-id ID --paths "/*"`

### Database Connection Issues
- Verify security group allows traffic from ECS tasks
- Check database credentials in Secrets Manager
- Ensure database is in AVAILABLE state

## Security Best Practices

1. **Enable MFA** on your AWS account
2. **Use IAM roles** instead of access keys when possible
3. **Enable CloudTrail** for audit logging
4. **Set up AWS Budget alerts** to monitor costs
5. **Regularly rotate** API keys in Secrets Manager
6. **Enable RDS encryption** at rest (already configured)
7. **Use AWS WAF** with CloudFront for additional protection

## Next Steps

- Set up **CI/CD pipeline** with GitHub Actions
- Configure **custom domain** with Route 53
- Add **SSL certificate** with ACM
- Set up **monitoring** with CloudWatch Alarms
- Implement **auto-scaling** based on load
- Add **backup automation** for RDS

## Support

For issues or questions:
- Check AWS CloudWatch Logs
- Review CDK documentation: https://docs.aws.amazon.com/cdk/
- AWS Support: https://console.aws.amazon.com/support/
