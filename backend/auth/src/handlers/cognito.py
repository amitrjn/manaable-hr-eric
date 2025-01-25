"""Cognito authentication handlers for Chako."""
import json
import os
from typing import Dict, Any
import boto3

def handle_google_sso(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Handle Google SSO authentication."""
    cognito = boto3.client('cognito-idp')
    
    try:
        # Extract Google token from event
        body = json.loads(event.get('body', '{}'))
        google_token = body.get('token')
        
        if not google_token:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing Google token'})
            }
            
        # Exchange Google token for Cognito tokens
        response = cognito.initiate_auth(
            AuthFlow='CUSTOM_AUTH',
            AuthParameters={
                'USERNAME': 'Google_' + body.get('email', ''),
                'TOKEN': google_token
            },
            ClientId=os.environ['COGNITO_CLIENT_ID']
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': os.environ.get('CORS_ORIGIN', '*'),
                'Access-Control-Allow-Credentials': 'true'
            },
            'body': json.dumps(response['AuthenticationResult'])
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
