import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { handleError } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/users - List all users (authenticated route)
 *
 * Protected by middleware - requires valid JWT token.
 * User info is available via x-user-* headers from middleware.
 */
export async function GET(req: Request) {
  try {
    // User is already authenticated via middleware
    // Get user info from middleware-injected headers
    const userId = req.headers.get("x-user-id");
    const userRole = req.headers.get("x-user-role");

    if (!userId) {
      return sendError(
        "Authentication required",
        ERROR_CODES.UNAUTHORIZED,
        401
      );
    }

    // Admin can see all users, others see limited info
    const isAdmin = userRole === "ADMIN";

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: isAdmin, // Only admins can see emails
        role: true,
        createdAt: true,
        _count: isAdmin
          ? {
              select: {
                orders: true,
                suppliers: true,
              },
            }
          : false,
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(users, `Successfully fetched ${users.length} users`);
  } catch (error) {
    return handleError(error, {
      route: "/api/users",
      method: "GET",
      userId: req.headers.get("x-user-id") || undefined,
    });
  }
}

/**
 * POST /api/users - Create a new user (authenticated route)
 *
 * This is different from /api/auth/register - this is for admins to create users.
 */
export async function POST(req: Request) {
  try {
    const userRole = req.headers.get("x-user-role");

    // Only admins can create users via this endpoint
    if (userRole !== "ADMIN") {
      return sendError("Admin privileges required", ERROR_CODES.FORBIDDEN, 403);
    }

    const body = await req.json();
    const { name, email, password, role = "USER" } = body;

    if (!name || !email || !password) {
      return sendError(
        "Missing required fields: name, email, or password",
        ERROR_CODES.MISSING_FIELD,
        400
      );
    }

    // Check for duplicate email
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

    // Import bcrypt for password hashing
    const bcrypt = await import("bcryptjs");
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
    return handleError(error, {
      route: "/api/users",
      method: "POST",
      userId: req.headers.get("x-user-id") || undefined,
    });
  }
}
