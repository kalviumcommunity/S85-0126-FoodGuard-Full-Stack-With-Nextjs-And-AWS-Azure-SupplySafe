import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/** Page routes protected by cookie-based JWT (redirect to /login if invalid) */
const PROTECTED_PAGES = ["/dashboard", "/users"];

/** API routes protected by Bearer token (or cookie fallback) */
const adminRoutes = ["/api/admin"];
const authenticatedApiRoutes = [
  "/api/users",
  "/api/orders",
  "/api/products",
  "/api/suppliers",
];

function isProtectedPage(pathname: string): boolean {
  return PROTECTED_PAGES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function getToken(req: NextRequest): string | undefined {
  const authHeader = req.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;
  const cookie = req.cookies.get("token")?.value;
  return bearer ?? cookie;
}

async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jose.jwtVerify(token, secret);
  return payload as {
    userId: string;
    email: string;
    role: string;
    name: string;
  };
}

/**
 * Authorization Middleware (RBAC + Page Routing)
 *
 * - Page routes (/dashboard, /users, /users/[id]): Cookie-based JWT.
 *   Missing/invalid token → redirect to /login.
 * - API routes: Bearer token or cookie. Missing/invalid → 401 JSON.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ——— Protected **pages** (cookie-based, redirect to /login) ———
  if (isProtectedPage(pathname)) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ——— API routes (Bearer or cookie, return 401 JSON) ———
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));
  const isAuthApi = authenticatedApiRoutes.some((r) => pathname.startsWith(r));
  if (!isAdminRoute && !isAuthApi) {
    return NextResponse.next();
  }

  const token = getToken(req);
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Token missing",
        error: {
          code: "E401",
          details:
            "Authorization header (Bearer) or cookie 'token' is required",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    );
  }

  try {
    const decoded = await verifyToken(token);

    if (isAdminRoute && decoded.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
          error: {
            code: "E403",
            details: "Admin privileges required",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", decoded.userId);
    requestHeaders.set("x-user-email", decoded.email);
    requestHeaders.set("x-user-role", decoded.role);
    requestHeaders.set("x-user-name", decoded.name ?? "");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired token",
        error: { code: "E401_TOKEN", details: "Token verification failed" },
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/users/:path*",
    "/api/orders/:path*",
    "/api/products/:path*",
    "/api/suppliers/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/users",
    "/users/:path*",
  ],
};
