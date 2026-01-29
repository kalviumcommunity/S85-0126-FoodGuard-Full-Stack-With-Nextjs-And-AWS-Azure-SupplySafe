import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { handleError } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { withRBAC } from "@/lib/rbac-middleware";
import { NextRequest } from "next/server";

/**
 * GET /api/users - List all users (authenticated route)
 *
 * Protected by RBAC middleware - requires 'read' permission on 'users' resource.
 */
export const GET = withRBAC(
  async (_req: NextRequest, { userRole }) => {
    try {
      // Admin can see all users (including emails & counts),
      // non-admins see a limited view.
      const isAdmin = userRole === "admin";

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
      });
    }
  },
  { requiredPermission: "read", resource: "users" }
);

/**
 * POST /api/users - Create a new user (admin only)
 *
 * Protected by RBAC middleware - requires 'create' permission on 'users' resource.
 */
export const POST = withRBAC(
  async (req: NextRequest) => {
    try {
      const body = await req.json();
      const { name, email, password, role = "viewer" } = body;

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
      });
    }
  },
  { requiredPermission: "create", resource: "users" }
);
