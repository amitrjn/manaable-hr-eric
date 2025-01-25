import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

interface AuthStackProps extends cdk.StackProps {
  prefix: string;
}

export class ChakoAuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    // Create Cognito User Pool
    this.userPool = new cognito.UserPool(this, `${props.prefix}-user-pool`, {
      userPoolName: `${props.prefix}-user-pool`,
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    });

    // Add Google as identity provider
    const provider = new cognito.UserPoolIdentityProviderGoogle(this, `${props.prefix}-google-idp`, {
      userPool: this.userPool,
      clientId: cdk.SecretValue.secretsManager('google-client-id').toString(),
      clientSecret: cdk.SecretValue.secretsManager('google-client-secret').toString(),
      scopes: ['profile', 'email', 'openid'],
      attributeRequestMethod: cognito.AttributeRequestMethod.GET,
    });

    // Create app client
    const client = this.userPool.addClient(`${props.prefix}-client`, {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.OPENID, cognito.OAuthScope.PROFILE],
        callbackUrls: ['http://localhost:5173'], // Add production URL later
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.GOOGLE,
      ],
    });

    this.userPool.addDomain(`${props.prefix}-domain`, {
      cognitoDomain: {
        domainPrefix: props.prefix,
      },
    });

    // Output values
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
    });
    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: client.userPoolClientId,
    });
  }
}
