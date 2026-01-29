import {
  roles,
  hasPermission,
  hasResourcePermission,
  canPerformAction,
  hasRoleLevel,
  getRolesWithPermission,
  checkPermission,
  logAccessCheck,
  Role,
  Permission,
  Resource,
} from '../lib/rbac';

describe('RBAC System Tests', () => {
  describe('Role Configuration', () => {
    test('should have correct role permissions', () => {
      expect(roles.admin).toEqual(['create', 'read', 'update', 'delete']);
      expect(roles.editor).toEqual(['read', 'update']);
      expect(roles.viewer).toEqual(['read']);
    });

    test('admin should have all permissions', () => {
      const allPermissions: Permission[] = ['create', 'read', 'update', 'delete'];
      allPermissions.forEach(permission => {
        expect(hasPermission('admin', permission)).toBe(true);
      });
    });

    test('editor should have read and update permissions only', () => {
      expect(hasPermission('editor', 'read')).toBe(true);
      expect(hasPermission('editor', 'update')).toBe(true);
      expect(hasPermission('editor', 'create')).toBe(false);
      expect(hasPermission('editor', 'delete')).toBe(false);
    });

    test('viewer should have read permission only', () => {
      expect(hasPermission('viewer', 'read')).toBe(true);
      expect(hasPermission('viewer', 'create')).toBe(false);
      expect(hasPermission('viewer', 'update')).toBe(false);
      expect(hasPermission('viewer', 'delete')).toBe(false);
    });
  });

  describe('Resource-specific Permissions', () => {
    test('admin should have all permissions on all resources', () => {
      const resources: Resource[] = ['users', 'products', 'orders', 'suppliers', 'dashboard'];
      const allPermissions: Permission[] = ['create', 'read', 'update', 'delete'];

      resources.forEach(resource => {
        allPermissions.forEach(permission => {
          expect(hasResourcePermission('admin', resource, permission)).toBe(
            true,
            `Admin should have ${permission} permission on ${resource}`
          );
        });
      });
    });

    test('editor should have correct permissions on products', () => {
      expect(hasResourcePermission('editor', 'products', 'create')).toBe(true);
      expect(hasResourcePermission('editor', 'products', 'read')).toBe(true);
      expect(hasResourcePermission('editor', 'products', 'update')).toBe(true);
      expect(hasResourcePermission('editor', 'products', 'delete')).toBe(false);
    });

    test('editor should not have create permission on users', () => {
      expect(hasResourcePermission('editor', 'users', 'create')).toBe(false);
      expect(hasResourcePermission('editor', 'users', 'read')).toBe(true);
      expect(hasResourcePermission('editor', 'users', 'update')).toBe(true);
      expect(hasResourcePermission('editor', 'users', 'delete')).toBe(false);
    });
  });

  describe('Action Permission Checks', () => {
    test('canPerformAction should work correctly', () => {
      // Test without resource
      expect(canPerformAction('admin', 'create')).toBe(true);
      expect(canPerformAction('viewer', 'create')).toBe(false);

      // Test with resource
      expect(canPerformAction('editor', 'create', 'products')).toBe(true);
      expect(canPerformAction('editor', 'create', 'users')).toBe(false);
      expect(canPerformAction('viewer', 'read', 'dashboard')).toBe(true);
    });
  });

  describe('Role Hierarchy', () => {
    test('hasRoleLevel should work correctly', () => {
      expect(hasRoleLevel('admin', 'admin')).toBe(true);
      expect(hasRoleLevel('admin', 'editor')).toBe(true);
      expect(hasRoleLevel('admin', 'viewer')).toBe(true);

      expect(hasRoleLevel('editor', 'admin')).toBe(false);
      expect(hasRoleLevel('editor', 'editor')).toBe(true);
      expect(hasRoleLevel('editor', 'viewer')).toBe(true);

      expect(hasRoleLevel('viewer', 'admin')).toBe(false);
      expect(hasRoleLevel('viewer', 'editor')).toBe(false);
      expect(hasRoleLevel('viewer', 'viewer')).toBe(true);
    });
  });

  describe('Permission Utilities', () => {
    test('getRolesWithPermission should return correct roles', () => {
      expect(getRolesWithPermission('create')).toEqual(['admin']);
      expect(getRolesWithPermission('delete')).toEqual(['admin']);
      expect(getRolesWithPermission('read')).toEqual(['admin', 'editor', 'viewer']);
      expect(getRolesWithPermission('update')).toEqual(['admin', 'editor']);
    });

    test('checkPermission utility should work correctly', () => {
      const result1 = checkPermission('admin', 'read', 'users');
      expect(result1.allowed).toBe(true);
      expect(result1.reason).toBeUndefined();

      const result2 = checkPermission('viewer', 'delete', 'users');
      expect(result2.allowed).toBe(false);
      expect(result2.reason).toContain('does not have');
    });
  });

  describe('Audit Logging', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('logAccessCheck should log allowed access', () => {
      logAccessCheck('user123', 'admin', 'read', 'users', true);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[RBAC] admin tried read on users: ALLOWED')
      );
    });

    test('logAccessCheck should log denied access', () => {
      logAccessCheck('user456', 'viewer', 'delete', 'users', false, 'Insufficient permissions');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[RBAC] viewer tried delete on users: DENIED')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[RBAC] Details:')
      );
    });
  });

  describe('Edge Cases', () => {
    test('should handle invalid roles gracefully', () => {
      expect(() => hasPermission('invalid' as Role, 'read')).not.toThrow();
      expect(hasPermission('invalid' as Role, 'read')).toBe(false);
    });

    test('should handle invalid permissions gracefully', () => {
      expect(() => hasPermission('admin', 'invalid' as Permission)).not.toThrow();
      expect(hasPermission('admin', 'invalid' as Permission)).toBe(false);
    });

    test('should handle invalid resources gracefully', () => {
      expect(() => hasResourcePermission('admin', 'invalid' as Resource, 'read')).not.toThrow();
      expect(hasResourcePermission('admin', 'invalid' as Resource, 'read')).toBe(false);
    });
  });
});

