#!/bin/bash

# AWS Deployment Script for AI Vacation Planner
# This script automates the deployment process

echo "🚀 AI Vacation Planner - AWS Deployment"
echo "========================================"
echo ""

# Check if AWS CLI is installed
echo "Checking prerequisites..."
if ! command -v aws &> /dev/null; then
    echo "✗ AWS CLI not found. Please install it first."
    echo "  Download from: https://aws.amazon.com/cli/"
    exit 1
fi
echo "✓ AWS CLI installed: $(aws --version)"

# Check if CDK is installed
if ! command -v cdk &> /dev/null; then
    echo "✗ AWS CDK not found. Installing..."
    npm install -g aws-cdk
fi
echo "✓ AWS CDK installed: $(cdk --version)"

# Check AWS credentials
echo ""
echo "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "✗ AWS credentials not configured"
    echo "  Run: aws configure"
    exit 1
fi

IDENTITY=$(aws sts get-caller-identity --output json)
ACCOUNT=$(echo $IDENTITY | jq -r '.Account')
USER=$(echo $IDENTITY | jq -r '.Arn')
echo "✓ AWS Account: $ACCOUNT"
echo "✓ AWS User: $USER"

# Check if CDK is bootstrapped
echo ""
echo "Checking CDK bootstrap status..."
REGION=$(aws configure get region)
if [ -z "$REGION" ]; then
    REGION="us-east-1"
fi

if ! aws cloudformation describe-stacks --stack-name CDKToolkit --region $REGION &> /dev/null; then
    echo "CDK not bootstrapped. Bootstrapping now..."
    npm run cdk:bootstrap
    if [ $? -ne 0 ]; then
        echo "✗ Bootstrap failed"
        exit 1
    fi
    echo "✓ CDK bootstrapped successfully"
else
    echo "✓ CDK already bootstrapped"
fi

# Build frontend
echo ""
echo "Building frontend..."
npm run build:frontend
if [ $? -ne 0 ]; then
    echo "✗ Frontend build failed"
    exit 1
fi
echo "✓ Frontend built successfully"

# Show what will be deployed
echo ""
echo "Previewing changes..."
npm run cdk:diff

# Confirm deployment
echo ""
read -p "Do you want to proceed with deployment? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Deployment cancelled"
    exit 0
fi

# Deploy
echo ""
echo "Deploying to AWS..."
echo "This may take 10-15 minutes..."
npm run cdk:deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "✓ Deployment successful!"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Update API keys in AWS Secrets Manager"
    echo "2. Run database migrations"
    echo "3. Access your application via the CloudFront URL"
    echo ""
    echo "For detailed instructions, see: docs/AWS_DEPLOYMENT.md"
else
    echo ""
    echo "✗ Deployment failed"
    echo "Check the error messages above for details"
    exit 1
fi
