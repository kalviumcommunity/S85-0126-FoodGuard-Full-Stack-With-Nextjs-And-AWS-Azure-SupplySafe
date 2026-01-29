import { Role, Permission, Resource } from './rbac';

export interface AuditLogEntry {
  userId: string;
  userRole: Role;
  action: Permission;
  resource?: Resource;
  resourceId?: string;
  allowed: boolean;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
}

/**
 * Audit Logger for RBAC Access Control
 * 
 * Logs all permission checks and access attempts to console and optionally to database.
 * Provides comprehensive audit trail for security compliance.
 */
export class AuditLogger {
  /**
   * Log access check result
   */
  static async logAccess(entry: AuditLogEntry): Promise<void> {
    try {
      // Log to console for immediate visibility
      const timestamp = new Date().toISOString();
      const status = entry.allowed ? 'ALLOWED' : 'DENIED';
      const resourceInfo = entry.resource ? ` on ${entry.resource}` : '';
      const resourceIdInfo = entry.resourceId ? ` (${entry.resourceId})` : '';
      
      console.log(`[RBAC AUDIT] ${timestamp} - ${entry.userRole} tried ${entry.action}${resourceInfo}${resourceIdInfo}: ${status}`);
      
      if (entry.reason) {
        console.log(`[RBAC AUDIT] Reason: ${entry.reason}`);
      }

      // Note: Database logging would require an AuditLog model in Prisma schema
      // For now, we'll just log to console
      // TODO: Add AuditLog model to Prisma schema and uncomment the database logging
      
      /*
      await prisma.auditLog.create({
        data: {
          userId: entry.userId,
          userRole: entry.userRole,
          action: entry.action,
          resource: entry.resource,
          resourceId: entry.resourceId,
          allowed: entry.allowed,
          reason: entry.reason,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          endpoint: entry.endpoint,
          method: entry.method,
          statusCode: entry.statusCode,
          timestamp: new Date(),
        },
      });
      */

    } catch (error) {
      // Log error but don't throw to avoid breaking the main flow
      console.error('[RBAC AUDIT] Failed to log access:', error);
    }
  }

  /**
   * Log successful access
   */
  static async logSuccess(
    userId: string,
    userRole: Role,
    action: Permission,
    resource?: Resource,
    resourceId?: string,
    metadata?: Partial<AuditLogEntry>
  ): Promise<void> {
    await this.logAccess({
      userId,
      userRole,
      action,
      resource,
      resourceId,
      allowed: true,
      ...metadata,
    });
  }

  /**
   * Log denied access
   */
  static async logDenial(
    userId: string,
    userRole: Role,
    action: Permission,
    resource?: Resource,
    resourceId?: string,
    reason?: string,
    metadata?: Partial<AuditLogEntry>
  ): Promise<void> {
    await this.logAccess({
      userId,
      userRole,
      action,
      resource,
      resourceId,
      allowed: false,
      reason,
      ...metadata,
    });
  }

  /**
   * Get audit logs for a specific user (placeholder - would require database)
   */
  static async getUserAuditLogs(
    userId: string,
    limit: number = 100,
    offset: number = 0
  ) {
    console.log(`[RBAC AUDIT] Getting audit logs for user ${userId} (limit: ${limit}, offset: ${offset})`);
    // TODO: Implement when AuditLog model is added to Prisma schema
    return [];
  }

  /**
   * Get audit logs for a specific resource (placeholder - would require database)
   */
  static async getResourceAuditLogs(
    resource: Resource,
    resourceId?: string,
    limit: number = 100,
    offset: number = 0
  ) {
    console.log(`[RBAC AUDIT] Getting audit logs for resource ${resource} ${resourceId ? `(${resourceId})` : ''} (limit: ${limit}, offset: ${offset})`);
    // TODO: Implement when AuditLog model is added to Prisma schema
    return [];
  }

  /**
   * Get denied access attempts (placeholder - would require database)
   */
  static async getDeniedAccessAttempts(
    limit: number = 100,
    offset: number = 0
  ) {
    console.log(`[RBAC AUDIT] Getting denied access attempts (limit: ${limit}, offset: ${offset})`);
    // TODO: Implement when AuditLog model is added to Prisma schema
    return [];
  }

  /**
   * Get audit statistics (placeholder - would require database)
   */
  static async getAuditStats(days: number = 30) {
    console.log(`[RBAC AUDIT] Getting audit statistics for ${days} days`);
    // TODO: Implement when AuditLog model is added to Prisma schema
    return {
      total: 0,
      allowed: 0,
      denied: 0,
      denialRate: 0,
      byRole: [],
      byResource: [],
      period: `${days} days`,
    };
  }

  /**
   * Export audit logs to CSV (placeholder - would require database)
   */
  static async exportToCSV(
    filters: {
      userId?: string;
      resource?: Resource;
      allowed?: boolean;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<string> {
    console.log('[RBAC AUDIT] Exporting audit logs to CSV with filters:', filters);
    
    // Return CSV headers for now
    const headers = [
      'Timestamp',
      'User ID',
      'User Name',
      'User Email',
      'Role',
      'Action',
      'Resource',
      'Resource ID',
      'Allowed',
      'Reason',
      'IP Address',
      'User Agent',
      'Endpoint',
      'Method',
      'Status Code',
    ];

    return headers.join(',') + '\n';
  }
}

/**
 * Express/Next.js middleware helper for automatic audit logging
 */
export function createAuditLogger() {
  return async (req: any, res: any, next: any) => {
    const originalSend = res.send;
    
    res.send = function(body: any) {
      // Log the response after it's sent
      setImmediate(async () => {
        const userId = req.headers.get('x-user-id');
        const userRole = req.headers.get('x-user-role') as Role;
        
        if (userId && userRole) {
          await AuditLogger.logAccess({
            userId,
            userRole,
            action: 'api_access' as Permission,
            allowed: res.statusCode < 400,
            endpoint: req.url,
            method: req.method,
            statusCode: res.statusCode,
            ipAddress: req.ip || req.headers.get('x-forwarded-for'),
            userAgent: req.headers.get('user-agent'),
          });
        }
      });
      
      return originalSend.call(this, body);
    };
    
    next();
  };
}
