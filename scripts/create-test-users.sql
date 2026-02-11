-- Create test users for SupplySafe
-- Password: pass123 for all users (bcrypt hash: $2b$10$uPu5VmSzf0zbAgSuXxAx2u3afy0WhzcV2xV4W/FkUUMnIsgMmN2hK)

-- Insert regular user
INSERT INTO "users" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'john@restaurant.com',
  'John Restaurant',
  '$2b$10$uPu5VmSzf0zbAgSuXxAx2u3afy0WhzcV2xV4W/FkUUMnIsgMmN2hK',
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
  '$2b$10$uPu5VmSzf0zbAgSuXxAx2u3afy0WhzcV2xV4W/FkUUMnIsgMmN2hK',
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
  '$2b$10$uPu5VmSzf0zbAgSuXxAx2u3afy0WhzcV2xV4W/FkUUMnIsgMmN2hK',
  'ADMIN',
  NOW(),
  NOW()
);

-- Create a sample supplier profile for the supplier user
INSERT INTO "suppliers" ("id", "name", "email", "phone", "address", "description", "verified", "userId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Fresh Farms',
  'supplier@freshfarms.com',
  '+1-555-0123',
  '123 Farm Road, Agricultural Valley, CA 90210',
  'We provide fresh organic produce directly from our farms to restaurants and businesses.',
  true,
  (SELECT id FROM "users" WHERE email = 'supplier@freshfarms.com'),
  NOW(),
  NOW()
);

-- Create sample products for Fresh Farms
INSERT INTO "products" ("id", "name", "description", "category", "price", "unit", "imageUrl", "inStock", "supplierId", "createdAt", "updatedAt")
VALUES 
  (
    gen_random_uuid(),
    'Organic Tomatoes',
    'Fresh organic tomatoes grown without pesticides',
    'Vegetables',
    4.99,
    'kg',
    null,
    true,
    (SELECT id FROM "suppliers" WHERE email = 'supplier@freshfarms.com'),
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Fresh Lettuce',
    'Crisp green lettuce perfect for salads',
    'Vegetables',
    2.99,
    'head',
    null,
    true,
    (SELECT id FROM "suppliers" WHERE email = 'supplier@freshfarms.com'),
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'Organic Carrots',
    'Sweet and crunchy organic carrots',
    'Vegetables',
    3.49,
    'kg',
    null,
    true,
    (SELECT id FROM "suppliers" WHERE email = 'supplier@freshfarms.com'),
    NOW(),
    NOW()
  );
