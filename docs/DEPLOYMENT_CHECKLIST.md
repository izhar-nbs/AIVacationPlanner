# AWS Deployment Checklist

Use this checklist to ensure a smooth deployment to AWS.

## Pre-Deployment

### 1. AWS Account Setup
- [ ] AWS account created and verified
- [ ] Billing alerts configured
- [ ] MFA enabled on root account
- [ ] IAM user created with appropriate permissions
- [ ] AWS CLI installed and configured

### 2. Local Environment
- [ ] Node.js 18+ installed
- [ ] Docker installed and running
- [ ] Git repository up to date
- [ ] All dependencies installed (`npm install`)
- [ ] TypeScript compiles without errors (`npm run check`)
- [ ] Frontend builds successfully (`npm run build:frontend`)

### 3. Configuration
- [ ] API keys obtained:
  - [ ] Groq API key
  - [ ] Together AI API key (optional)
  - [ ] Hugging Face API key (optional)
- [ ] Environment variables documented
- [ ] Database schema reviewed

### 4. CDK Setup
- [ ] AWS CDK CLI installed (`npm install -g aws-cdk`)
- [ ] CDK bootstrapped in target region (`npm run cdk:bootstrap`)
- [ ] CDK diff reviewed (`npm run cdk:diff`)

## Deployment

### 5. Initial Deployment
- [ ] Run deployment script or `npm run cdk:deploy`
- [ ] Deployment completed without errors
- [ ] Stack outputs captured:
  - [ ] CloudFront URL
  - [ ] Backend URL
  - [ ] Database endpoint
  - [ ] Secret ARNs

### 6. Post-Deployment Configuration
- [ ] Update API keys in AWS Secrets Manager:
  ```bash
  aws secretsmanager update-secret \
    --secret-id vacation-planner-api-keys \
    --secret-string '{"GROQ_API_KEY":"xxx","TOGETHER_API_KEY":"xxx","HUGGINGFACE_API_KEY":"xxx"}'
  ```
- [ ] Verify secrets updated successfully
- [ ] Database migrations run (if applicable)

### 7. Verification
- [ ] CloudFront distribution active
- [ ] Frontend loads at CloudFront URL
- [ ] Backend health check passes (`/health`)
- [ ] Database connection successful
- [ ] API endpoints responding
- [ ] Test vacation planning flow end-to-end

### 8. Monitoring Setup
- [ ] CloudWatch logs accessible
- [ ] CloudWatch alarms configured:
  - [ ] High CPU usage
  - [ ] High memory usage
  - [ ] Failed health checks
  - [ ] Database connection errors
- [ ] Cost monitoring enabled
- [ ] SNS topic for alerts created

## CI/CD Setup (Optional)

### 9. GitHub Actions
- [ ] GitHub secrets configured:
  - [ ] `AWS_ACCESS_KEY_ID`
  - [ ] `AWS_SECRET_ACCESS_KEY`
  - [ ] `AWS_REGION`
  - [ ] API keys
- [ ] Workflow files committed
- [ ] Test workflow runs successfully
- [ ] Deployment workflow tested

### 10. Security
- [ ] Security groups reviewed
- [ ] IAM roles follow least privilege
- [ ] Secrets Manager access restricted
- [ ] Database not publicly accessible
- [ ] CloudFront using HTTPS only
- [ ] S3 bucket not publicly accessible

## Production Readiness

### 11. Performance
- [ ] CloudFront caching configured
- [ ] Database connection pooling enabled
- [ ] ECS task auto-scaling configured
- [ ] Load testing performed

### 12. Backup & Recovery
- [ ] RDS automated backups enabled
- [ ] Backup retention period set (7 days)
- [ ] Recovery procedure documented
- [ ] Rollback strategy tested

### 13. Documentation
- [ ] Deployment process documented
- [ ] Architecture diagram updated
- [ ] Runbook created for common issues
- [ ] Team trained on deployment process

### 14. Cost Optimization
- [ ] Right-sized ECS tasks
- [ ] Right-sized RDS instance
- [ ] NAT Gateway usage reviewed
- [ ] CloudFront pricing tier selected
- [ ] Budget alerts configured

## Post-Launch

### 15. Monitoring
- [ ] Monitor CloudWatch logs for errors
- [ ] Check ECS task health
- [ ] Verify database performance
- [ ] Monitor CloudFront cache hit rate
- [ ] Review cost reports daily

### 16. Optimization
- [ ] Analyze CloudWatch metrics
- [ ] Optimize slow queries
- [ ] Adjust auto-scaling policies
- [ ] Review and optimize costs

### 17. Maintenance
- [ ] Schedule regular updates
- [ ] Plan for dependency updates
- [ ] Review security patches
- [ ] Update documentation

## Rollback Plan

### If Deployment Fails
1. [ ] Check CloudFormation events for errors
2. [ ] Review CloudWatch logs
3. [ ] Rollback using: `aws cloudformation rollback-stack --stack-name AIVacationPlannerStack`
4. [ ] Investigate and fix issues
5. [ ] Redeploy when ready

### If Production Issues Occur
1. [ ] Check health check status
2. [ ] Review recent deployments
3. [ ] Check CloudWatch alarms
4. [ ] Rollback to previous version if needed
5. [ ] Investigate root cause
6. [ ] Deploy fix

## Useful Commands

```bash
# Check deployment status
aws cloudformation describe-stacks --stack-name AIVacationPlannerStack

# View ECS tasks
aws ecs list-tasks --cluster vacation-planner-cluster

# View logs
aws logs tail /ecs/vacation-planner-backend --follow

# Update secrets
aws secretsmanager update-secret --secret-id vacation-planner-api-keys --secret-string '{...}'

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"

# Check RDS status
aws rds describe-db-instances --db-instance-identifier vacation-planner-db

# View costs
aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-01-31 --granularity MONTHLY --metrics BlendedCost
```

## Support Contacts

- AWS Support: https://console.aws.amazon.com/support/
- CDK Documentation: https://docs.aws.amazon.com/cdk/
- Project Repository: https://github.com/izhar-nbs/AIVacationPlanner

## Notes

- Deployment typically takes 10-15 minutes
- First deployment may take longer due to resource creation
- Keep this checklist updated as deployment process evolves
- Review and update quarterly
