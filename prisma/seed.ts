/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as bcrypt from "bcryptjs";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

// Create PostgreSQL connection pool
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Create Prisma Client with pg adapter
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (for idempotency)
  console.log("📦 Clearing existing data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Seed Users
  console.log("👥 Creating users...");
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@foodguard.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const supplierUser = await prisma.user.create({
    data: {
      name: "Fresh Farms Owner",
      email: "supplier@freshfarms.com",
      password: hashedPassword,
      role: "SUPPLIER",
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: "John Restaurant Manager",
      email: "john@restaurant.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log("✅ Created 3 users");

  // Seed Suppliers
  console.log("🏪 Creating suppliers...");
  const supplier1 = await prisma.supplier.create({
    data: {
      name: "Fresh Farms Ltd",
      email: "contact@freshfarms.com",
      phone: "+1-555-0100",
      address: "123 Farm Road, Agriculture City, CA 90210",
      description: "Organic vegetables and fruits from local farms",
      verified: true,
      userId: supplierUser.id,
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: "Ocean Harvest Co",
      email: "info@oceanharvest.com",
      phone: "+1-555-0200",
      address: "456 Port Avenue, Coastal Town, FL 33139",
      description: "Fresh seafood and sustainable fishing practices",
      verified: true,
      userId: supplierUser.id,
    },
  });

  console.log("✅ Created 2 suppliers");

  // Seed Products
  console.log("📦 Creating products...");
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Organic Tomatoes",
        description: "Fresh organic vine-ripened tomatoes",
        category: "Vegetables",
        price: 3.99,
        unit: "lb",
        imageUrl: "/images/tomatoes.jpg",
        inStock: true,
        supplierId: supplier1.id,
      },
      {
        name: "Premium Salmon",
        description: "Wild-caught Atlantic salmon fillets",
        category: "Seafood",
        price: 15.99,
        unit: "lb",
        imageUrl: "/images/salmon.jpg",
        inStock: true,
        supplierId: supplier2.id,
      },
      {
        name: "Free Range Eggs",
        description: "Farm fresh organic free-range eggs",
        category: "Dairy",
        price: 5.99,
        unit: "dozen",
        imageUrl: "/images/eggs.jpg",
        inStock: true,
        supplierId: supplier1.id,
      },
      {
        name: "Fresh Spinach",
        description: "Organic baby spinach leaves",
        category: "Vegetables",
        price: 2.99,
        unit: "lb",
        imageUrl: "/images/spinach.jpg",
        inStock: true,
        supplierId: supplier1.id,
      },
      {
        name: "Jumbo Shrimp",
        description: "Fresh jumbo shrimp, sustainably sourced",
        category: "Seafood",
        price: 12.99,
        unit: "lb",
        imageUrl: "/images/shrimp.jpg",
        inStock: true,
        supplierId: supplier2.id,
      },
      {
        name: "Organic Carrots",
        description: "Farm fresh organic carrots",
        category: "Vegetables",
        price: 2.49,
        unit: "lb",
        imageUrl: "/images/carrots.jpg",
        inStock: true,
        supplierId: supplier1.id,
      },
      {
        name: "Fresh Tuna Steaks",
        description: "Premium yellowfin tuna steaks",
        category: "Seafood",
        price: 18.99,
        unit: "lb",
        imageUrl: "/images/tuna.jpg",
        inStock: true,
        supplierId: supplier2.id,
      },
    ],
  });

  console.log(`✅ Created ${products.count} products`);

  // Seed Sample Orders
  console.log("🛒 Creating sample orders...");
  const tomatoes = await prisma.product.findFirst({
    where: { name: "Organic Tomatoes" },
  });
  const salmon = await prisma.product.findFirst({
    where: { name: "Premium Salmon" },
  });
  const eggs = await prisma.product.findFirst({
    where: { name: "Free Range Eggs" },
  });

  // Order 1 - Confirmed
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-001",
      status: "CONFIRMED",
      totalAmount: 67.95,
      deliveryDate: new Date("2026-01-25"),
      notes: "Please deliver before 10 AM",
      userId: regularUser.id,
    },
  });

  if (tomatoes && salmon) {
    await prisma.orderItem.createMany({
      data: [
        {
          quantity: 5,
          price: tomatoes.price,
          orderId: order1.id,
          productId: tomatoes.id,
        },
        {
          quantity: 3,
          price: salmon.price,
          orderId: order1.id,
          productId: salmon.id,
        },
      ],
    });
  }

  // Order 2 - Pending
  const order2 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-002",
      status: "PENDING",
      totalAmount: 17.98,
      deliveryDate: new Date("2026-01-22"),
      notes: "Call before delivery",
      userId: regularUser.id,
    },
  });

  if (eggs) {
    await prisma.orderItem.create({
      data: {
        quantity: 3,
        price: eggs.price,
        orderId: order2.id,
        productId: eggs.id,
      },
    });
  }

  console.log("✅ Created 2 sample orders with items");

  // Summary
  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log("   - Users: 3 (1 Admin, 1 Supplier, 1 Regular User)");
  console.log("   - Suppliers: 2");
  console.log("   - Products: 7");
  console.log("   - Orders: 2");

  console.log("\n📝 Sample Credentials:");
  console.log("   Admin:    admin@foodguard.com / password123");
  console.log("   Supplier: supplier@freshfarms.com / password123");
  console.log("   User:     john@restaurant.com / password123");

  console.log("\n🔍 Next Steps:");
  console.log("   1. Run: npx prisma studio (to view data)");
  console.log("   2. Visit: http://localhost:5555");
  console.log("   3. Or check Supabase dashboard Table Editor\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
