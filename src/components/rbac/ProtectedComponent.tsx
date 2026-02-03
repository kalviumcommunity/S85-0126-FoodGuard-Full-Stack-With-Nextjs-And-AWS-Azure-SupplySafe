"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Role, Permission, Resource, canPerformAction } from "@/lib/rbac";

interface ProtectedComponentProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredRole?: Role;
  resource?: Resource;
  fallback?: React.ReactNode;
}

/**
 * ProtectedComponent - Conditionally renders children based on user permissions
 *
 * Usage:
 * ```tsx
 * <ProtectedComponent requiredPermission="delete" resource="users">
 *   <button>Delete User</button>
 * </ProtectedComponent>
 *
 * <ProtectedComponent requiredRole="admin">
 *   <AdminPanel />
 * </ProtectedComponent>
 * ```
 */
export function ProtectedComponent({
  children,
  requiredPermission,
  requiredRole,
  resource,
  fallback = null,
}: ProtectedComponentProps) {
  const { user } = useAuth();

  // If user is not authenticated, don't render
  if (!user) {
    return fallback ? <>{fallback}</> : null;
  }

  const userRole = user.role as Role;

  // Check role-based access
  if (requiredRole) {
    const roleHierarchy = {
      admin: 3,
      editor: 2,
      viewer: 1,
    } as const;

    const userLevel = roleHierarchy[userRole];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return fallback ? <>{fallback}</> : null;
    }
  }

  // Check permission-based access
  if (requiredPermission) {
    const hasAccess = canPerformAction(userRole, requiredPermission, resource);

    if (!hasAccess) {
      return fallback ? <>{fallback}</> : null;
    }
  }

  // User has required permissions, render children
  return <>{children}</>;
}

/**
 * Hook for checking permissions programmatically
 */
export function usePermissions() {
  const { user } = useAuth();
  const userRole = user?.role as Role;

  const can = (permission: Permission, resource?: Resource): boolean => {
    if (!user) return false;
    return canPerformAction(userRole, permission, resource);
  };

  const hasRole = (role: Role): boolean => {
    if (!user) return false;

    const roleHierarchy = {
      admin: 3,
      editor: 2,
      viewer: 1,
    } as const;

    const userLevel = roleHierarchy[userRole];
    const requiredLevel = roleHierarchy[role];

    return userLevel >= requiredLevel;
  };

  const isAdmin = (): boolean => hasRole("admin");
  const isEditor = (): boolean => hasRole("editor");
  const isViewer = (): boolean => hasRole("viewer");

  return {
    can,
    hasRole,
    isAdmin,
    isEditor,
    isViewer,
    userRole,
  };
}

/**
 * Higher-order component for protecting routes/components
 */
export function withProtection<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requiredPermission?: Permission;
    requiredRole?: Role;
    resource?: Resource;
    fallback?: React.ReactNode;
  } = {}
) {
  return function ProtectedComponentWrapper(props: P) {
    return (
      <ProtectedComponent {...options}>
        <Component {...props} />
      </ProtectedComponent>
    );
  };
}

/**
 * Permission-based button component
 */
interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  requiredPermission?: Permission;
  requiredRole?: Role;
  resource?: Resource;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionButton({
  requiredPermission,
  requiredRole,
  resource,
  children,
  fallback,
  ...props
}: PermissionButtonProps) {
  return (
    <ProtectedComponent
      requiredPermission={requiredPermission}
      requiredRole={requiredRole}
      resource={resource}
      fallback={fallback}
    >
      <button {...props}>{children}</button>
    </ProtectedComponent>
  );
}

/**
 * Permission-based link component
 */
interface PermissionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  requiredPermission?: Permission;
  requiredRole?: Role;
  resource?: Resource;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionLink({
  requiredPermission,
  requiredRole,
  resource,
  children,
  fallback,
  ...props
}: PermissionLinkProps) {
  return (
    <ProtectedComponent
      requiredPermission={requiredPermission}
      requiredRole={requiredRole}
      resource={resource}
      fallback={fallback}
    >
      <a {...props}>{children}</a>
    </ProtectedComponent>
  );
}
