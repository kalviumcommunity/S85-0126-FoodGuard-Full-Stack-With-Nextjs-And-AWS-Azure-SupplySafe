# 🚀 Cloud Database Deployment Guide

This guide provides step-by-step instructions for deploying your SupplySafe application with a managed PostgreSQL database on AWS RDS or Azure PostgreSQL.

## 📋 Prerequisites

### Required Tools
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL client tools** (`psql`, `pg_dump`)
- **Git**
- **Cloud provider CLI** (AWS CLI or Azure CLI)

### Cloud Provider Setup
- **AWS**: Account with RDS access and appropriate IAM permissions
- **Azure**: Subscription with PostgreSQL database service access

---

## 🎯 Deployment Options

### Option 1: AWS RDS PostgreSQL
- **Best for**: AWS ecosystem users, extensive monitoring with CloudWatch
- **Free Tier**: db.t3.micro instance (1 vCPU, 1 GB RAM, 20 GB storage)

### Option 2: Azure Database for PostgreSQL  
- **Best for**: Azure ecosystem users, integrated Azure networking
- **Free Tier**: Basic tier (1 vCPU, 2 GB RAM, 20 GB storage)

---

## 📝 Step-by-Step Deployment

### Phase 1: Database Setup

#### AWS RDS Setup

1. **Create RDS Instance**
   ```bash
   # Using AWS Console
   # Navigate to RDS → Create Database → PostgreSQL
   
   # Or using AWS CLI
   aws rds create-db-instance \
     --db-instance-identifier supplysafe-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --engine-version 15.4 \
     --master-username admin \
     --master-user-password YourSecurePassword123! \
     --allocated-storage 20 \
     --vpc-security-group-ids sg-xxxxxxxxx \
     --backup-retention-period 7 \
     --multi-az false \
     --publicly-accessible true
   ```

2. **Configure Security**
   ```bash
   # Add your IP to security group
   aws ec2 authorize-security-group-ingress \
     --group-id sg-xxxxxxxxx \
     --protocol tcp \
     --port 5432 \
     --cidr $(curl -s ifconfig.me)/32
   ```

3. **Get Connection Details**
   ```bash
   aws rds describe-db-instances \
     --db-instance-identifier supplysafe-db \
     --query 'DBInstances[0].Endpoint.Address'
   ```

#### Azure PostgreSQL Setup

1. **Create PostgreSQL Server**
   ```bash
   # Using Azure Portal
   # Navigate to Create a resource → Databases → Azure Database for PostgreSQL
   
   # Or using Azure CLI
   az postgres server create \
     --name supplysafe-db-server \
     --resource-group supplysafe-rg \
     --location eastus \
     --admin-user adminuser \
     --admin-password YourSecurePassword123! \
     --sku-name B_Gen5_1 \
     --version 15 \
     --storage-size 20480
   ```

2. **Configure Firewall**
   ```bash
   # Add your IP to firewall rules
   az postgres server firewall-rule create \
     --resource-group supplysafe-rg \
     --server-name supplysafe-db-server \
     --name AllowYourIP \
     --start-ip-address $(curl -s ifconfig.me) \
     --end-ip-address $(curl -s ifconfig.me)
   ```

3. **Get Connection Details**
   ```bash
   az postgres server show \
     --name supplysafe-db-server \
     --resource-group supplysafe-rg \
     --query "fullyQualifiedDomainName"
   ```

---

### Phase 2: Application Configuration

1. **Update Environment Variables**
   
   Create `.env.production`:
   ```bash
   # AWS RDS
   DATABASE_URL="postgresql://admin:YourSecurePassword123!@supplysafe-db.xxxxxxxx.us-east-1.rds.amazonaws.com:5432/supplysafe?sslmode=require"
   
   # Azure PostgreSQL
   DATABASE_URL="postgresql://adminuser@supplysafe-db-server:YourSecurePassword123!@supplysafe-db-server.postgres.database.azure.com:5432/supplysafe?sslmode=require"
   
   # Other required variables
   NODE_ENV="production"
   JWT_SECRET="your-production-jwt-secret-min-32-chars"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="https://your-domain.com"
   ```

2. **Validate Configuration**
   ```bash
   # Test database connection
   npm run db:health
   
   # Validate environment
   npm run validate:env
   ```

---

### Phase 3: Database Migration

1. **Run Migration Script**
   ```bash
   # Make script executable
   chmod +x scripts/migrate-cloud-db.sh
   
   # Set environment variables
   export DATABASE_URL="your-cloud-database-url"
   export ENVIRONMENT="production"
   
   # Run migration
   ./scripts/migrate-cloud-db.sh migrate
   ```

2. **Verify Migration**
   ```bash
   # Check migration status
   ./scripts/migrate-cloud-db.sh status
   
   # Test database health
   curl http://localhost:3000/api/database/health
   ```

---

### Phase 4: Application Deployment

#### Option A: Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Application**
   ```bash
   # Login to Vercel
   vercel login
   
   # Deploy with production environment
   vercel --prod
   ```

3. **Configure Environment Variables in Vercel**
   ```bash
   vercel env add DATABASE_URL production
   vercel env add JWT_SECRET production
   vercel env add NODE_ENV production
   ```

#### Option B: Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t supplysafe:latest .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     --name supplysafe \
     -p 3000:3000 \
     -e DATABASE_URL="your-cloud-database-url" \
     -e JWT_SECRET="your-jwt-secret" \
     -e NODE_ENV="production" \
     supplysafe:latest
   ```

#### Option C: Traditional Server Deployment

1. **Install Dependencies**
   ```bash
   npm ci --production
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Start Application**
   ```bash
   npm start
   ```

---

## 🔒 Security Configuration

### Production Security Checklist

