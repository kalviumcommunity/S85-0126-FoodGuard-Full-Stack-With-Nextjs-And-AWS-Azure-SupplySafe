import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as bcrypt from "bcryptjs";
import { createUserSchema } from "@/lib/schemas/userSchema";
import { formatZodIssues, isZodError } from "@/lib/validation";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return sendSuccess(
      users,
      `Successfully fetched ${users.length} users`,
      200
    );
  } catch (error) {
    return sendError(
      "Failed to fetch users",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createUserSchema.parse(body);
    const { name, email, password, role } = parsed;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return sendError(
        "User with this email already exists",
        ERROR_CODES.DUPLICATE_EMAIL,
        409
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return sendSuccess(user, "User created successfully", 201);
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
      "Failed to create user",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
