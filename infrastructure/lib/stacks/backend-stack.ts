import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

interface BackendStackProps extends cdk.StackProps {
  prefix: string;
  database: rds.IDatabaseInstance;
  userPool: cognito.IUserPool;
}

export class ChakoBackendStack extends cdk.Stack {
  public readonly apiEndpoint: string;

  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    // Create Lambda functions
    const authHandler = new lambda.Function(this, `${props.prefix}-auth-handler`, {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'cognito.handle_google_sso',
      code: lambda.Code.fromAsset('../backend/auth/src'),
      environment: {
        COGNITO_USER_POOL_ID: props.userPool.userPoolId,
      },
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, `${props.prefix}-api`, {
      restApiName: `${props.prefix}-api`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Add Cognito authorizer
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, `${props.prefix}-authorizer`, {
      cognitoUserPools: [props.userPool],
    });

    // Add routes
    const auth = api.root.addResource('auth');
    auth.addMethod('POST', new apigateway.LambdaIntegration(authHandler));

    this.apiEndpoint = api.url;

    // Output values
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: this.apiEndpoint,
    });
  }
}
