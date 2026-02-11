const bcrypt = require('bcrypt');

async function generatePasswordHash() {
  const password = 'pass123';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password hash for "pass123":');
    console.log(hash);
    
    // Generate the SQL with the correct hash
    const sql = `
-- Create test users for SupplySafe
-- Password: pass123 for all users (bcrypt hash: ${hash})

-- Insert regular user
INSERT INTO "users" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'john@restaurant.com',
  'John Restaurant',
  '${hash}',
  'USER',
  NOW(),
  NOW()
);

-- Insert supplier user
INSERT INTO "users" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'supplier@freshfarms.com',
  'Fresh Farms Supplier',
  '${hash}',
  'SUPPLIER',
  NOW(),
  NOW()
);

-- Insert admin user
INSERT INTO "users" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@foodguard.com',
  'FoodGuard Admin',
  '${hash}',
  'ADMIN',
  NOW(),
  NOW()
);
`;
    
    console.log('\nSQL to execute:');
    console.log(sql);
    
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generatePasswordHash();
