# Database Backup and Maintenance Scripts

This directory contains scripts for managing backups and maintenance of your managed PostgreSQL databases.

## 📁 Scripts Overview

### AWS RDS Scripts
- **`aws-rds-backup.sh`** - Comprehensive backup and maintenance script for AWS RDS PostgreSQL

### Azure PostgreSQL Scripts  
- **`azure-postgres-backup.sh`** - Backup and maintenance script for Azure Database for PostgreSQL

## 🚀 Quick Start

### AWS RDS Setup

1. **Make the script executable:**
   ```bash
   chmod +x scripts/aws-rds-backup.sh
   ```

2. **Set environment variables:**
   ```bash
   export DB_IDENTIFIER="supplysafe-db"
   export AWS_REGION="us-east-1"
   export BACKUP_RETENTION_DAYS="7"
   export S3_BUCKET="supplysafe-backups"
   ```

3. **Run a backup:**
   ```bash
   ./scripts/aws-rds-backup.sh backup
   ```

### Azure PostgreSQL Setup

1. **Make the script executable:**
   ```bash
   chmod +x scripts/azure-postgres-backup.sh
   ```

2. **Set environment variables:**
   ```bash
   export RESOURCE_GROUP="supplysafe-rg"
   export SERVER_NAME="supplysafe-db-server"
   export BACKUP_RETENTION_DAYS="7"
   export STORAGE_ACCOUNT="supplysafestorage"
   ```

3. **Run a backup:**
   ```bash
   ./scripts/azure-postgres-backup.sh backup
   ```

## 📋 Available Commands

### AWS RDS Script Commands

| Command | Description |
|---------|-------------|
| `snapshot` | Create a manual database snapshot |
| `list` | List all manual snapshots |
| `cleanup` | Delete snapshots older than retention period |
| `export` | Export snapshot to S3 (requires snapshot name) |
| `status` | Get database instance status |
| `backup` | Create snapshot, cleanup old ones, and export to S3 |
| `help` | Show help message |

### Azure PostgreSQL Script Commands

| Command | Description |
|---------|-------------|
| `backup` | Create database backup and upload to storage |
| `list` | List all backups in storage |
| `download` | Download backup from storage |
| `cleanup` | Delete backups older than retention period |
| `restore` | Restore database from backup |
| `status` | Get PostgreSQL server status |
| `full-backup` | Create backup, upload, and cleanup old ones |
| `help` | Show help message |

## 🔧 Configuration

### Environment Variables

#### AWS RDS
- `DB_IDENTIFIER` - Database instance identifier (default: supplysafe-db)
- `AWS_REGION` - AWS region (default: us-east-1)
- `BACKUP_RETENTION_DAYS` - Backup retention period in days (default: 7)
- `S3_BUCKET` - S3 bucket for exports (default: supplysafe-backups)
- `BACKUP_PREFIX` - S3 prefix for backups (default: rds-backups)

#### Azure PostgreSQL
- `RESOURCE_GROUP` - Azure resource group (default: supplysafe-rg)
- `SERVER_NAME` - PostgreSQL server name (default: supplysafe-db-server)
- `BACKUP_RETENTION_DAYS` - Backup retention period in days (default: 7)
- `STORAGE_ACCOUNT` - Azure storage account (default: supplysafestorage)
- `CONTAINER_NAME` - Storage container name (default: postgres-backups)

## 📅 Automation

### Cron Jobs Setup

#### AWS RDS Daily Backup
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/supplysafe/scripts/aws-rds-backup.sh backup >> /var/log/rds-backup.log 2>&1
```

#### Azure PostgreSQL Daily Backup
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/supplysafe/scripts/azure-postgres-backup.sh full-backup >> /var/log/azure-backup.log 2>&1
```

### GitHub Actions Workflow

Create `.github/workflows/database-backup.yml`:

```yaml
name: Database Backup

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  aws-backup:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Setup AWS CLI
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}
      - name: Run AWS RDS Backup
        run: ./scripts/aws-rds-backup.sh backup
        env:
          DB_IDENTIFIER: ${{ secrets.DB_IDENTIFIER }}
          S3_BUCKET: ${{ secrets.S3_BUCKET }}

  azure-backup:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Setup Azure CLI
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - name: Run Azure Backup
        run: ./scripts/azure-postgres-backup.sh backup
        env:
          RESOURCE_GROUP: ${{ secrets.RESOURCE_GROUP }}
          SERVER_NAME: ${{ secrets.SERVER_NAME }}
          STORAGE_ACCOUNT: ${{ secrets.STORAGE_ACCOUNT }}
```

## 🔍 Monitoring and Alerts

### AWS CloudWatch Monitoring

1. **Create CloudWatch Alarms:**
   - RDS CPU utilization > 80%
   - RDS free storage < 10%
   - RDS connection count > threshold

2. **SNS Notifications:**
   - Set up SNS topic for backup notifications
   - Subscribe email/SMS endpoints

### Azure Monitor Integration

1. **Create Alert Rules:**
   - CPU percentage > 80%
   - Storage percentage > 90%
   - Connection failures

2. **Action Groups:**
   - Email notifications
   - SMS alerts
   - Webhook integrations

## 🚨 Troubleshooting

### Common Issues

#### AWS RDS
- **IAM Permissions:** Ensure the IAM role has `rds:*` and `s3:*` permissions
- **VPC Configuration:** Verify security group allows RDS access
- **Storage Limits:** Check S3 bucket permissions and size limits

#### Azure PostgreSQL
- **Authentication:** Verify Azure login and subscription
- **Network Rules:** Check firewall rules allow access
- **Storage Account:** Ensure storage account exists and is accessible

### Debug Mode

Enable verbose logging by setting environment variable:
```bash
export DEBUG=true
./scripts/aws-rds-backup.sh backup
```

## 📚 Additional Resources

- [AWS RDS Backup Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BackupRestore.html)
- [Azure PostgreSQL Backup Documentation](https://docs.microsoft.com/azure/postgresql/concepts-backup)
- [PostgreSQL Backup Best Practices](https://www.postgresql.org/docs/current/backup.html)

---

**⚠️ Important:** Always test backup and restore procedures in a non-production environment before implementing in production.