describe('RBAC Integration Tests', () => {
  describe('Real-world Scenarios', () => {
    test('User Management Scenarios', () => {
      // Admin can do everything with users
      expect(canPerformAction('admin', 'create', 'users')).toBe(true);
      expect(canPerformAction('admin', 'read', 'users')).toBe(true);
      expect(canPerformAction('admin', 'update', 'users')).toBe(true);
      expect(canPerformAction('admin', 'delete', 'users')).toBe(true);

      // Editor can read and update users, but not create or delete
      expect(canPerformAction('editor', 'create', 'users')).toBe(false);
      expect(canPerformAction('editor', 'read', 'users')).toBe(true);
      expect(canPerformAction('editor', 'update', 'users')).toBe(true);
      expect(canPerformAction('editor', 'delete', 'users')).toBe(false);

      // Viewer can only read users
      expect(canPerformAction('viewer', 'create', 'users')).toBe(false);
      expect(canPerformAction('viewer', 'read', 'users')).toBe(true);
      expect(canPerformAction('viewer', 'update', 'users')).toBe(false);
      expect(canPerformAction('viewer', 'delete', 'users')).toBe(false);
    });

    test('Product Management Scenarios', () => {
      // Admin can do everything with products
      expect(canPerformAction('admin', 'create', 'products')).toBe(true);
      expect(canPerformAction('admin', 'read', 'products')).toBe(true);
      expect(canPerformAction('admin', 'update', 'products')).toBe(true);
      expect(canPerformAction('admin', 'delete', 'products')).toBe(true);

      // Editor can create, read, and update products, but not delete
      expect(canPerformAction('editor', 'create', 'products')).toBe(true);
      expect(canPerformAction('editor', 'read', 'products')).toBe(true);
      expect(canPerformAction('editor', 'update', 'products')).toBe(true);
      expect(canPerformAction('editor', 'delete', 'products')).toBe(false);

      // Viewer can only read products
      expect(canPerformAction('viewer', 'create', 'products')).toBe(false);
      expect(canPerformAction('viewer', 'read', 'products')).toBe(true);
      expect(canPerformAction('viewer', 'update', 'products')).toBe(false);
      expect(canPerformAction('viewer', 'delete', 'products')).toBe(false);
    });

    test('Dashboard Access Scenarios', () => {
      // All roles can read dashboard
      expect(canPerformAction('admin', 'read', 'dashboard')).toBe(true);
      expect(canPerformAction('editor', 'read', 'dashboard')).toBe(true);
      expect(canPerformAction('viewer', 'read', 'dashboard')).toBe(true);

      // No roles can perform other actions on dashboard
      expect(canPerformAction('admin', 'create', 'dashboard')).toBe(false);
      expect(canPerformAction('editor', 'update', 'dashboard')).toBe(false);
      expect(canPerformAction('viewer', 'delete', 'dashboard')).toBe(false);
    });
  });

  describe('Permission Inheritance', () => {
    test('higher roles should have all permissions of lower roles', () => {
      const resources: Resource[] = ['users', 'products', 'orders', 'suppliers'];
      
      resources.forEach(resource => {
        // Admin should have all permissions that editor has
        expect(hasResourcePermission('admin', resource, 'read')).toBe(true);
        expect(hasResourcePermission('admin', resource, 'update')).toBe(true);
        
        // Editor should have all permissions that viewer has
        expect(hasResourcePermission('editor', resource, 'read')).toBe(true);
      });
    });
  });
});

// Performance Tests
describe('RBAC Performance Tests', () => {
  test('permission checks should be fast', () => {
    const start = performance.now();
    
    // Perform 1000 permission checks
    for (let i = 0; i < 1000; i++) {
      canPerformAction('admin', 'read', 'users');
      canPerformAction('editor', 'update', 'products');
      canPerformAction('viewer', 'read', 'dashboard');
    }
    
    const end = performance.now();
    const duration = end - start;
    
    // Should complete 3000 checks in under 10ms
    expect(duration).toBeLessThan(10);
  });
});
