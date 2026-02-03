# GitHub Actions Secrets Configuration

This document outlines all the secrets required for the CI/CD pipeline to function properly.

## Required Secrets for Demo

### Database Secrets (Demo)
- `DEMO_DATABASE_URL` - Demo database connection string
- `JWT_SECRET` - JWT token secret (min 32 characters)
- `REFRESH_SECRET` - JWT refresh token secret (min 32 characters)
- `SESSION_SECRET` - Session secret (min 32 characters)

### External Service Secrets (Demo)
- `DEMO_API_KEY` - Demo API key for external services
- `NEXT_PUBLIC_DEMO_API_URL` - Public demo API URL

## How to Add Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret from the list above

## Environment-Specific Configuration

### Development Environment
- Uses local environment variables
- No secrets required for local development

### Staging Environment
- Triggered on pushes to `develop` branch
- Uses staging versions of all secrets
- Deployed to staging demo URL

### Production Environment
- Triggered on pushes to `main` branch
- Uses production versions of all secrets
- Deployed to production demo URL

## Testing Secrets Locally

For local testing, create a `.env.local` file with the required variables:

```bash
# Database
DATABASE_URL="postgresql://localhost:5432/foodguard_demo"

# JWT
JWT_SECRET="demo_jwt_secret_min_32_characters_long"
REFRESH_SECRET="demo_refresh_secret_min_32_characters_long"
SESSION_SECRET="demo_session_secret_min_32_characters_long"

# Demo API
DEMO_API_KEY="demo_api_key_for_testing"
NEXT_PUBLIC_DEMO_API_URL="http://localhost:3000/api"
```

## Security Best Practices

1. **Never commit secrets to the repository**
2. **Use different secrets for staging and production**
3. **Rotate secrets regularly**
4. **Use principle of least privilege**
5. **Monitor secret usage and access logs**

## Demo Deployment Configuration

Since this is a demo setup without AWS, the deployment stages simulate:

- **Staging**: Simulated deployment to https://staging.foodguard-demo.com
- **Production**: Simulated deployment to https://foodguard-demo.com

The pipeline will:
1. Build the application
2. Upload build artifacts
3. Simulate deployment with echo commands
4. Provide deployment URLs in logs
5. Send notifications on success/failure

## Troubleshooting

### Common Issues

1. **Missing Secrets**: Ensure all required secrets are added to GitHub repository settings
2. **Incorrect Permissions**: Verify secrets have necessary permissions
3. **Expired Tokens**: Check and update expired API keys and tokens
4. **Network Issues**: Ensure deployment targets are accessible from GitHub Actions runners

### Debugging Steps

1. Check GitHub Actions logs for specific error messages
2. Verify secret names match exactly (case-sensitive)
3. Test secrets locally before adding to GitHub
4. Use workflow_dispatch for manual testing

## Monitoring and Alerts

- Console notifications for deployment success/failure
- Lighthouse performance reports
- Security scan results
- Build artifact retention policies
