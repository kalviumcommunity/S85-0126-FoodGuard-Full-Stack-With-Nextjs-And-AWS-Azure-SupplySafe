// Role-Based Access Control (RBAC) Configuration

export const roles = {
  admin: ['create', 'read', 'update', 'delete'] as const,
  editor: ['read', 'update'] as const,
  viewer: ['read'] as const,
} as const;

export type Role = keyof typeof roles;
export type Permission = typeof roles.admin[number];

// Resource-specific permissions
export const resourcePermissions = {
  users: {
    admin: ['create', 'read', 'update', 'delete'] as const,
    editor: ['read', 'update'] as const,
    viewer: ['read'] as const,
  },
  products: {
    admin: ['create', 'read', 'update', 'delete'] as const,
    editor: ['create', 'read', 'update'] as const,
    viewer: ['read'] as const,
  },
  orders: {
    admin: ['create', 'read', 'update', 'delete'] as const,
    editor: ['create', 'read', 'update'] as const,
    viewer: ['read'] as const,
  },
  suppliers: {
    admin: ['create', 'read', 'update', 'delete'] as const,
    editor: ['read', 'update'] as const,
    viewer: ['read'] as const,
  },
  dashboard: {
    admin: ['read'] as const,
    editor: ['read'] as const,
    viewer: ['read'] as const,
  },
} as const;

export type Resource = keyof typeof resourcePermissions;

// Check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  return roles[role]?.includes(permission as any) || false;
}

// Check if a role has permission for a specific resource
export function hasResourcePermission(
  role: Role,
  resource: Resource,
  permission: Permission
): boolean {
  return resourcePermissions[resource]?.[role]?.includes(permission as any) || false;
}

// Get all permissions for a role
export function getRolePermissions(role: Role): Permission[] {
  return [...roles[role]];
}

// Get all permissions for a role on a specific resource
export function getResourcePermissions(role: Role, resource: Resource): Permission[] {
  return [...(resourcePermissions[resource][role] || [])];
}

// Check if user can perform action on resource
export function canPerformAction(
  userRole: Role,
  action: Permission,
  resource?: Resource
): boolean {
  if (resource) {
    return hasResourcePermission(userRole, resource, action);
  }
  return hasPermission(userRole, action);
}

// Role hierarchy for inheritance (admin > editor > viewer)
export const roleHierarchy: Record<Role, number> = {
  admin: 3,
  editor: 2,
  viewer: 1,
} as const;

// Check if a role has higher or equal privilege than another role
export function hasRoleLevel(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// Get all roles that have a specific permission
export function getRolesWithPermission(permission: Permission): Role[] {
  return (Object.keys(roles) as Role[]).filter(role => 
    roles[role].includes(permission as any)
  );
}

// Audit logging function
export function logAccessCheck(
  userId: string,
  userRole: Role,
  action: Permission,
  resource: Resource | undefined,
  allowed: boolean,
  reason?: string
): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    userId,
    userRole,
    action,
    resource,
    allowed,
    reason,
  };
  
  console.log(`[RBAC] ${userRole} tried ${action}${resource ? ` on ${resource}` : ''}: ${allowed ? 'ALLOWED' : 'DENIED'}`);
  console.log(`[RBAC] Details:`, JSON.stringify(logEntry, null, 2));
}

// Middleware helper function for API routes
export function checkPermission(
  userRole: Role,
  requiredPermission: Permission,
  resource?: Resource
): { allowed: boolean; reason?: string } {
  const allowed = canPerformAction(userRole, requiredPermission, resource);
  
  if (!allowed) {
    const reason = resource 
      ? `Role '${userRole}' does not have '${requiredPermission}' permission on resource '${resource}'`
      : `Role '${userRole}' does not have '${requiredPermission}' permission`;
    
    return { allowed: false, reason };
  }
  
  return { allowed: true };
}
