import { NextRequest, NextResponse } from "next/server";
import {
  Role,
  Permission,
  Resource,
  checkPermission,
  logAccessCheck,
} from "./rbac";

// RBAC middleware configuration for API routes
export interface RBACConfig {
  requiredPermission?: Permission;
  requiredRole?: Role;
  resource?: Resource;
  userIdHeader?: string;
  userRoleHeader?: string;
}

// Default headers where user info is stored (set by main middleware)
const DEFAULT_HEADERS = {
  userId: "x-user-id",
  userRole: "x-user-role",
  userName: "x-user-name",
  userEmail: "x-user-email",
};

/**
 * RBAC Middleware for API Routes
 *
 * This middleware should be used in individual API routes to check permissions
 * after the main authentication middleware has verified the JWT and set user headers.
 *
 * Usage:
 * ```typescript
 * import { withRBAC } from '@/lib/rbac-middleware';
 *
 * export const GET = withRBAC(
 *   async (req, data) => {
 *     // Your API logic here
 *     return NextResponse.json({ success: true, data });
 *   },
 *   { requiredPermission: 'read', resource: 'users' }
 * );
 * ```
 */
export function withRBAC(
  handler: (
    req: NextRequest,
    data: {
      userId: string;
      userRole: Role;
      userName: string;
      userEmail: string;
    }
  ) => Promise<NextResponse> | NextResponse,
  config: RBACConfig = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const {
      requiredPermission,
      requiredRole,
      resource,
      userIdHeader = DEFAULT_HEADERS.userId,
      userRoleHeader = DEFAULT_HEADERS.userRole,
    } = config;

    // Extract user information from headers (set by main middleware)
    const userId = req.headers.get(userIdHeader);
    const userRoleStr = req.headers.get(userRoleHeader);
    const userName = req.headers.get(DEFAULT_HEADERS.userName) || "";
    const userEmail = req.headers.get(DEFAULT_HEADERS.userEmail) || "";

    // Check if user is authenticated
    if (!userId || !userRoleStr) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          error: {
            code: "E401",
            details: "User not authenticated",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // Validate role
    const userRole = userRoleStr as Role;
    if (!["admin", "editor", "viewer"].includes(userRole)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user role",
          error: {
            code: "E403",
            details: `Invalid role: ${userRole}`,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Check role-based access
    if (requiredRole) {
      const { allowed, reason } = checkRoleAccess(userRole, requiredRole);
      if (!allowed) {
        logAccessCheck(userId, userRole, "read", undefined, false, reason);
        return NextResponse.json(
          {
            success: false,
            message: "Access denied",
            error: {
              code: "E403",
              details: reason,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 403 }
        );
      }
    }

    // Check permission-based access
    if (requiredPermission) {
      const { allowed, reason } = checkPermission(
        userRole,
        requiredPermission,
        resource
      );
      if (!allowed) {
        logAccessCheck(
          userId,
          userRole,
          requiredPermission,
          resource,
          false,
          reason
        );
        return NextResponse.json(
          {
            success: false,
            message: "Access denied",
            error: {
              code: "E403",
              details: reason,
            },
            timestamp: new Date().toISOString(),
          },
          { status: 403 }
        );
      }

      // Log successful access
      logAccessCheck(userId, userRole, requiredPermission, resource, true);
    }

    // Call the original handler with user data
    return handler(req, {
      userId,
      userRole,
      userName,
      userEmail,
    });
  };
}

/**
 * Check if user has required role level
 */
function checkRoleAccess(
  userRole: Role,
  requiredRole: Role
): { allowed: boolean; reason?: string } {
  const roleHierarchy = {
    admin: 3,
    editor: 2,
    viewer: 1,
  } as const;

  const userLevel = roleHierarchy[userRole];
  const requiredLevel = roleHierarchy[requiredRole];

  if (userLevel >= requiredLevel) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Role '${userRole}' does not meet minimum requirement of '${requiredRole}'`,
  };
}

/**
 * Higher-order function for creating RBAC-protected API routes
 */
export function createProtectedRoute(
  handler: (
    req: NextRequest,
    data: {
      userId: string;
      userRole: Role;
      userName: string;
      userEmail: string;
    }
  ) => Promise<NextResponse> | NextResponse,
  config: RBACConfig
) {
  return withRBAC(handler, config);
}

/**
 * Utility function to check permissions manually in API routes
 */
export function requirePermission(
  req: NextRequest,
  permission: Permission,
  resource?: Resource
): { allowed: boolean; response?: NextResponse } {
  const userId = req.headers.get(DEFAULT_HEADERS.userId);
  const userRoleStr = req.headers.get(DEFAULT_HEADERS.userRole);

  if (!userId || !userRoleStr) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          error: {
            code: "E401",
            details: "User not authenticated",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      ),
    };
  }

  const userRole = userRoleStr as Role;
  const { allowed, reason } = checkPermission(userRole, permission, resource);

  if (!allowed) {
    logAccessCheck(userId, userRole, permission, resource, false, reason);
    return {
      allowed: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Access denied",
          error: {
            code: "E403",
            details: reason,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      ),
    };
  }

  logAccessCheck(userId, userRole, permission, resource, true);
  return { allowed: true };
}
