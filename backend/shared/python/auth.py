"""Authentication utilities for Chako backend services."""
from typing import Dict, Optional
import os
import boto3
from jose import jwk, jwt
from jose.utils import base64url_decode

def get_cognito_public_keys():
    """Get public keys from Cognito user pool."""
    client = boto3.client('cognito-idp')
    response = client.get_signing_key(
        UserPoolId=os.environ['COGNITO_USER_POOL_ID']
    )
    return response['KeyMetadata']

def verify_cognito_token(token: str) -> Optional[Dict]:
    """Verify Cognito JWT token."""
    try:
        headers = jwt.get_unverified_headers(token)
        kid = headers['kid']
        
        # Get the public keys
        keys = get_cognito_public_keys()
        key = next((k for k in keys if k['kid'] == kid), None)
        if not key:
            return None
            
        public_key = jwk.construct(key)
        message, encoded_signature = token.rsplit('.', 1)
        decoded_signature = base64url_decode(encoded_signature.encode('utf-8'))
        
        if not public_key.verify(message.encode('utf-8'), decoded_signature):
            return None
            
        claims = jwt.get_unverified_claims(token)
        return claims
    except Exception:
        return None
