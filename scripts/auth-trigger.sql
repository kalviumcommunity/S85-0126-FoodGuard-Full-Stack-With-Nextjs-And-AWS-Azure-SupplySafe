-- Supabase Auth Trigger for SupplySafe
-- This trigger automatically creates a user in public.users when a user signs up or is created manually

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user into public.users table with default values if not exists
  INSERT INTO public.users (id, email, name, role, created_at, updated_at)
  SELECT 
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User') as name,
    COALESCE(NEW.raw_user_meta_data->>'role', 'USER')::"Role" as role,
    NOW(),
    NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM public.users WHERE id = NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to fire when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user when metadata changes
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user in public.users table
  UPDATE public.users 
  SET 
    name = COALESCE(NEW.raw_user_meta_data->>'name', OLD.raw_user_meta_data->>'name', name),
    role = COALESCE(NEW.raw_user_meta_data->>'role', OLD.raw_user_meta_data->>'role', 'USER')::"Role",
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing update trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Create trigger to fire when user is updated
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Function to manually sync existing auth users to public.users
CREATE OR REPLACE FUNCTION public.sync_existing_users()
RETURNS VOID AS $$
BEGIN
  -- Sync all existing auth users to public.users
  INSERT INTO public.users (id, email, name, role, created_at, updated_at)
  SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', 'User') as name,
    COALESCE(au.raw_user_meta_data->>'role', 'USER')::"Role" as role,
    au.created_at,
    NOW() as updated_at
  FROM auth.users au
  WHERE NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user metadata (for manual user creation)
CREATE OR REPLACE FUNCTION public.update_user_metadata(
  p_user_id UUID,
  p_name TEXT DEFAULT 'User',
  p_role TEXT DEFAULT 'USER'
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Update user metadata in auth.users
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{name, role}',
    to_jsonb(p_name || '":' || p_role)
  )
  WHERE id = p_user_id;
  
  -- Also update public.users
  UPDATE public.users
  SET 
    name = p_name,
    role = p_role::"Role",
    updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a helper function to get user with role
CREATE OR REPLACE FUNCTION public.get_user_with_role(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT,
  role "Role",
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pu.id,
    pu.email,
    pu.name,
    pu.role,
    pu.created_at,
    pu.updated_at
  FROM public.users pu
  WHERE pu.id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove password column from public.users (not needed with Supabase Auth)
-- ALTER TABLE public.users DROP COLUMN IF EXISTS password;

-- Create updated users table without password column
-- This is optional - only run if you want to remove the password column
/*
CREATE TABLE users_new (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role "Role" NOT NULL DEFAULT 'USER',
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT users_new_pkey PRIMARY KEY (id)
);

-- Copy data from old table
INSERT INTO users_new (id, email, name, role, createdAt, updatedAt)
SELECT id, email, name, role, createdAt, updatedAt FROM users;

-- Drop old table and rename new one
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

-- Recreate indexes
CREATE UNIQUE INDEX users_email_key ON users(email);
*/
