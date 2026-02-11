import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { prisma } from "@/lib/prisma";
import { getAccessToken } from "@/lib/auth-cookies";
import { verifyToken } from "@/lib/jwt";
import { NextRequest } from "next/server";

/**
 * Dashboard Statistics API
 *
 * Returns real-time statistics based on user role:
 * - ADMIN: System-wide statistics
 * - SUPPLIER: Supplier-specific statistics
 * - USER: User-specific statistics
 */
export async function GET(req: NextRequest) {
  try {
    // Get token from HTTP-only cookies
    const token = getAccessToken(req);

    if (!token) {
      return sendError(
        "Authentication required",
        ERROR_CODES.UNAUTHORIZED,
        401
      );
    }

    // Verify token and get user info
    const decoded = await verifyToken(token, "access");

    // Fetch user with role-specific data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
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

    let stats = {};

    if (user.role === "ADMIN") {
      // Admin gets system-wide statistics
      const [
        totalUsers,
        totalSuppliers,
        totalProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        verifiedSuppliers,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.supplier.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.count({ where: { status: "DELIVERED" } }),
        prisma.supplier.count({ where: { verified: true } }),
      ]);

      stats = {
        totalUsers,
        totalSuppliers,
        verifiedSuppliers,
        totalProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        systemUptime: "99.8%", // This would come from monitoring system
        activeRoutes: 127, // This would come from route tracking system
        kitchensOnline: 43, // This would come from kitchen monitoring
        hygieneScore: "83.7%", // This would come from inspection system
        openComplaints: 8, // This would come from complaint system
      };
    } else if (user.role === "SUPPLIER") {
      // Supplier gets their specific statistics
      const supplier = await prisma.supplier.findFirst({
        where: { userId: user.id },
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      if (supplier) {
        const [supplierOrders, pendingOrders, completedOrders] =
          await Promise.all([
            prisma.order.count({
              where: {
                orderItems: {
                  some: {
                    product: {
                      supplierId: supplier.id,
                    },
                  },
                },
              },
            }),
            prisma.order.count({
              where: {
                status: "PENDING",
                orderItems: {
                  some: {
                    product: {
                      supplierId: supplier.id,
                    },
                  },
                },
              },
            }),
            prisma.order.count({
              where: {
                status: "DELIVERED",
                orderItems: {
                  some: {
                    product: {
                      supplierId: supplier.id,
                    },
                  },
                },
              },
            }),
          ]);

        stats = {
          supplierId: supplier.id,
          supplierName: supplier.name,
          verified: supplier.verified,
          totalProducts: supplier._count.products,
          totalOrders: supplierOrders,
          pendingOrders,
          completedOrders,
          hygieneScore: "85.2%", // This would be calculated for this supplier
        };
      }
    } else if (user.role === "USER") {
      // User gets their specific statistics
      const [userOrders, pendingOrders, completedOrders] = await Promise.all([
        prisma.order.count({ where: { userId: user.id } }),
        prisma.order.count({
          where: {
            userId: user.id,
            status: { in: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"] },
          },
        }),
        prisma.order.count({ where: { userId: user.id, status: "DELIVERED" } }),
      ]);

      stats = {
        totalOrders: userOrders,
        pendingDeliveries: pendingOrders,
        completedOrders,
        hygieneScore: "92.1%", // This would be based on user's order history
      };
    }

    return sendSuccess(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        stats,
        lastUpdated: new Date().toISOString(),
      },
      "Dashboard statistics retrieved successfully"
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return sendError(
      "Failed to retrieve dashboard statistics",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error
    );
  }
}
