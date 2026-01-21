import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { createProductSchema } from "@/lib/schemas/productSchema";
import { formatZodIssues, isZodError } from "@/lib/validation";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const inStock = searchParams.get("inStock");
    const supplierId = searchParams.get("supplierId");

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

    return sendSuccess(
      products,
      `Successfully fetched ${products.length} products`,
      200
    );
  } catch (error) {
    return sendError(
      "Failed to fetch products",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      category,
      price,
      unit,
      imageUrl,
      inStock,
      supplierId,
    } = createProductSchema.parse(body);

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

    return sendSuccess(product, "Product created successfully", 201);
  } catch (error) {
    if (isZodError(error)) {
      return sendError(
        "Validation Error",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        formatZodIssues(error.issues)
      );
    }
    return sendError(
      "Failed to create product",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
