# Chako REST API Documentation

## Authentication

### Google SSO Authentication
```
POST /auth
Content-Type: application/json

Request:
{
  "token": "google-oauth-token",
  "email": "user@company.com"
}

Response:
{
  "AccessToken": "cognito-access-token",
  "IdToken": "cognito-id-token",
  "RefreshToken": "cognito-refresh-token",
  "ExpiresIn": 3600
}
```

## API Security

### Authentication Headers
All API requests (except authentication) must include:
```
Authorization: Bearer <cognito-access-token>
```

### CORS Configuration
- Allowed Methods: GET, POST, PUT, DELETE
- Allowed Headers: Content-Type, Authorization
- Credentials: Supported

## Error Responses

### Standard Error Format
```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 500: Internal Server Error

## API Versioning
- API version included in URL path
- Example: `/v1/resource`
- Current version: v1
