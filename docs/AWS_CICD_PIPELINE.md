# CI/CD Pipeline Setup with GitHub Actions

This guide shows how to set up automated deployments to AWS using GitHub Actions.

## Overview

The CI/CD pipeline will:
1. Trigger on push to `main` branch
2. Run tests and linting
3. Build the application
4. Deploy to AWS using CDK

## Step 1: Create AWS IAM User for GitHub Actions

### Create IAM Policy

Create a file `github-actions-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "s3:*",
        "ecs:*",
        "ec2:*",
        "elasticloadbalancing:*",
        "rds:*",
        "secretsmanager:*",
        "cloudfront:*",
        "iam:*",
        "logs:*",
        "ecr:*"
      ],
      "Resource": "*"
    }
  ]
}
```

### Create IAM User

```bash
# Create user
aws iam create-user --user-name github-actions-vacation-planner

# Attach policy
aws iam put-user-policy \
  --user-name github-actions-vacation-planner \
  --policy-name GitHubActionsPolicy \
  --policy-document file://github-actions-policy.json

# Create access keys
aws iam create-access-key --user-name github-actions-vacation-planner
```

Save the Access Key ID and Secret Access Key.

## Step 2: Add GitHub Secrets

Go to your GitHub repository:
1. Settings → Secrets and variables → Actions
2. Click "New repository secret"

Add these secrets:
- `AWS_ACCESS_KEY_ID`: Your IAM user access key
- `AWS_SECRET_ACCESS_KEY`: Your IAM user secret key
- `AWS_REGION`: e.g., `us-east-1`
- `GROQ_API_KEY`: Your Groq API key
- `TOGETHER_API_KEY`: Your Together AI key
- `HUGGINGFACE_API_KEY`: Your Hugging Face key

## Step 3: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  AWS_REGION: ${{ secrets.AWS_REGION }}
  NODE_VERSION: '18'

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run TypeScript check
        run: npm run check

      - name: Build frontend
        run: npm run build:frontend

  deploy:
    name: Deploy to AWS
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Install dependencies
        run: npm ci

      - name: Install AWS CDK
        run: npm install -g aws-cdk

      - name: Build frontend
        run: npm run build:frontend

      - name: CDK Deploy
        run: npm run cdk:deploy -- --require-approval never
        env:
          CDK_DEFAULT_ACCOUNT: ${{ secrets.AWS_ACCOUNT_ID }}
          CDK_DEFAULT_REGION: ${{ secrets.AWS_REGION }}

      - name: Get CloudFront Distribution ID
        id: cloudfront
        run: |
          DIST_ID=$(aws cloudformation describe-stacks \
            --stack-name AIVacationPlannerStack \
            --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
            --output text)
          echo "distribution_id=$DIST_ID" >> $GITHUB_OUTPUT

      - name: Invalidate CloudFront Cache
        if: steps.cloudfront.outputs.distribution_id != ''
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ steps.cloudfront.outputs.distribution_id }} \
            --paths "/*"

      - name: Deployment Summary
        run: |
          echo "## Deployment Successful! 🚀" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### Stack Outputs" >> $GITHUB_STEP_SUMMARY
          aws cloudformation describe-stacks \
            --stack-name AIVacationPlannerStack \
            --query 'Stacks[0].Outputs' \
            --output table >> $GITHUB_STEP_SUMMARY
```

## Step 4: Create Pull Request Workflow

Create `.github/workflows/pr-check.yml`:

```yaml
name: PR Checks

on:
  pull_request:
    branches:
      - main

jobs:
  validate:
    name: Validate Changes
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript check
        run: npm run check

      - name: Build frontend
        run: npm run build:frontend

      - name: CDK Synth
        run: npm run cdk:synth

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ All checks passed! Ready to merge and deploy.'
            })
```

## Step 5: Commit and Push

```bash
git add .github/workflows/
git commit -m "Add CI/CD pipeline with GitHub Actions"
git push origin main
```

## Step 6: Monitor Deployment

1. Go to your GitHub repository
2. Click "Actions" tab
3. Watch the workflow run

## Advanced: Multi-Environment Setup

### Create Staging Environment

Update `infrastructure/app.ts`:

```typescript
const environment = process.env.ENVIRONMENT || 'production';

new AIVacationPlannerStack(app, `AIVacationPlanner-${environment}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  stackName: `vacation-planner-${environment}`,
  description: `AI Vacation Planner - ${environment}`,
});
```

### Update Workflow for Staging

```yaml
deploy-staging:
  name: Deploy to Staging
  if: github.ref == 'refs/heads/develop'
  runs-on: ubuntu-latest
  
  steps:
    # ... same steps as production
    
    - name: CDK Deploy to Staging
      run: npm run cdk:deploy -- --require-approval never
      env:
        ENVIRONMENT: staging
```

## Rollback Strategy

### Manual Rollback

```bash
# List previous versions
aws cloudformation list-stack-resources --stack-name AIVacationPlannerStack

# Rollback to previous version
aws cloudformation rollback-stack --stack-name AIVacationPlannerStack
```

### Automated Rollback in Workflow

Add to deploy job:

```yaml
- name: Health Check
  id: health
  run: |
    BACKEND_URL=$(aws cloudformation describe-stacks \
      --stack-name AIVacationPlannerStack \
      --query 'Stacks[0].Outputs[?OutputKey==`BackendURL`].OutputValue' \
      --output text)
    
    for i in {1..10}; do
      if curl -f "$BACKEND_URL/health"; then
        echo "Health check passed"
        exit 0
      fi
      sleep 30
    done
    echo "Health check failed"
    exit 1

- name: Rollback on Failure
  if: failure() && steps.health.outcome == 'failure'
  run: |
    aws cloudformation rollback-stack --stack-name AIVacationPlannerStack
```

## Notifications

### Slack Notifications

Add to workflow:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment to AWS ${{ job.status }}'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email Notifications

Configure in GitHub repository settings:
Settings → Notifications → Email notifications

## Security Best Practices

1. **Use OIDC instead of access keys** (recommended):
   ```yaml
   - name: Configure AWS credentials
     uses: aws-actions/configure-aws-credentials@v4
     with:
       role-to-assume: arn:aws:iam::ACCOUNT:role/GitHubActionsRole
       aws-region: ${{ secrets.AWS_REGION }}
   ```

2. **Scan for secrets**:
   ```yaml
   - name: Secret Scanning
     uses: trufflesecurity/trufflehog@main
     with:
       path: ./
   ```

3. **Dependency scanning**:
   ```yaml
   - name: Run npm audit
     run: npm audit --audit-level=high
   ```

## Monitoring Deployments

### CloudWatch Dashboard

Create a dashboard to monitor:
- ECS task health
- ALB response times
- RDS connections
- CloudFront cache hit rate

### Set Up Alarms

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name vacation-planner-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

## Troubleshooting

### Deployment Fails
- Check GitHub Actions logs
- Verify AWS credentials
- Ensure CDK is bootstrapped

### Tests Fail
- Run locally: `npm run check`
- Check for missing dependencies
- Verify environment variables

### CloudFront Not Updating
- Invalidation may take 5-10 minutes
- Check invalidation status in AWS Console
- Verify S3 bucket has new files

## Next Steps

- Add automated testing (Jest, Playwright)
- Implement blue-green deployments
- Set up monitoring and alerting
- Add performance testing
- Configure custom domain with Route 53
