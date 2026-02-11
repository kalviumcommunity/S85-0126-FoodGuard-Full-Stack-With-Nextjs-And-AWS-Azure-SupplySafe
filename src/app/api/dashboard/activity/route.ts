import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { getAccessToken } from "@/lib/auth-cookies";
import { NextRequest } from "next/server";

/**
 * Recent Activity API
 *
 * Returns recent activity based on user role:
 * - ADMIN: System-wide recent activity
 * - SUPPLIER: Supplier-specific activity
 * - USER: User-specific activity
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

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return sendError("User not found", ERROR_CODES.USER_NOT_FOUND, 404);
    }

    let activities = [];

    if (user.role === "ADMIN") {
      // Admin sees system-wide activity
      const [recentOrders, recentSuppliers, recentUsers] = await Promise.all([
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        }),
        prisma.supplier.findMany({
          take: 3,
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.findMany({
          take: 3,
          orderBy: { createdAt: "desc" },
          select: { name: true, email: true, role: true, createdAt: true },
        }),
      ]);

      // Transform to activity format with guaranteed unique IDs
      activities = [
        ...recentOrders.map((order) => ({
          id: `order-${order.id || Math.random().toString(36).substr(2, 9)}`,
          type: "order",
          title: `Order #${order.orderNumber} ${order.status.toLowerCase()}`,
          description: `by ${order.user.name} - ${formatTimeAgo(order.createdAt)}`,
          timestamp: order.createdAt,
          status: getOrderStatusColor(order.status),
        })),
        ...recentSuppliers.map((supplier) => ({
          id: `supplier-${supplier.id || Math.random().toString(36).substr(2, 9)}`,
          type: "supplier",
          title: "New supplier registered",
          description: `${supplier.name} - ${formatTimeAgo(supplier.createdAt)}`,
          timestamp: supplier.createdAt,
          status: supplier.verified ? "success" : "warning",
        })),
        ...recentUsers.map((user) => ({
          id: `user-${user.id || Math.random().toString(36).substr(2, 9)}`,
          type: "user",
          title: `New ${user.role.toLowerCase()} registered`,
          description: `${user.name} (${user.email}) - ${formatTimeAgo(user.createdAt)}`,
          timestamp: user.createdAt,
          status: "info",
        })),
      ]
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 10);
    } else if (user.role === "SUPPLIER") {
      // Supplier sees their activity
      const supplier = await prisma.supplier.findFirst({
        where: { userId: user.id },
      });

      if (supplier) {
        const recentOrders = await prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          where: {
            orderItems: {
              some: {
                product: {
                  supplierId: supplier.id,
                },
              },
            },
          },
          include: {
            user: {
              select: { name: true },
            },
          },
        });

        activities = recentOrders.map((order) => ({
          id: `supplier-order-${order.id || Math.random().toString(36).substr(2, 9)}`,
          type: "order",
          title: `Order #${order.orderNumber} ${order.status.toLowerCase()}`,
          description: `from ${order.user.name} - ${formatTimeAgo(order.createdAt)}`,
          timestamp: order.createdAt,
          status: getOrderStatusColor(order.status),
        }));
      }
    } else if (user.role === "USER") {
      // User sees their activity
      const recentOrders = await prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        where: { userId: user.id },
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  supplier: {
                    select: { name: true },
                  },
                },
              },
            },
          },
        },
      });

      activities = recentOrders.map((order) => ({
        id: `user-order-${order.id || Math.random().toString(36).substr(2, 9)}`,
        type: "order",
        title: `Your order #${order.orderNumber} ${order.status.toLowerCase()}`,
        description: `${order.orderItems.length} items - ${formatTimeAgo(order.createdAt)}`,
        timestamp: order.createdAt,
        status: getOrderStatusColor(order.status),
      }));
    }

    return sendSuccess(
      {
        activities,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
        lastUpdated: new Date().toISOString(),
      },
      "Recent activity retrieved successfully"
    );
  } catch (error) {
    console.error("Activity API error:", error);
    return sendError(
      "Failed to retrieve recent activity",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error
    );
  }
}

// Helper functions
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }
}

function getOrderStatusColor(status: string): string {
  switch (status) {
    case "PENDING":
      return "warning";
    case "CONFIRMED":
    case "PROCESSING":
      return "info";
    case "SHIPPED":
      return "primary";
    case "DELIVERED":
      return "success";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
}
