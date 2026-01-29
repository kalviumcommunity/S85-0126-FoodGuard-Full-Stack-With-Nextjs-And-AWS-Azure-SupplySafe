import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as bcrypt from "bcryptjs";
import { generateTokenPair } from "@/lib/jwt";
import { setAuthCookies } from "@/lib/auth-cookies";
import { NextRequest } from "next/server";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Login Endpoint with Access & Refresh Tokens
 *
 * Authenticates user credentials and returns JWT tokens for authorization.
 * Uses secure HTTP-only cookies for token storage.
 *
 * Request Body:
 * - email: string (required)
 * - password: string (required)
 *
 * Response:
 * - accessToken: Short-lived JWT (15 minutes)
 * - refreshToken: Long-lived JWT (7 days)
 * - user: User object (without password)
 * - expiresIn: Token expiration time
 */
export async function POST(req: NextRequest) {
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

    // Generate access and refresh tokens
    const { accessToken, refreshToken, expiresIn } = await generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Create response and set secure HTTP-only cookies
    const response = sendSuccess(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        expiresIn,
      },
      "Login successful"
    );

    // Set secure cookies
    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    return sendError("Login failed", ERROR_CODES.INTERNAL_ERROR, 500, error);
  }
}
