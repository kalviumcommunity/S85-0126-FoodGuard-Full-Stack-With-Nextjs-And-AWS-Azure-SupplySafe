# SupplySafe

A modern food supply chain management platform built with Next.js, TypeScript, and Prisma.

## 🚀 Features

- **Supply Chain Management**: Track food products from farm to table
- **Quality Control**: Monitor and maintain food safety standards
- **Real-time Analytics**: Dashboard with insights and metrics
- **User Management**: Role-based access control
- **Audit Trail**: Complete traceability of food products

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: TailwindCSS, Radix UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT, NextAuth.js
- **Deployment**: Docker, AWS ECS / Azure App Service

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL
- Docker (for containerization)
- AWS CLI or Azure CLI (for cloud deployment)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/kalviumcommunity/S85-0126-FoodGuard-Full-Stack-With-Nextjs-And-AWS-Azure-SupplySafe.git
   cd SupplySafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database URL and secrets
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🐳 Docker Deployment

### Build and Run Locally

1. **Build the Docker image**
   ```bash
   docker build -t supplysafe .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="your-database-url" \
     -e JWT_SECRET="your-jwt-secret" \
     supplysafe
   ```

3. **Access the application**
   Open [http://localhost:3000](http://localhost:3000)

## ☁️ Cloud Deployment

### AWS ECS Deployment

Follow the detailed guide in [docs/deployment/aws-ecs.md](docs/deployment/aws-ecs.md)

**Quick Steps:**
1. Create ECR repository
2. Build and push Docker image
3. Set up ECS cluster and task definition
4. Configure auto-scaling and load balancing
5. Set up CI/CD with GitHub Actions

### Azure App Service Deployment

Follow the detailed guide in [docs/deployment/azure-app-service.md](docs/deployment/azure-app-service.md)

**Quick Steps:**
1. Create Azure Container Registry
2. Build and push Docker image
3. Create App Service for Containers
4. Configure health monitoring and auto-scaling
5. Set up CI/CD with GitHub Actions

## 🔄 CI/CD Pipeline

The project includes automated CI/CD pipelines for both AWS and Azure:

- **AWS**: `.github/workflows/deploy-aws.yml`
- **Azure**: `.github/workflows/deploy-azure.yml`

### Required Secrets

#### AWS Deployment
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

#### Azure Deployment
- `AZURE_CREDENTIALS`
- `ACR_USERNAME`
- `ACR_PASSWORD`

## 📊 Monitoring and Health Checks

### Health Check Endpoint

The application includes a health check endpoint at `/api/health`:

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Monitoring Setup

- **AWS ECS**: CloudWatch Logs, Container Insights
- **Azure App Service**: Application Insights, Log Analytics
- **Health Checks**: Configured for automatic recovery

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/supplysafe"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# AWS (optional)
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"

# Azure (optional)
AZURE_CLIENT_ID="your-client-id"
AZURE_CLIENT_SECRET="your-client-secret"
AZURE_TENANT_ID="your-tenant-id"
```

## 📈 Performance Optimization

### Docker Optimizations

- **Multi-stage builds** to reduce image size
- **Alpine Linux** base images for minimal footprint
- **.dockerignore** to exclude unnecessary files
- **Standalone output** for optimal container performance

### Production Considerations

- **Cold starts**: Optimized with lightweight base images
- **Health checks**: 30-second intervals with 3 retries
- **Resource sizing**: 512MB RAM, 0.25 vCPU minimum
- **Auto-scaling**: CPU-based scaling between 1-3 instances

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests (when implemented)
npm run test
```

## 📝 Database Management

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the [deployment guides](docs/deployment/)
- Review the [API documentation](docs/api/)

## 🏆 Project Structure

```
SupplySafe/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript definitions
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
├── docs/                    # Documentation
├── .github/                 # GitHub Actions workflows
├── .aws/                    # AWS configuration files
├── Dockerfile               # Docker configuration
├── .dockerignore           # Docker ignore rules
└── README.md               # This file
```

---

**Built with ❤️ for food safety and supply chain transparency**
