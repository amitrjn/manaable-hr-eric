"""Base handler utilities for Chako API."""
from typing import Any, Callable, Dict
import json
import os
from functools import wraps
from ...shared.python.auth import verify_cognito_token

def require_auth(handler: Callable) -> Callable:
    """Decorator to require Cognito authentication."""
    @wraps(handler)
    def wrapper(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
        try:
            auth_header = event.get('headers', {}).get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return {
                    'statusCode': 401,
                    'body': json.dumps({'error': 'Missing or invalid authorization header'})
                }
                
            token = auth_header.split(' ')[1]
            claims = verify_cognito_token(token)
            
            if not claims:
                return {
                    'statusCode': 401,
                    'body': json.dumps({'error': 'Invalid token'})
                }
                
            # Add user claims to event for handler
            event['requestContext'] = event.get('requestContext', {})
            event['requestContext']['authorizer'] = {'claims': claims}
            
            return handler(event, context)
            
        except Exception as e:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': str(e)})
            }
    
    return wrapper
