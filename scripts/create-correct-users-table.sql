-- Create correct users table with proper camelCase column names
-- Drop existing table and recreate with correct schema

-- Drop existing table
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with correct camelCase column names
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'SUPPLIER', 'ADMIN')),
    password TEXT NOT NULL, -- Hashed passwords
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Grant permissions for custom auth
GRANT ALL ON users TO anon;
GRANT ALL ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO service_role;

-- Create permissive policies for anon users
DROP POLICY IF EXISTS "Allow anon to read users" ON users;
CREATE POLICY "Allow anon to read users" ON users
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon to insert users" ON users;
CREATE POLICY "Allow anon to insert users" ON users
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon to update users" ON users;
CREATE POLICY "Allow anon to update users" ON users
    FOR UPDATE USING (true);

-- Function to automatically update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updatedAt
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert test users with correct column names and password hash
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

-- Verify table structure and data
SELECT 'Table structure:' as info;
\d users

SELECT 'Test users created:' as info;
SELECT email, name, role, 'Password: 123456' as login_info, createdAt FROM users WHERE email IN (
  'admin@supplysafe.com', 
  'user@supplysafe.com', 
  'supplier@supplysafe.com'
);
