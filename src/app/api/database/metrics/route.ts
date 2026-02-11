import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

interface DatabaseMetrics {
  connections: {
    active: number;
    max: number;
    utilization: number;
  };
  performance: {
    avgQueryTime: number;
    queriesPerSecond: number;
    slowQueries: number;
  };
  storage: {
    used: number;
    total: number;
    utilization: number;
  };
  uptime: {
    total: number;
    since: string;
  };
  health: {
    status: "healthy" | "warning" | "critical";
    lastCheck: string;
    issues: string[];
  };
}

interface DatabaseInfo {
  version: string;
  timezone: string;
  encoding: string;
  collation: string;
}

async function getDatabaseMetrics(): Promise<DatabaseMetrics> {
  try {
    // Get connection metrics
    const connectionQuery = `
      SELECT 
        setting::int as max_connections,
        (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') as active_connections
      FROM pg_settings 
      WHERE name = 'max_connections'
    `;

    const connectionResult = (await prisma.$queryRawUnsafe(
      connectionQuery
    )) as any[];
    const connectionData = connectionResult[0];

    const activeConnections = Number(connectionData.active_connections);
    const maxConnections = Number(connectionData.max_connections);
    const connectionUtilization = (activeConnections / maxConnections) * 100;

    // Get database size
    const sizeQuery = `
      SELECT 
        pg_database_size(current_database()) as used_size,
        (SELECT setting::int * 8192 FROM pg_settings WHERE name = 'shared_buffers') as buffer_size
    `;

    const sizeResult = (await prisma.$queryRawUnsafe(sizeQuery)) as any[];
    const sizeData = sizeResult[0];

    const usedSize = Number(sizeData.used_size);
    const totalSize = usedSize * 2; // Estimate total size as 2x current usage
    const storageUtilization = (usedSize / totalSize) * 100;

    // Get performance metrics
    const performanceQuery = `
      SELECT 
        COALESCE(AVG(EXTRACT(EPOCH FROM (query_end - query_start)) * 1000), 0) as avg_query_time,
        COALESCE(SUM(CASE WHEN state = 'active' THEN 1 ELSE 0 END), 0) as active_queries,
        COALESCE(SUM(CASE WHEN query_start < NOW() - INTERVAL '5 seconds' THEN 1 ELSE 0 END), 0) as slow_queries
      FROM pg_stat_activity
      WHERE query != '<IDLE>' AND query IS NOT NULL
    `;

    const performanceResult = (await prisma.$queryRawUnsafe(
      performanceQuery
    )) as any[];
    const performanceData = performanceResult[0];

    const avgQueryTime = Number(performanceData.avg_query_time) || 0;
    const queriesPerSecond = Number(performanceData.active_queries) || 0;
    const slowQueries = Number(performanceData.slow_queries) || 0;

    // Get uptime
    const uptimeQuery = `
      SELECT 
        EXTRACT(EPOCH FROM (NOW() - pg_postmaster_start_time())) as uptime_seconds,
        pg_postmaster_start_time() as start_time
    `;

    const uptimeResult = (await prisma.$queryRawUnsafe(uptimeQuery)) as any[];
    const uptimeData = uptimeResult[0];

    const uptimeSeconds = Number(uptimeData.uptime_seconds);
    const startTime = uptimeData.start_time;

    // Determine health status
    const issues: string[] = [];
    let status: "healthy" | "warning" | "critical" = "healthy";

    if (connectionUtilization > 80) {
      issues.push("High connection utilization");
      status = connectionUtilization > 90 ? "critical" : "warning";
    }

    if (storageUtilization > 80) {
      issues.push("High storage utilization");
      status = storageUtilization > 90 ? "critical" : "warning";
    }

    if (avgQueryTime > 1000) {
      issues.push("Slow query performance");
      status = avgQueryTime > 5000 ? "critical" : "warning";
    }

    if (slowQueries > 10) {
      issues.push("Multiple slow queries detected");
      status = slowQueries > 50 ? "critical" : "warning";
    }

    return {
      connections: {
        active: activeConnections,
        max: maxConnections,
        utilization: Math.round(connectionUtilization * 100) / 100,
      },
      performance: {
        avgQueryTime: Math.round(avgQueryTime * 100) / 100,
        queriesPerSecond,
        slowQueries,
      },
      storage: {
        used: usedSize,
        total: totalSize,
        utilization: Math.round(storageUtilization * 100) / 100,
      },
      uptime: {
        total: Math.round(uptimeSeconds),
        since: startTime,
      },
      health: {
        status,
        lastCheck: new Date().toISOString(),
        issues,
      },
    };
  } catch (error) {
    console.error("Error fetching database metrics:", error);
    throw error;
  }
}

async function getDatabaseInfo(): Promise<DatabaseInfo> {
  try {
    const infoQuery = `
      SELECT 
        version() as version,
        current_setting('timezone') as timezone,
        current_setting('server_encoding') as encoding,
        current_setting('lc_collate') as collation
    `;

    const result = (await prisma.$queryRawUnsafe(infoQuery)) as any[];
    const data = result[0];

    return {
      version: data.version.split(",")[0], // Get just the version number
      timezone: data.timezone,
      encoding: data.encoding,
      collation: data.collation,
    };
  } catch (error) {
    console.error("Error fetching database info:", error);
    throw error;
  }
}

export async function GET() {
  try {
    const [metrics, databaseInfo] = await Promise.all([
      getDatabaseMetrics(),
      getDatabaseInfo(),
    ]);

    return sendSuccess(
      {
        metrics,
        databaseInfo,
      },
      "Database metrics retrieved successfully"
    );
  } catch (error) {
    console.error("Database metrics error:", error);
    return sendError(
      "Failed to retrieve database metrics",
      ERROR_CODES.DATABASE_ERROR,
      503,
      error
    );
  }
}
