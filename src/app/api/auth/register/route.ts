import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as bcrypt from "bcryptjs";
import * as jose from "jose";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const JWT_EXPIRES_IN = "24h";

/**
 * Register Endpoint
 *
 * Creates a new user account and returns a JWT token for immediate access.
 *
 * Request Body:
 * - name: string (required)
 * - email: string (required)
 * - password: string (required, min 6 characters)
 * - role: "USER" | "SUPPLIER" | "ADMIN" (optional, defaults to "USER")
 *
 * Response:
 * - token: JWT token containing user id, email, role, and name
 * - user: User object (without password)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role = "USER" } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return sendError(
        "Missing required fields: name, email, or password",
        ERROR_CODES.MISSING_FIELD,
        400
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError("Invalid email format", ERROR_CODES.INVALID_EMAIL, 400);
    }

    // Validate password length
    if (password.length < 6) {
      return sendError(
        "Password must be at least 6 characters long",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // Validate role
    const validRoles = ["USER", "SUPPLIER", "ADMIN"];
    if (!validRoles.includes(role)) {
      return sendError(
        "Invalid role. Must be USER, SUPPLIER, or ADMIN",
        ERROR_CODES.INVALID_INPUT,
        400
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return sendError(
        "User with this email already exists",
        ERROR_CODES.DUPLICATE_EMAIL,
        409
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
      },
    });

    // Generate JWT token using jose (Edge-compatible)
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new jose.SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(secret);

    // Return success response with token
    return sendSuccess(
      {
        token,
        expiresIn: JWT_EXPIRES_IN,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      "Registration successful",
      201
    );
  } catch (error) {
    return sendError(
      "Registration failed",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error
    );
  }
}
