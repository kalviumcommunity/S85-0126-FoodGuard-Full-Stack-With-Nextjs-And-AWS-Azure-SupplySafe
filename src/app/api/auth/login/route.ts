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
 * Login Endpoint
 *
 * Authenticates user credentials and returns a JWT token for authorization.
 *
 * Request Body:
 * - email: string (required)
 * - password: string (required)
 *
 * Response:
 * - token: JWT token containing user id, email, role, and name
 * - user: User object (without password)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return sendError(
        "Missing required fields: email and password",
        ERROR_CODES.MISSING_FIELD,
        400
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError("Invalid email format", ERROR_CODES.INVALID_EMAIL, 400);
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendError(
        "Invalid credentials",
        ERROR_CODES.INVALID_CREDENTIALS,
        401
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendError(
        "Invalid credentials",
        ERROR_CODES.INVALID_CREDENTIALS,
        401
      );
    }

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
      "Login successful"
    );
  } catch (error) {
    return sendError("Login failed", ERROR_CODES.INTERNAL_ERROR, 500, error);
  }
}
