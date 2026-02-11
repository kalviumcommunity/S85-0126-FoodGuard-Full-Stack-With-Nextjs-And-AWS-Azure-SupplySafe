# SupplySafe Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository with your code
- Production database (Supabase recommended)

## Step 1: Database Setup

### Option A: Supabase (Recommended)
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string
4. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Option B: Other PostgreSQL Providers
- Ensure you have a PostgreSQL database URL
- Run migrations: `npx prisma migrate deploy`

## Step 2: Environment Variables

Add these environment variables in your Vercel dashboard:

### Required Variables
```
DATABASE_URL=your_production_database_url
JWT_SECRET=your_secure_jwt_secret_32_chars_min
REFRESH_SECRET=your_secure_refresh_secret_32_chars_min
SESSION_SECRET=your_secure_session_secret_32_chars_min
NEXT_PUBLIC_API_BASE_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_NAME=SupplySafe
```

### Supabase Variables (if using Supabase)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### AWS Variables (if using AWS)
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

### Optional Variables
```
SENDGRID_API_KEY=your_sendgrid_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
REDIS_URL=your_redis_url
```

## Step 3: Deploy to Vercel

### Method 1: Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Vercel will automatically detect Next.js
5. Configure environment variables
6. Click "Deploy"

## Step 4: Post-Deployment

### Database Migration
After deployment, run migrations on your production database:
```bash
npx prisma migrate deploy
```

### Seed Data (Optional)
If you have seed data:
```bash
npx prisma db seed
```

### Verify Deployment
1. Check your Vercel deployment URL
2. Test key functionality:
   - User registration/login
   - Database operations
   - File uploads (if configured)

## Troubleshooting

### Build Issues
- Check that all environment variables are set
- Ensure `DATABASE_URL` is correct and accessible
- Verify Prisma schema matches database

### Runtime Issues
- Check Vercel function logs
- Verify database connection
- Ensure CORS settings are correct

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check database firewall settings
- Ensure SSL is properly configured

## Environment-Specific URLs

Update these URLs after deployment:
- `NEXT_PUBLIC_API_BASE_URL` should point to your Vercel URL
- Update any hardcoded localhost URLs in the codebase
- Configure CORS settings in `next.config.ts` if needed

## Performance Optimization

1. Enable Edge Functions where possible
2. Configure caching headers
3. Optimize database queries
4. Monitor Vercel Analytics

## Security Checklist

- [ ] All secrets are in environment variables
- [ ] Database is not publicly accessible
- [ ] CORS is properly configured
- [ ] Security headers are enabled
- [ ] SSL certificates are valid (automatic on Vercel)
