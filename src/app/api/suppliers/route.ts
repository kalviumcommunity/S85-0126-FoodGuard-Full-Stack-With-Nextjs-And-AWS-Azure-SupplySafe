import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const verified = searchParams.get("verified");

    const where: Record<string, unknown> = {};
    if (verified === "true") where.verified = true;

    const suppliers = await prisma.supplier.findMany({
      where,
      include: {
        products: {
          select: {
            id: true,
            name: true,
            category: true,
            inStock: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return sendSuccess(
      suppliers,
      `Successfully fetched ${suppliers.length} suppliers`,
      200
    );
  } catch (error) {
    return sendError(
      "Failed to fetch suppliers",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

export async function POST(req: Request) {
  try {
    // Get authenticated user from middleware headers
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return sendError(
        "Authentication required",
        ERROR_CODES.UNAUTHORIZED,
        401
      );
    }

    const body = await req.json();
    const { name, email, phone, address, description } = body;

    if (!name || !email) {
      return sendError(
        "Missing required fields: name or email",
        ERROR_CODES.MISSING_FIELD,
        400
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError("Invalid email format", ERROR_CODES.INVALID_EMAIL, 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return sendError("User not found", ERROR_CODES.USER_NOT_FOUND, 404);
    }

    if (user.role !== "SUPPLIER" && user.role !== "ADMIN") {
      return sendError(
        "User must have SUPPLIER or ADMIN role",
        ERROR_CODES.FORBIDDEN,
        403
      );
    }

    const existingSupplier = await prisma.supplier.findUnique({
      where: { email },
    });

    if (existingSupplier) {
      return sendError(
        "Supplier with this email already exists",
        ERROR_CODES.DUPLICATE_EMAIL,
        409
      );
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        phone,
        address,
        description,
        userId,
        verified: false,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return sendSuccess(
      supplier,
      "Supplier created successfully. Pending verification.",
      201
    );
  } catch (error) {
    return sendError(
      "Failed to create supplier",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
