import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { prisma } from "@/lib/prisma";

/**
 * Home Page Statistics API
 *
 * Returns public statistics for the homepage
 */
export async function GET() {
  try {
    const [
      totalUsers,
      totalSuppliers,
      verifiedSuppliers,
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.supplier.count(),
      prisma.supplier.count({ where: { verified: true } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
    ]);

    return sendSuccess(
      {
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
        dailyTransactions: 2847, // This would come from transaction monitoring
        lastUpdated: new Date().toISOString(),
      },
      "Home statistics retrieved successfully"
    );
  } catch (error) {
    console.error("Home stats error:", error);
    return sendError(
      "Failed to retrieve home statistics",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error
    );
  }
}
