import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Admin Dashboard Route
 *
 * This route is protected by middleware and requires ADMIN role.
 * It provides administrative access to system-wide data and statistics.
 */

export async function GET(req: Request) {
  try {
    // Get user info from middleware-injected headers
    const userEmail = req.headers.get("x-user-email");
    const userRole = req.headers.get("x-user-role");
    const userName = req.headers.get("x-user-name");

    // Fetch system statistics for admin dashboard
    const [userCount, supplierCount, productCount, orderCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.supplier.count(),
        prisma.product.count(),
        prisma.order.count(),
      ]);

    const dashboardData = {
      message: "Welcome Admin! You have full access.",
      admin: {
        email: userEmail,
        role: userRole,
        name: userName,
      },
      statistics: {
        totalUsers: userCount,
        totalSuppliers: supplierCount,
        totalProducts: productCount,
        totalOrders: orderCount,
      },
      permissions: [
        "view_all_users",
        "manage_users",
        "view_all_suppliers",
        "manage_suppliers",
        "view_all_products",
        "manage_products",
        "view_all_orders",
        "manage_orders",
        "system_settings",
      ],
    };

    return sendSuccess(dashboardData, "Admin dashboard accessed successfully");
  } catch (error) {
    return sendError(
      "Failed to fetch admin dashboard",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

/**
 * Admin action - Fetch all users with detailed information
 * POST /api/admin with action: "list_users"
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case "list_users": {
        const users = await prisma.user.findMany({
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
          orderBy: { createdAt: "desc" },
        });
        return sendSuccess(users, "All users fetched successfully");
      }

      case "system_stats": {
        const stats = await Promise.all([
          prisma.user.groupBy({
            by: ["role"],
            _count: { id: true },
          }),
          prisma.order.groupBy({
            by: ["status"],
            _count: { id: true },
          }),
          prisma.supplier.count({ where: { verified: true } }),
          prisma.supplier.count({ where: { verified: false } }),
        ]);

        return sendSuccess(
          {
            usersByRole: stats[0],
            ordersByStatus: stats[1],
            verifiedSuppliers: stats[2],
            unverifiedSuppliers: stats[3],
          },
          "System statistics fetched successfully"
        );
      }

      default:
        return sendError(
          "Invalid admin action",
          ERROR_CODES.INVALID_INPUT,
          400
        );
    }
  } catch (error) {
    return sendError(
      "Failed to execute admin action",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
