# AWS ECS Deployment Guide

This guide explains how to deploy the SupplySafe Next.js application to AWS ECS using Fargate.

## Prerequisites

- AWS CLI installed and configured
- Docker installed
- IAM permissions for ECS, ECR, and Secrets Manager

## Step 1: Create ECR Repository

```bash
aws ecr create-repository \
    --repository-name nextjs-app \
    --region ap-south-1
```

## Step 2: Build and Push Docker Image

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com

# Build the image
docker build -t nextjs-app .

# Tag the image
docker tag nextjs-app:latest YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/nextjs-app:latest

# Push to ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/nextjs-app:latest
```

## Step 3: Store Secrets in AWS Secrets Manager

```bash
# Database URL
aws secretsmanager create-secret \
    --name supplysafe/db-url \
    --secret-string "postgresql://username:password@host:port/database"

# JWT Secret
aws secretsmanager create-secret \
    --name supplysafe/jwt-secret \
    --secret-string "your-jwt-secret-here"

# NextAuth Secret
aws secretsmanager create-secret \
    --name supplysafe/nextauth-secret \
    --secret-string "your-nextauth-secret-here"
```

## Step 4: Create ECS Cluster

```bash
aws ecs create-cluster \
    --cluster-name supplysafe-cluster \
    --service-connect default
```

## Step 5: Create Task Definition

1. Update the `.aws/task-definition.json` file:
   - Replace `YOUR_ACCOUNT_ID` with your actual AWS account ID
   - Update ARNs for IAM roles if different

2. Register the task definition:
```bash
aws ecs register-task-definition \
    --cli-input-json file://.aws/task-definition.json
```

## Step 6: Create ECS Service

```bash
aws ecs create-service \
    --cluster supplysafe-cluster \
    --service-name supplysafe-service \
    --task-definition supplysafe-task \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678,subnet-87654321],securityGroups=[sg-12345678],assignPublicIp=ENABLED}" \
    --health-check-grace-period-seconds 60
```

## Step 7: Configure Auto Scaling

```bash
# Create target tracking scaling policy
aws application-autoscaling put-scaling-policy \
    --policy-name supplysafe-scale-out \
    --service-namespace ecs \
    --resource-id service/supplysafe-cluster/supplysafe-service \
    --scalable-dimension ecs:service:DesiredCount \
    --policy-type TargetTrackingScaling \
    --target-tracking-scaling-policy-configuration file://<(echo '{
        "TargetValue": 70.0,
        "PredefinedMetricSpecification": {
            "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
        },
        "ScaleInCooldown": 300,
        "ScaleOutCooldown": 60
    }')
```

## Step 8: Set up Application Load Balancer (Optional)

For production deployments, configure an ALB:

```bash
# Create target group
aws elbv2 create-target-group \
    --name supplysafe-tg \
    --protocol HTTP \
    --port 3000 \
    --target-type ip \
    --vpc-id vpc-12345678

# Create load balancer
aws elbv2 create-load-balancer \
    --name supplysafe-alb \
    --subnets subnet-12345678 subnet-87654321 \
    --security-groups sg-12345678

# Create listener
aws elbv2 create-listener \
    --load-balancer-arn arn:aws:elasticloadbalancing:region:account-id:loadbalancer/app/supplysafe-alb/50dc6c495c0c9188 \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:region:account-id:targetgroup/supplysafe-tg/50dc6c495c0c9188
```

## Step 9: Update Service with Load Balancer

```bash
aws ecs update-service \
    --cluster supplysafe-cluster \
    --service supplysafe-service \
    --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:region:account-id:targetgroup/supplysafe-tg/50dc6c495c0c9188,containerName=supplysafe,containerPort=3000
```

## Monitoring and Logging

### View Logs
```bash
aws logs tail /ecs/supplysafe --follow
```

### Check Service Status
```bash
aws ecs describe-services \
    --cluster supplysafe-cluster \
    --services supplysafe-service
```

### Monitor Tasks
```bash
aws ecs list-tasks --cluster supplysafe-cluster
aws ecs describe-tasks --cluster supplysafe-cluster --tasks TASK_ID
```

## Health Checks

The application includes a health check endpoint at `/api/health`. The task definition is configured to use this endpoint for container health monitoring.

## CI/CD Integration

The GitHub Actions workflow in `.github/workflows/deploy-aws.yml` automates the deployment process:

1. Builds and pushes Docker image to ECR
2. Updates task definition with new image
3. Deploys new task definition to ECS service
4. Waits for service stability

## Troubleshooting

### Common Issues

1. **Container fails to start**: Check logs for missing environment variables or database connection issues
2. **Health check failures**: Ensure the `/api/health` endpoint is accessible
3. **Memory/CPU limits**: Adjust resource allocation in task definition if needed

### Debug Commands

```bash
# View container logs
aws logs get-log-events --log-group-name /ecs/supplysafe --log-stream-name ecs/supplysafe/CONTAINER_ID

# Execute command in running container
aws ecs execute-command \
    --cluster supplysafe-cluster \
    --task TASK_ID \
    --container supplysafe \
    --command "/bin/sh" \
    --interactive
```

## Cost Optimization

- Use Fargate Spot instances for non-production workloads
- Implement proper auto-scaling policies
- Monitor and adjust resource allocation based on usage patterns
- Consider using Graviton instances for better price-performance ratio
