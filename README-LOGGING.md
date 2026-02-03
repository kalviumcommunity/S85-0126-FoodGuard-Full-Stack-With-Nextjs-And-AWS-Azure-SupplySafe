# SupplySafe Logging and Monitoring Setup

This document outlines the comprehensive logging and monitoring implementation for the SupplySafe application.

## Overview

The logging system provides:
- Structured JSON logging with correlation IDs
- Request/response tracking with timing
- Error tracking and alerting
- Cloud platform integration (AWS CloudWatch & Azure Monitor)
- Docker container logging configuration

## Components

### 1. Structured Logging Utility (`src/lib/logger.ts`)

Features:
- JSON-formatted logs for easy parsing
- Correlation IDs for request tracing
- Multiple log levels (info, warn, error, debug)
- Context-aware logging
- API request/response helpers

Usage:
```typescript
import { logger, Logger } from '@/lib/logger';

// Generate request ID
const requestId = Logger.generateRequestId();

// Log with correlation ID
logger.info("User login attempt", { email: "user@example.com" }, "AUTH", requestId);

// Log API request/response
logger.logApiRequest("POST", "/api/auth/login", requestId);
logger.logApiResponse("POST", "/api/auth/login", 200, requestId, 150);
```

### 2. Logging Middleware (`src/lib/middleware/logging-middleware.ts`)

Provides automatic request/response logging for API routes:
- Request timing
- User agent and IP tracking
- Response status and timing
- Error handling and logging

Usage:
```typescript
import { withLogging } from '@/lib/middleware/logging-middleware';

export const GET = withLogging(async (req: NextRequest) => {
  // Your route logic here
});
```

### 3. Cloud Platform Integration

#### AWS CloudWatch (`aws-cloudwatch-config.json`)

Configuration includes:
- Log group: `/ecs/supplysafe-app`
- Metric filters for errors, response times, auth failures
- Dashboard widgets for monitoring
- Alert rules for high error rates and response times

Setup:
1. Configure ECS task definition with awslogs driver
2. Create metric filters in CloudWatch
3. Set up dashboards and alarms
4. Configure SNS notifications

#### Azure Monitor (`azure-monitor-config.json`)

Configuration includes:
- Diagnostic settings for App Service
- Log Analytics queries
- Dashboard configurations
- Alert rules with email/Slack notifications

Setup:
1. Enable diagnostic settings on App Service
2. Configure Log Analytics workspace
3. Create dashboards and alerts
4. Set up action groups for notifications

### 4. Docker Configuration (`docker-compose.yml`)

All services configured with:
- JSON file logging driver
- Log rotation (10MB max, 3 files)
- Service labels for identification
- Production environment settings

## Log Retention Policy

- **Operational logs**: 7-14 days
- **Audit logs**: 90+ days
- **Error logs**: 30 days
- **Archived logs**: Store in S3/Azure Blob Storage

## Monitoring Metrics

### Application Metrics
- API response time
- Error rate
- Request count
- Authentication failures
- Database query performance

### Infrastructure Metrics
- CPU utilization
- Memory usage
- Disk I/O
- Network traffic
- Container health

## Alert Thresholds

- **Error rate**: >10 errors/hour
- **Response time**: >2 seconds average
- **Auth failures**: >5 failures/hour
- **CPU usage**: >80%
- **Memory usage**: >85%

## Implementation Checklist

- [x] Structured logging utility with correlation IDs
- [x] Logging middleware for Next.js
- [x] AWS CloudWatch configuration
- [x] Azure Monitor configuration
- [x] Dashboard configurations
- [x] Alert configurations
- [x] Docker logging configuration
- [ ] Update remaining API routes with structured logging

## Next Steps

1. Apply logging middleware to all API routes
2. Test logging in development environment
3. Deploy to staging and verify log aggregation
4. Configure production alerts and notifications
5. Set up log archival to S3/Azure Blob Storage

## Troubleshooting

### Common Issues

1. **Missing correlation IDs**: Ensure Logger.generateRequestId() is called at request start
2. **Logs not appearing in CloudWatch**: Check ECS task definition log configuration
3. **High log volume**: Adjust log levels and retention policies
4. **Alert fatigue**: Fine-tune alert thresholds and frequencies

### Log Query Examples

#### CloudWatch Logs Insights
```sql
fields @timestamp, @message, level, requestId, context
| filter level = 'error'
| sort @timestamp desc
| limit 100
```

#### Azure Log Analytics
```kql
AppServiceConsoleLogs
| where Level == "Error"
| summarize count() by bin(TimeGenerated, 1h)
| render timechart
```

## Security Considerations

- No sensitive data in logs (passwords, tokens, PII)
- Encrypted log transmission
- Access-controlled log viewing
- Regular log rotation and cleanup
- Audit trail for log access
