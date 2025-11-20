# AWS Deployment Script for AI Vacation Planner
# This script automates the deployment process

Write-Host "🚀 AI Vacation Planner - AWS Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if AWS CLI is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version
    Write-Host "✓ AWS CLI installed: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ AWS CLI not found. Please install it first." -ForegroundColor Red
    Write-Host "  Download from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Check if CDK is installed
try {
    $cdkVersion = cdk --version
    Write-Host "✓ AWS CDK installed: $cdkVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ AWS CDK not found. Installing..." -ForegroundColor Yellow
    npm install -g aws-cdk
}

# Check AWS credentials
Write-Host ""
Write-Host "Checking AWS credentials..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
    Write-Host "✓ AWS Account: $($identity.Account)" -ForegroundColor Green
    Write-Host "✓ AWS User: $($identity.Arn)" -ForegroundColor Green
} catch {
    Write-Host "✗ AWS credentials not configured" -ForegroundColor Red
    Write-Host "  Run: aws configure" -ForegroundColor Yellow
    exit 1
}

# Check if CDK is bootstrapped
Write-Host ""
Write-Host "Checking CDK bootstrap status..." -ForegroundColor Yellow
$region = aws configure get region
if (-not $region) {
    $region = "us-east-1"
}

$bootstrapped = aws cloudformation describe-stacks --stack-name CDKToolkit --region $region 2>$null
if (-not $bootstrapped) {
    Write-Host "CDK not bootstrapped. Bootstrapping now..." -ForegroundColor Yellow
    npm run cdk:bootstrap
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Bootstrap failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ CDK bootstrapped successfully" -ForegroundColor Green
} else {
    Write-Host "✓ CDK already bootstrapped" -ForegroundColor Green
}

# Build frontend
Write-Host ""
Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build:frontend
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Frontend build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend built successfully" -ForegroundColor Green

# Show what will be deployed
Write-Host ""
Write-Host "Previewing changes..." -ForegroundColor Yellow
npm run cdk:diff

# Confirm deployment
Write-Host ""
$confirm = Read-Host "Do you want to proceed with deployment? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Deployment cancelled" -ForegroundColor Yellow
    exit 0
}

# Deploy
Write-Host ""
Write-Host "Deploying to AWS..." -ForegroundColor Yellow
Write-Host "This may take 10-15 minutes..." -ForegroundColor Cyan
npm run cdk:deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Deployment successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Update API keys in AWS Secrets Manager" -ForegroundColor White
    Write-Host "2. Run database migrations" -ForegroundColor White
    Write-Host "3. Access your application via the CloudFront URL" -ForegroundColor White
    Write-Host ""
    Write-Host "For detailed instructions, see: docs/AWS_DEPLOYMENT.md" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "✗ Deployment failed" -ForegroundColor Red
    Write-Host "Check the error messages above for details" -ForegroundColor Yellow
    exit 1
}
