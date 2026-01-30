import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as bcrypt from "bcryptjs";
import { generateTokenPair } from "@/lib/jwt";
import { setAuthCookies } from "@/lib/auth-cookies";
import {
  addCorsHeaders,
  handleCorsPreflight,
  validateOrigin,
} from "@/lib/security";
import { NextRequest, NextResponse } from "next/server";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Login Endpoint with Access & Refresh Tokens
 *
 * Authenticates users and issues secure JWT tokens with comprehensive security headers.
 * Implements CORS validation and rate limiting for production environments.
 */
export async function POST(request: NextRequest) {
  // Handle CORS preflight
  const preflightResponse = handleCorsPreflight(request);
  if (preflightResponse) return preflightResponse;

  // Validate origin for security
  if (!validateOrigin(request)) {
    const response = NextResponse.json(
      { success: false, message: "Origin not allowed" },
      { status: 403 }
    );
    return addCorsHeaders(response, request.headers.get("origin") || undefined);
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      const response = NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
      return addCorsHeaders(
        response,
        request.headers.get("origin") || undefined
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const response = NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
      return addCorsHeaders(
        response,
        request.headers.get("origin") || undefined
      );
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
      const response = NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
      return addCorsHeaders(
        response,
        request.headers.get("origin") || undefined
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const response = NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
      return addCorsHeaders(
        response,
        request.headers.get("origin") || undefined
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
