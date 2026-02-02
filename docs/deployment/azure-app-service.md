# Azure App Service for Containers Deployment Guide

This guide explains how to deploy the SupplySafe Next.js application to Azure App Service for Containers.

## Prerequisites

- Azure CLI installed and configured
- Docker installed
- Azure subscription with appropriate permissions

## Step 1: Create Resource Group

```bash
az group create \
    --name supplysafe-rg \
    --location "East US"
```

## Step 2: Create Azure Container Registry

```bash
az acr create \
    --resource-group supplysafe-rg \
    --name kalviumregistry \
    --sku Basic \
    --admin-enabled true
```

## Step 3: Build and Push Docker Image

```bash
# Log in to ACR
az acr login --name kalviumregistry

# Build the image
docker build -t supplysafe .

# Tag the image
docker tag supplysafe:latest kalviumregistry.azurecr.io/supplysafe:latest

# Push to ACR
docker push kalviumregistry.azurecr.io/supplysafe:latest
```

## Step 4: Create App Service Plan

```bash
az appservice plan create \
    --name supplysafe-plan \
    --resource-group supplysafe-rg \
    --sku B1 \
    --is-linux
```

## Step 5: Create Web App for Containers

```bash
az webapp create \
    --resource-group supplysafe-rg \
    --plan supplysafe-plan \
    --name supplysafe-app \
    --deployment-container-image-name kalviumregistry.azurecr.io/supplysafe:latest
```

## Step 6: Configure Container Settings

```bash
# Set container image
az webapp config container set \
    --resource-group supplysafe-rg \
    --name supplysafe-app \
    --docker-custom-image-name kalviumregistry.azurecr.io/supplysafe:latest \
    --docker-registry-server-url https://kalviumregistry.azurecr.io

# Configure startup command
az webapp config appsettings set \
    --resource-group supplysafe-rg \
    --name supplysafe-app \
    --settings WEBSITES_PORT=3000 \
    --settings WEBSITES_CONTAINER_START_TIME_LIMIT=180
```

## Step 7: Configure Application Settings

```bash
# Set environment variables
az webapp config appsettings set \
    --resource-group supplysafe-rg \
    --name supplysafe-app \
    --settings NODE_ENV=production \
    --settings DATABASE_URL="your-database-connection-string" \
    --settings JWT_SECRET="your-jwt-secret" \
    --settings NEXTAUTH_SECRET="your-nextauth-secret" \
    --settings NEXTAUTH_URL="https://supplysafe-app.azurewebsites.net"
```

## Step 8: Enable Continuous Deployment

```bash
# Configure CI/CD from ACR
az webapp deployment container config \
    --resource-group supplysafe-rg \
    --name supplysafe-app \
    --enable-cd true
```

## Step 9: Configure Health Monitoring

```bash
# Enable health check
az webapp config set \
    --resource-group supplysafe-rg \
    --name supplysafe-app \
    --http20-enabled true \
    --min-tls-version 1.2

# Set up auto-healing
az webapp config auto-heal enable \
    --resource-group supplysafe-rg \
    --name supplysafe-app

az webapp config auto-heal rules add \
    --resource-group supplysafe-rg \
    --name supplysafe-app \
    --rule-name "HealthCheckRule" \
    --status-codes "500" \
    --action-type "RestartAppService" \
    --action-custom-action "" \
    --action-min-process-execution-time "00:05:00" \
    --trigger-status-code "500" \
    --trigger-request-count "10" \
    --trigger-time-interval "00:05:00"
```

## Step 10: Set up Auto Scaling

```bash
# Create auto-scale profile
az monitor autoscale create \
    --resource-group supplysafe-rg \
    --resource-name supplysafe-plan \
    --resource-type Microsoft.Web/serverfarms \
    --min-count 1 \
    --max-count 5 \
    --count 1 \
    --name supplysafe-autoscale

# Add scale-out rule
az monitor autoscale rule create \
    --resource-group supplysafe-rg \
    --resource-name supplysafe-plan \
    --resource-type Microsoft.Web/serverfarms \
    --autoscale-name supplysafe-autoscale \
    --condition "Percentage CPU > 75 avg 5m" \
    --scale out 1

# Add scale-in rule
az monitor autoscale rule create \
    --resource-group supplysafe-rg \
    --resource-name supplysafe-plan \
    --resource-type Microsoft.Web/serverfarms \
    --autoscale-name supplysafe-autoscale \
    --condition "Percentage CPU < 25 avg 5m" \
    --scale in 1
```

