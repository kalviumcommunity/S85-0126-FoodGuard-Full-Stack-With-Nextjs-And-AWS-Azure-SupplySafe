# GitHub Actions Secrets Configuration

This document outlines all the secrets required for the CI/CD pipeline to function properly.

## Required Secrets

### AWS Secrets
- `AWS_ACCESS_KEY_ID` - AWS access key for S3 deployment
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for S3 deployment
- `AWS_REGION` - AWS region (default: us-east-1)
- `AWS_S3_BUCKET_NAME` - S3 bucket name for static assets
- `AWS_CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID for cache invalidation

### Azure Secrets
- `AZURE_STORAGE_CONNECTION_STRING` - Azure storage connection string
- `AZURE_STORAGE_ACCOUNT_NAME` - Azure storage account name
- `AZURE_STORAGE_CONTAINER_NAME` - Azure storage container name

### Database Secrets
- `PRODUCTION_DATABASE_URL` - Production database connection string

### Vercel Secrets
- `VERCEL_TOKEN` - Vercel API token for deployment
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### External Service Secrets
- `SENDGRID_API_KEY` - SendGrid API key for email services
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### Application Secrets
- `JWT_SECRET` - JWT token secret (min 32 characters)
- `REFRESH_SECRET` - JWT refresh token secret (min 32 characters)
- `SESSION_SECRET` - Session secret (min 32 characters)

### Notification Secrets
- `SLACK_WEBHOOK_URL` - Slack webhook URL for deployment notifications

### Lighthouse CI Secrets
- `LHCI_GITHUB_APP_TOKEN` - Lighthouse CI GitHub app token

### Production URL
- `PRODUCTION_URL` - Production application URL

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
- Deployed to Vercel staging URL

### Production Environment
- Triggered on pushes to `main` branch
- Uses production versions of all secrets
- Deployed to Vercel production URL and AWS S3

## Security Best Practices

1. **Never commit secrets to the repository**
2. **Use different secrets for staging and production**
3. **Rotate secrets regularly**
4. **Use principle of least privilege**
5. **Monitor secret usage and access logs**

## Testing Secrets Locally

For local testing, create a `.env.local` file with the required variables:

```bash
# Database
DATABASE_URL="postgresql://localhost:5432/foodguard_dev"

# JWT
JWT_SECRET="your_jwt_secret_min_32_characters_long"
REFRESH_SECRET="your_refresh_secret_min_32_characters_long"
SESSION_SECRET="your_session_secret_min_32_characters_long"

# AWS (for testing S3 uploads)
AWS_ACCESS_KEY_ID="your_test_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_test_aws_secret_key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your_test_bucket"

# Azure (for testing Azure uploads)
AZURE_STORAGE_CONNECTION_STRING="your_test_azure_connection_string"
AZURE_STORAGE_ACCOUNT_NAME="your_test_storage_account"
AZURE_STORAGE_CONTAINER_NAME="your_test_container"

# External Services
SENDGRID_API_KEY="your_test_sendgrid_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_public_key"
```

## Secret Rotation Strategy

### Monthly Rotation
- JWT secrets
- Session secrets
- API keys

### Quarterly Rotation
- Database connection strings
- Storage access keys

### Annual Rotation
- All production secrets
- Review and update access permissions

## Troubleshooting

### Common Issues

1. **Missing Secrets**: Ensure all required secrets are added to GitHub repository settings
2. **Incorrect Permissions**: Verify AWS/Azure credentials have necessary permissions
3. **Expired Tokens**: Check and update expired API keys and tokens
4. **Network Issues**: Ensure deployment targets are accessible from GitHub Actions runners

### Debugging Steps

1. Check GitHub Actions logs for specific error messages
2. Verify secret names match exactly (case-sensitive)
3. Test secrets locally before adding to GitHub
4. Use workflow_dispatch for manual testing

## Monitoring and Alerts

- Slack notifications for deployment success/failure
- Lighthouse performance reports
- Security scan results
- Build artifact retention policies
