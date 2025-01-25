# Chako - Integrated Intranet Portal

A modern, web-based integrated intranet portal built with Vue.js and Python microservices.

## Overview

Chako is a sophisticated intranet portal designed to provide a seamless experience for company staff. Built with modern technologies and best practices, it offers:

- Single Page Application (SPA) frontend using Vue.js
- Microservices backend architecture with Python
- Secure authentication with AWS Cognito and Google SSO
- High-performance infrastructure on AWS

## Architecture

### Frontend
- Vue.js with TypeScript (vue-ts template)
- Bootstrap for modern, consistent UI
- Mobile-first responsive design
- Accessibility-focused components
- S3 deployment with CloudFront caching

### Backend
- Python 3.12 microservices
- REST APIs via API Gateway
- AWS Lambda for serverless compute
- Aurora PostgreSQL Serverless v2 with RLS
- Cognito-based authentication

### Infrastructure
- AWS CDK for infrastructure as code
- CodePipeline for automated deployments
- "chako-" prefix for all AWS resources
- Cloudflare for domain management

## Repository Structure

```
chako/
├── frontend/                    # Vue.js SPA
├── backend/                    # Python microservices
│   ├── auth/                  # Authentication service
│   ├── api/                   # API services
│   └── shared/                # Shared utilities
├── infrastructure/            # AWS CDK
├── pipeline/                  # AWS CodePipeline
└── docs/                      # Documentation
```

## Development

### Prerequisites
- Node.js (Latest LTS)
- Python 3.12
- AWS CDK CLI
- AWS CLI

### Getting Started
1. Frontend Setup
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. Backend Setup
   ```bash
   cd backend/auth
   pip install -r requirements.txt
   ```

3. Infrastructure Setup
   ```bash
   cd infrastructure
   npm install
   cdk synth
   ```

## Security

Chako implements comprehensive security measures:
- XSS prevention
- XSRF protection
- SQL injection prevention
- Row-level security in database
- Secure authentication via Cognito/SSO

## Documentation

Detailed documentation is available in the `/docs` directory:
- Architecture overview
- API specifications
- Setup guides
