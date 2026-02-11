# SupplySafe Supabase Migration Guide

## Overview
This guide helps you migrate your SupplySafe application from local PostgreSQL to Supabase.

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project in Supabase
3. Note your project URL and API keys

## Migration Steps

### 1. Update Environment Variables
Update your `.env` file with your Supabase credentials:

```env
# Database Configuration - Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-SUPABASE-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SUPABASE-SERVICE-ROLE-KEY]"
```

### 2. Run Database Migration
Execute the migration script in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/supabase-migration.sql`
4. Run the script

### 3. Update Prisma Configuration
The Prisma schema has been updated to work with Supabase extensions and RLS policies.

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. Push Schema to Supabase
```bash
npx prisma db push
```

### 6. Seed Database (Optional)
If you have seed data, run:
```bash
npx prisma db seed
```

## Authentication Changes
The application now uses Supabase Auth instead of custom JWT authentication:

- Login/logout handled by Supabase
- User profiles still stored in your database
- Row Level Security (RLS) policies implemented
- Automatic session management

## RLS Policies
The migration includes Row Level Security policies for:
- Users can only access their own profiles
- Suppliers can manage their own products
- Orders are restricted to their owners
- Public read access for products and suppliers

## Testing
1. Test user registration and login
2. Verify supplier functionality
3. Test order creation and management
4. Check file uploads

## Deployment
When deploying to production:
1. Use production Supabase URL and keys
2. Ensure all environment variables are set
3. Run migrations in production Supabase project
4. Test all functionality

## Troubleshooting
- Check Supabase logs for any errors
- Verify RLS policies are working correctly
- Ensure environment variables are properly set
- Test database connections with Prisma
