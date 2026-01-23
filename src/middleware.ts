import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/**
 * Authorization Middleware for Role-Based Access Control (RBAC)
 *
 * This middleware intercepts incoming requests and enforces authentication
 * and authorization rules based on JWT tokens and user roles.
 *
 * Protected Routes:
 * - /api/admin/* - Requires ADMIN role
 * - /api/users/* - Requires any authenticated user (USER, SUPPLIER, or ADMIN)
 *
 * Flow:
 * 1. Extract JWT from Authorization header (Bearer token)
 * 2. Verify token signature and expiration
 * 3. Check user role against route requirements
 * 4. Pass user info to downstream handlers via custom headers
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define protected routes and their required roles
  const adminRoutes = ["/api/admin"];
  const authenticatedRoutes = [
    "/api/users",
    "/api/orders",
    "/api/products",
    "/api/suppliers",
  ];

  // Check if the current path requires authentication
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthenticatedRoute = authenticatedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Skip middleware for non-protected routes
  if (!isAdminRoute && !isAuthenticatedRoute) {
    return NextResponse.next();
  }

  // Extract JWT token from Authorization header
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  // Check for missing token
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Token missing",
        error: {
          code: "E401",
          details: "Authorization header with Bearer token is required",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    );
  }

  try {
    // Verify JWT token using jose (Edge-compatible)
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    const decoded = payload as {
      userId: string;
      email: string;
      role: string;
      name: string;
    };

    // Role-based access control for admin routes
    if (isAdminRoute && decoded.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
          error: {
            code: "E403",
            details: "Admin privileges required to access this resource",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Attach user info to request headers for downstream handlers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", decoded.userId);
    requestHeaders.set("x-user-email", decoded.email);
    requestHeaders.set("x-user-role", decoded.role);
    requestHeaders.set("x-user-name", decoded.name || "");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Handle token verification errors
    const errorMessage =
      error instanceof Error ? error.message : "Token verification failed";

    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired token",
        error: {
          code: "E401_TOKEN",
          details: errorMessage,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 403 }
    );
  }
}

/**
 * Middleware Configuration
 *
 * Define which routes the middleware should run on.
 * This uses path matching patterns to include/exclude routes.
 */
export const config = {
  matcher: [
    // Match all API routes that need protection
    "/api/admin/:path*",
    "/api/users/:path*",
    "/api/orders/:path*",
    "/api/products/:path*",
    "/api/suppliers/:path*",
  ],
};