## Step 11: Configure Custom Domain and SSL (Optional)

```bash
# Add custom domain
az webapp config hostname add \
    --webapp-name supplysafe-app \
    --resource-group supplysafe-rg \
    --hostname yourdomain.com

# Bind SSL certificate
az webapp config ssl bind \
    --resource-group supplysafe-rg \
    --webapp-name supplysafe-app \
    --certificate-thumbprint YOUR_CERT_THUMBPRINT \
    --ssl-type SNIEnabled
```

## Monitoring and Logging

### Enable Application Logging

```bash
# Enable file system logging
az webapp log config \
    --resource-group supplysafe-rg \
    --name supplysafe-app \
    --application-logging filesystem \
    --detailed-error-messages true \
    --failed-request-tracing true

# Enable container logging
az webapp log config \
    --resource-group supplysafe-rg \
    --name supplysafe-app \
    --web-server-logging filesystem
```

### View Logs

```bash
# Stream logs in real-time
az webapp log tail \
    --resource-group supplysafe-rg \
    --name supplysafe-app

# Download logs
az webapp log download \
    --resource-group supplysafe-rg \
    --name supplysafe-app
```

### Monitor Performance

```bash
# Get metrics
az monitor metrics list \
    --resource "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/supplysafe-rg/providers/Microsoft.Web/sites/supplysafe-app" \
    --metric "CpuTime,Requests,Http5xx" \
    --interval PT1H
```

## CI/CD Integration

The GitHub Actions workflow in `.github/workflows/deploy-azure.yml` automates the deployment process:

1. Builds and pushes Docker image to ACR
2. Deploys new image to Azure App Service
3. Handles rolling deployments for zero downtime

### Required GitHub Secrets

- `AZURE_CREDENTIALS`: Azure service principal credentials
- `ACR_USERNAME`: Azure Container Registry username
- `ACR_PASSWORD`: Azure Container Registry password

## Security Configuration

### Enable Managed Identity

```bash
# Enable system-assigned managed identity
az webapp identity assign \
    --resource-group supplysafe-rg \
    --name supplysafe-app

# Grant access to Azure resources (example: Key Vault)
az keyvault set-policy \
    --name your-key-vault \
    --object-id $(az webapp identity show --resource-group supplysafe-rg --name supplysafe-app --query principalId -o tsv) \
    --secret-permissions get list
```

### Network Configuration

```bash
# Configure VNet integration (if using VNet)
az webapp vnet-integration add \
    --resource-group supplysafe-rg \
    --name supplysafe-app \
    --vnet your-vnet-name \
    --subnet your-subnet-name

# Restrict access to specific IP addresses
az webapp config access-restriction add \
    --resource-group supplysafe-rg \
    --name supplysafe-app \
    --rule-name AllowYourIP \
    --action Allow \
    --ip-address YOUR_IP_ADDRESS \
    --priority 100
```

## Backup and Recovery

### Configure Backups

```bash
# Configure backup settings
az webapp config backup create \
    --resource-group supplysafe-rg \
    --name supplysafe-app \
    --backup-name supplysafe-backup \
    --container-name backup-container \
    --storage-account yourstorageaccount \
    --retention 7
```

### Restore from Backup

```bash
# Restore from backup
az webapp config backup restore \
    --resource-group supplysafe-rg \
    --name supplysafe-app \
    --backup-name supplysafe-backup \
    --container-name backup-container \
    --storage-account yourstorageaccount \
    --overwrite
```

## Troubleshooting

### Common Issues

1. **Container fails to start**: Check application logs and environment variables
2. **Health check failures**: Ensure the `/api/health` endpoint is accessible
3. **Memory issues**: Monitor memory usage and consider scaling up

### Debug Commands

```bash
# Check container logs
az webapp log tail --resource-group supplysafe-rg --name supplysafe-app

# Get detailed configuration
az webapp show --resource-group supplysafe-rg --name supplysafe-app

# Check deployment status
az webapp deployment list --resource-group supplysafe-rg --name supplysafe-app
```

## Cost Optimization

- Use appropriate App Service tier based on traffic patterns
- Implement auto-scaling to handle traffic spikes
- Monitor and optimize resource utilization
- Consider using reserved instances for predictable workloads
- Use Azure Cost Management to track and optimize spending
