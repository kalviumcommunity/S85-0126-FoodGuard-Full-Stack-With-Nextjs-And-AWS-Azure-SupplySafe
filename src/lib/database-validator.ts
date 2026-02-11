import { Pool } from "pg";

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  connectionTimeout?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config?: DatabaseConfig;
}

export interface ConnectionTestResult {
  success: boolean;
  latency?: number;
  error?: string;
  serverInfo?: {
    version: string;
    timezone: string;
    maxConnections: number;
    currentConnections: number;
  };
}

export class DatabaseConfigValidator {
  private static readonly DEFAULT_TIMEOUT = 10000; // 10 seconds
  private static readonly DEFAULT_PORT = 5432;

  /**
   * Parse and validate DATABASE_URL
   */
  static parseDatabaseUrl(databaseUrl: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!databaseUrl) {
      errors.push("DATABASE_URL is not set");
      return { isValid: false, errors, warnings };
    }

    // Check if it's a valid PostgreSQL connection string
    const pgUrlPattern =
      /^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?$/;
    const match = databaseUrl.match(pgUrlPattern);

    if (!match) {
      errors.push("Invalid PostgreSQL connection string format");
      errors.push(
        "Expected format: postgresql://username:password@host:port/database"
      );
      return { isValid: false, errors, warnings };
    }

    const [, username, password, host, portStr, database] = match;
    const port = parseInt(portStr, 10);

    const config: DatabaseConfig = {
      host,
      port,
      database,
      username,
      password,
      ssl: databaseUrl.includes("sslmode=require"),
    };

    // Validate host
    if (!host || host.trim() === "") {
      errors.push("Host is required");
    } else if (host === "localhost" || host === "127.0.0.1") {
      warnings.push("Using localhost - this is typically for development only");
    } else if (host.includes(".rds.amazonaws.com")) {
      // AWS RDS specific validation
      if (!config.ssl) {
        warnings.push(
          "AWS RDS connections should use SSL (add ?sslmode=require)"
        );
      }
    } else if (host.includes(".postgres.database.azure.com")) {
      // Azure PostgreSQL specific validation
      if (!config.ssl) {
        warnings.push("Azure PostgreSQL requires SSL (add ?sslmode=require)");
      }
    }

    // Validate port
    if (isNaN(port) || port <= 0 || port > 65535) {
      errors.push("Port must be a valid number between 1 and 65535");
    } else if (port !== this.DEFAULT_PORT) {
      warnings.push(
        `Using non-standard port ${port} (default is ${this.DEFAULT_PORT})`
      );
    }

    // Validate database name
    if (!database || database.trim() === "") {
      errors.push("Database name is required");
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(database)) {
      warnings.push("Database name contains unusual characters");
    }

    // Validate username
    if (!username || username.trim() === "") {
      errors.push("Username is required");
    }

    // Validate password
    if (!password || password.trim() === "") {
      errors.push("Password is required");
    } else if (password.length < 8) {
      warnings.push("Password should be at least 8 characters long");
    } else if (
      password.toLowerCase() === "password" ||
      password.toLowerCase() === "admin"
    ) {
      warnings.push("Using a common password - consider using a stronger one");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      config,
    };
  }

  /**
   * Test database connection with detailed results
   */
  static async testConnection(
    config: DatabaseConfig
  ): Promise<ConnectionTestResult> {
    const startTime = Date.now();

    try {
      const pool = new Pool({
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.username,
        password: config.password,
        ssl: config.ssl ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: this.DEFAULT_TIMEOUT,
        max: 1, // Only one connection for testing
      });

      // Test basic connection
      const client = await pool.connect();
      const latency = Date.now() - startTime;

      try {
        // Get server information
        const serverInfoQuery = `
          SELECT 
            version(),
            current_setting('timezone') as timezone,
            setting::int as max_connections
          FROM pg_settings 
          WHERE name = 'max_connections'
        `;

        const serverResult = await client.query(serverInfoQuery);
        const serverInfo = serverResult.rows[0];

        // Get current connection count
        const connectionCountQuery = `
          SELECT count(*) as current_connections 
          FROM pg_stat_activity 
          WHERE state = 'active'
        `;
        const connectionResult = await client.query(connectionCountQuery);

        return {
          success: true,
          latency,
          serverInfo: {
            version: serverInfo.version,
            timezone: serverInfo.timezone,
            maxConnections: serverInfo.max_connections,
            currentConnections: parseInt(
              connectionResult.rows[0].current_connections,
              10
            ),
          },
        };
      } finally {
        client.release();
        await pool.end();
      }
    } catch (error) {
      return {
        success: false,
        latency: Date.now() - startTime,
        error:
          error instanceof Error ? error.message : "Unknown connection error",
      };
    }
  }

  /**
   * Validate environment and provide recommendations
   */
  static validateEnvironment(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if we're in production
    const isProduction = process.env.NODE_ENV === "production";

    // Validate DATABASE_URL
    const dbValidation = this.parseDatabaseUrl(process.env.DATABASE_URL || "");
    errors.push(...dbValidation.errors);
    warnings.push(...dbValidation.warnings);

    // Production-specific checks
    if (isProduction) {
      if (!dbValidation.config?.ssl) {
        errors.push("Production environment requires SSL connection");
      }

      if (dbValidation.config?.host?.includes("localhost")) {
        errors.push("Production environment cannot use localhost");
      }

      if (process.env.DATABASE_URL?.includes("password")) {
        warnings.push(
          "Consider using secrets management for production credentials"
        );
      }
    }

    // Check for required environment variables
    const requiredVars = ["JWT_SECRET"];
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        errors.push(`${varName} environment variable is required`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      config: dbValidation.config,
    };
  }

  /**
   * Generate connection string suggestions
   */
  static generateConnectionSuggestions(
    config: Partial<DatabaseConfig>
  ): string[] {
    const suggestions: string[] = [];

    if (config.host?.includes(".rds.amazonaws.com")) {
      suggestions.push(
        `postgresql://${config.username || "admin"}:YourPassword@${config.host}:5432/${config.database || "supplysafe"}?sslmode=require`
      );
    } else if (config.host?.includes(".postgres.database.azure.com")) {
      suggestions.push(
        `postgresql://${config.username || "adminuser"}@${config.host}:YourPassword@${config.host}:5432/${config.database || "supplysafe"}?sslmode=require`
      );
    } else if (config.host?.includes("localhost")) {
      suggestions.push(
        `postgresql://postgres:password@localhost:5432/${config.database || "supplysafe"}`
      );
    } else {
      suggestions.push(
        `postgresql://${config.username || "username"}:password@${config.host || "your-db-host"}:5432/${config.database || "supplysafe"}`
      );
    }

    return suggestions;
  }

  /**
   * Get provider-specific recommendations
   */
  static getProviderRecommendations(host?: string): string[] {
    if (!host) return [];

    const recommendations: string[] = [];

    if (host.includes(".rds.amazonaws.com")) {
      recommendations.push("Enable automated backups in AWS RDS console");
      recommendations.push("Configure CloudWatch alarms for monitoring");
      recommendations.push("Use VPC security groups for network security");
      recommendations.push("Consider read replicas for scaling");
    } else if (host.includes(".postgres.database.azure.com")) {
      recommendations.push("Enable geo-redundant backups in Azure");
      recommendations.push("Configure Azure Monitor alerts");
      recommendations.push("Use VNet service endpoints for security");
      recommendations.push(
        "Consider Azure Database for PostgreSQL - Hyperscale"
      );
    }

    return recommendations;
  }
}

export default DatabaseConfigValidator;
