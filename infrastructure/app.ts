#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AIVacationPlannerStack } from './stacks/vacation-planner-stack';

const app = new cdk.App();

new AIVacationPlannerStack(app, 'AIVacationPlannerStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: 'Enterprise-grade AI Vacation Planner with multi-agent architecture',
});

app.synth();