- [ ] **SSL/TLS Enabled**: All database connections use SSL
- [ ] **Network Security**: IP allowlisting, VPC/security groups
- [ ] **Password Security**: Strong, unique passwords
- [ ] **Environment Variables**: No hardcoded credentials
- [ ] **Backup Encryption**: Encrypted backups enabled
- [ ] **Access Control**: Principle of least privilege

### Security Commands

```bash
# Test SSL connection
psql "postgresql://user:pass@host:5432/db?sslmode=require"

# Verify encryption
aws rds describe-db-instances --db-instance-identifier supplysafe-db

# Check firewall rules
az postgres server firewall-rule list --resource-group supplysafe-rg --server-name supplysafe-db-server
```

---

## 📊 Monitoring Setup

### AWS CloudWatch Monitoring

1. **Create CloudWatch Dashboard**
   ```bash
   aws cloudwatch put-dashboard \
     --dashboard-name SupplySafe-Database \
     --dashboard-body file://cloudwatch-dashboard.json
   ```

2. **Set Up Alarms**
   ```bash
   # CPU utilization alarm
   aws cloudwatch put-metric-alarm \
     --alarm-name "High CPU Utilization" \
     --alarm-description "CPU > 80%" \
     --metric-name CPUUtilization \
     --namespace AWS/RDS \
     --statistic Average \
     --period 300 \
     --threshold 80 \
     --comparison-operator GreaterThanThreshold \
     --evaluation-periods 2
   ```

### Azure Monitor Setup

1. **Create Alert Rules**
   ```bash
   az monitor metrics alert create \
     --name "High CPU Usage" \
     --resource-group supplysafe-rg \
     --scopes "/subscriptions/xxx/resourceGroups/supplysafe-rg/providers/Microsoft.DBforPostgreSQL/servers/supplysafe-db-server" \
     --condition "avg cpu_percent > 80" \
     --window-size 5m \
     --evaluation-frequency 1m \
     --severity 2
   ```

---

## 🔄 Backup Strategy

### Automated Backups

#### AWS RDS
```bash
# Enable automated backups
aws rds modify-db-instance \
  --db-instance-identifier supplysafe-db \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00"

# Create manual backup
aws rds create-db-snapshot \
  --db-instance-identifier supplysafe-db \
  --db-snapshot-identifier supplysafe-manual-$(date +%Y%m%d)
```

#### Azure PostgreSQL
```bash
# Configure backup retention
az postgres server update \
  --name supplysafe-db-server \
  --resource-group supplysafe-rg \
  --backup-retention-days 7

# Create manual backup
az postgres server backup create \
  --name supplysafe-db-server \
  --resource-group supplysafe-rg \
  --backup-name supplysafe-manual-$(date +%Y%m%d)
```

### Backup Scripts

```bash
# Run automated backup
./scripts/aws-rds-backup.sh backup
./scripts/azure-postgres-backup.sh backup
```

---

## 🚨 Troubleshooting

### Common Issues

#### Connection Errors
```bash
# Test network connectivity
telnet your-db-host 5432

# Check DNS resolution
nslookup your-db-host

# Verify SSL certificate
openssl s_client -connect your-db-host:5432 -starttls postgres
```

#### Performance Issues
```bash
# Check slow queries
psql -h your-db-host -U admin -d supplysafe -c "
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
"

# Monitor connections
psql -h your-db-host -U admin -d supplysafe -c "
SELECT state, count(*) 
FROM pg_stat_activity 
GROUP BY state;
"
```

#### Migration Issues
```bash
# Reset database (development only)
./scripts/migrate-cloud-db.sh rollback

# Check migration status
./scripts/migrate-cloud-db.sh status

# Run with dry run
DRY_RUN=true ./scripts/migrate-cloud-db.sh migrate
```

---

## 📈 Performance Optimization

### Database Optimization

1. **Connection Pooling**
   ```bash
   # Configure connection pool in Prisma
   # In prisma/schema.prisma:
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     // Connection pooling handled by Prisma
   }
   ```

2. **Index Optimization**
   ```sql
   -- Add indexes for frequently queried columns
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_orders_status ON orders(status);
   CREATE INDEX idx_products_category ON products(category);
   ```

3. **Query Optimization**
   ```sql
   -- Analyze query performance
   EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
   ```

### Application Optimization

1. **Caching Strategy**
   ```bash
   # Enable Redis caching (if configured)
   export REDIS_URL="redis://your-redis-host:6379"
   ```

2. **CDN Configuration**
   ```bash
   # Configure CDN for static assets
   export NEXT_PUBLIC_CDN_URL="https://cdn.your-domain.com"
   ```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Database instance created and running
- [ ] Security groups/firewall rules configured
- [ ] SSL/TLS certificates configured
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting set up
- [ ] Environment variables configured
- [ ] Database migrations tested

### Post-Deployment
- [ ] Application accessible via HTTPS
- [ ] Database health check passing
- [ ] Monitoring dashboard functional
- [ ] Backup verification completed
- [ ] Performance baseline established
- [ ] Security audit completed

---

## 🆘 Support and Resources

### Documentation Links
- [AWS RDS Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/)
- [Azure PostgreSQL Documentation](https://docs.microsoft.com/azure/postgresql/)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Community Support
- [GitHub Issues](https://github.com/your-org/supplysafe/issues)
- [Discord Community](https://discord.gg/supplysafe)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supplysafe)

### Emergency Contacts
- Database Administrator: dba@yourcompany.com
- DevOps Team: devops@yourcompany.com
- Security Team: security@yourcompany.com

---

**🎉 Congratulations!** Your SupplySafe application is now deployed with a managed PostgreSQL database. Follow the monitoring and maintenance procedures to ensure optimal performance and reliability.
