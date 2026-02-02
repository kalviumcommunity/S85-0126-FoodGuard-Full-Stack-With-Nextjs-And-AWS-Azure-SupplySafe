import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { handleError } from "@/lib/errorHandler";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import redis from "@/lib/redis";
import { withRBAC } from "@/lib/rbac-middleware";
import { NextRequest } from "next/server";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * GET /api/products - List all products
 *
 * Protected by RBAC middleware - requires 'read' permission on 'products' resource.
 */
export const GET = withRBAC(
  async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const category = searchParams.get("category");
      const inStock = searchParams.get("inStock");
      const supplierId = searchParams.get("supplierId");

      // Create cache key based on query parameters
      const cacheKey = `products:${category || "all"}:${inStock || "all"}:${supplierId || "all"}`;

      // Check cache first
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        console.log("Cache Hit - Products");
        const parsedData = JSON.parse(cachedData);
        return sendSuccess(
          parsedData,
          `Successfully fetched ${parsedData.length} products (from cache)`,
          200
        );
      }

      console.log("Cache Miss - Fetching products from DB");

      const where: Record<string, unknown> = {};
      if (category) where.category = category;
      if (inStock === "true") where.inStock = true;
      if (supplierId) where.supplierId = supplierId;

      const products = await prisma.product.findMany({
        where,
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              email: true,
              verified: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Cache data for 60 seconds (TTL)
      await redis.set(cacheKey, JSON.stringify(products), "EX", 60);

      return sendSuccess(
        products,
        `Successfully fetched ${products.length} products`,
        200
      );
    } catch (error) {
      return handleError(error, {
        route: "/api/products",
        method: "GET",
      });
    }
  },
  { requiredPermission: "read", resource: "products" }
);

/**
 * POST /api/products - Create a new product
 *
 * Protected by RBAC middleware - requires 'create' permission on 'products' resource.
 */
export const POST = withRBAC(
  async (req: NextRequest) => {
    try {
      const body = await req.json();
      const {
        name,
        description,
        category,
        price,
        unit,
        imageUrl,
        inStock = true,
        supplierId,
      } = body;

      if (!name || !price || !unit || !supplierId) {
        return sendError(
          "Missing required fields: name, price, unit, or supplierId",
          ERROR_CODES.MISSING_FIELD,
          400
        );
      }

      if (typeof price !== "number" || price <= 0) {
        return sendError(
          "Price must be a positive number",
          ERROR_CODES.INVALID_PRICE,
          400
        );
      }

      const supplier = await prisma.supplier.findUnique({
        where: { id: supplierId },
      });

      if (!supplier) {
        return sendError(
          "Supplier not found",
          ERROR_CODES.SUPPLIER_NOT_FOUND,
          404
        );
      }

      if (!supplier.verified) {
        return sendError(
          "Cannot add products from unverified supplier",
          ERROR_CODES.SUPPLIER_NOT_VERIFIED,
          403
        );
      }

      const product = await prisma.product.create({
        data: {
          name,
          description,
          category,
          price,
          unit,
          imageUrl,
          inStock,
          supplierId,
        },
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              verified: true,
            },
          },
        },
      });

      // Invalidate all product-related caches after creating a new product
      const keys = await redis.keys("products:*");
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`Invalidated ${keys.length} product cache keys`);
      }

      return sendSuccess(product, "Product created successfully", 201);
    } catch (error) {
      return handleError(error, {
        route: "/api/products",
        method: "POST",
      });
    }
  },
  { requiredPermission: "create", resource: "products" }
);
