# Getting Started with Chako

## Prerequisites

### Development Environment
- Node.js (Latest LTS)
- Python 3.12
- AWS CDK CLI
- AWS CLI configured

### Required Accounts
- AWS Account
- Google Cloud Console account (for SSO)
- GitHub account

## Local Development Setup

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r api/requirements.txt -r auth/requirements.txt
```

### Infrastructure Setup
```bash
cd infrastructure
npm install
npm run cdk synth
```

## Environment Configuration

### Frontend Environment Variables
Create `.env` file in frontend directory:
```
VITE_API_URL=http://localhost:3000
VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_CLIENT_ID=your-client-id
VITE_COGNITO_REGION=your-region
```

### Backend Environment Variables
Required environment variables:
```
DB_NAME=chako
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=your-db-host
DB_PORT=5432
COGNITO_USER_POOL_ID=your-user-pool-id
COGNITO_CLIENT_ID=your-client-id
```

## Deployment

### Infrastructure Deployment
```bash
cd infrastructure
npm run cdk deploy
```

### CI/CD Pipeline
The project uses AWS CodePipeline for automated deployments:
1. Push to main branch triggers pipeline
2. Frontend and backend are built in parallel
3. Infrastructure is updated if needed
4. New versions are deployed automatically
