#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ChakoFrontendStack } from '../lib/stacks/frontend-stack';
import { ChakoBackendStack } from '../lib/stacks/backend-stack';
import { ChakoDatabaseStack } from '../lib/stacks/database-stack';
import { ChakoAuthStack } from '../lib/stacks/auth-stack';

const app = new cdk.App();

// Common configuration
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

const prefix = 'chako';

// Create stacks
const databaseStack = new ChakoDatabaseStack(app, `${prefix}-database`, {
  env,
  prefix,
});

const authStack = new ChakoAuthStack(app, `${prefix}-auth`, {
  env,
  prefix,
});

const backendStack = new ChakoBackendStack(app, `${prefix}-backend`, {
  env,
  prefix,
  database: databaseStack.database,
  userPool: authStack.userPool,
});

new ChakoFrontendStack(app, `${prefix}-frontend`, {
  env,
  prefix,
  apiEndpoint: backendStack.apiEndpoint,
  userPool: authStack.userPool,
});
