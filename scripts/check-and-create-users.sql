-- Check existing users and create test users if needed

-- First, check what users exist
SELECT 'Current users in database:' as info;
SELECT id, email, name, role, createdAt FROM users;

-- Check if test users exist
SELECT 'Test users check:' as info;
SELECT 
  COUNT(CASE WHEN email = 'admin@supplysafe.com' THEN 1 END) as admin_exists,
  COUNT(CASE WHEN email = 'user@supplysafe.com' THEN 1 END) as user_exists,
  COUNT(CASE WHEN email = 'supplier@supplysafe.com' THEN 1 END) as supplier_exists
FROM users;

-- If no users exist, create test users
-- Delete any existing test users first
DELETE FROM users WHERE email IN (
  'admin@supplysafe.com', 
  'user@supplysafe.com', 
  'supplier@supplysafe.com'
);

-- Create test users with proper password hash
INSERT INTO users (id, email, name, role, password, createdAt, updatedAt) VALUES
(
  gen_random_uuid(), 
  'admin@supplysafe.com', 
  'System Admin', 
  'ADMIN', 
  'MTIzNDU2c3VwcGx5c2FmZS1zYWx0', -- base64 of "123456" + "supplysafe-salt"
  NOW(),
  NOW()
),
(
  gen_random_uuid(), 
  'user@supplysafe.com', 
  'Test User', 
  'USER', 
  'MTIzNDU2c3VwcGx5c2FmZS1zYWx0', -- base64 of "123456" + "supplysafe-salt"
  NOW(),
  NOW()
),
(
  gen_random_uuid(), 
  'supplier@supplysafe.com', 
  'Test Supplier', 
  'SUPPLIER', 
  'MTIzNDU2c3VwcGx5c2FmZS1zYWx0', -- base64 of "123456" + "supplysafe-salt"
  NOW(),
  NOW()
);

-- Verify users were created
SELECT 'Test users created:' as info;
SELECT email, name, role, 'Password: 123456' as login_info FROM users WHERE email IN (
  'admin@supplysafe.com', 
  'user@supplysafe.com', 
  'supplier@supplysafe.com'
);
