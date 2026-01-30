import { Pool } from 'pg';
import { prisma } from './prisma';

export interface DatabaseHealthResult {
  success: boolean;
  timestamp: string;
  latency?: number;
  error?: string;
  details?: {
    prismaConnection: boolean;
    directConnection: boolean;
    serverTime?: string;
    version?: string;
  };
}

export class DatabaseHealthChecker {
  private static instance: DatabaseHealthChecker;
  private pool?: Pool;

  private constructor() {}

  public static getInstance(): DatabaseHealthChecker {
    if (!DatabaseHealthChecker.instance) {
      DatabaseHealthChecker.instance = new DatabaseHealthChecker();
    }
    return DatabaseHealthChecker.instance;
  }

  private getDirectPool(): Pool {
    if (!this.pool) {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set');
      }
      
      this.pool = new Pool({
        connectionString: databaseUrl,
        max: 1,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 10000,
      });
    }
    return this.pool;
  }

  public async checkHealth(): Promise<DatabaseHealthResult> {
    const startTime = Date.now();
    const result: DatabaseHealthResult = {
      success: false,
      timestamp: new Date().toISOString(),
    };

    const details = {
      prismaConnection: false,
      directConnection: false,
    };

    try {
      // Test Prisma connection
      const prismaStartTime = Date.now();
      await prisma.$queryRaw`SELECT 1 as test`;
      details.prismaConnection = true;
      const prismaLatency = Date.now() - prismaStartTime;

      // Test direct PostgreSQL connection
      const pool = this.getDirectPool();
      const directStartTime = Date.now();
      const directResult = await pool.query('SELECT version(), NOW() as server_time');
      details.directConnection = true;
      const directLatency = Date.now() - directStartTime;

      result.success = true;
      result.latency = Math.max(prismaLatency, directLatency);
      result.details = {
        ...details,
        serverTime: directResult.rows[0]?.server_time,
        version: directResult.rows[0]?.version,
      };

      console.log('Database health check passed:', {
        latency: result.latency,
        prismaLatency,
        directLatency,
      });

    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown database error';
      result.details = details;
      
      console.error('Database health check failed:', {
        error: result.error,
        details,
      });
    }

    return result;
  }

  public async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const health = await this.checkHealth();
      
      if (health.success) {
        return {
          success: true,
          message: `Database connection successful. Latency: ${health.latency}ms`,
        };
      } else {
        return {
          success: false,
          message: `Database connection failed: ${health.error}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection test error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = undefined;
    }
    await prisma.$disconnect();
  }
}

export const dbHealthChecker = DatabaseHealthChecker.getInstance();

// Utility function for quick connection testing
export async function testDatabaseConnection(): Promise<void> {
  const result = await dbHealthChecker.testConnection();
  
  if (result.success) {
    console.log('✅', result.message);
  } else {
    console.error('❌', result.message);
    throw new Error(result.message);
  }
}
