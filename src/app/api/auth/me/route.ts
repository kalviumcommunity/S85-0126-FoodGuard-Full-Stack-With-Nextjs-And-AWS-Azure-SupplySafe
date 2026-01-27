import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as jose from "jose";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/**
 * Get Current User Endpoint
 *
 * Returns the currently authenticated user's profile information.
 * Requires a valid JWT token in the Authorization header.
 *
 * Headers:
 * - Authorization: Bearer <token>
 *
 * Response:
 * - user: User object with profile information
 */
export async function GET(req: Request) {
  try {
    // Extract JWT token from Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return sendError("Token missing", ERROR_CODES.UNAUTHORIZED, 401);
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    const decoded = payload as {
      userId: string;
      email: string;
      role: string;
      name: string;
    };

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            suppliers: true,
          },
        },
      },
    });

    if (!user) {
      return sendError("User not found", ERROR_CODES.USER_NOT_FOUND, 404);
    }

    return sendSuccess(
      {
        user,
        token: {
          issuedAt: payload.iat,
          expiresAt: payload.exp,
        },
      },
      "User profile fetched successfully"
    );
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      return sendError("Token expired", ERROR_CODES.TOKEN_EXPIRED, 401);
    }

    return sendError("Invalid token", ERROR_CODES.INVALID_TOKEN, 401);
  }
}
