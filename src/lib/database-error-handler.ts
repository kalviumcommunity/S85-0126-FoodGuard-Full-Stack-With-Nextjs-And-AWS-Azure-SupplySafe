import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { ERROR_CODES } from "@/lib/errorCodes";

export interface DatabaseError extends Error {
  code?: string;
  severity?: string;
  detail?: string;
  hint?: string;
  position?: string;
  internalPosition?: string;
  internalQuery?: string;
  where?: string;
  schema?: string;
  table?: string;
  column?: string;
  dataType?: string;
  constraint?: string;
}

export class DatabaseConnectionError extends Error {
  constructor(
    message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = "DatabaseConnectionError";
  }
}

export class DatabaseTimeoutError extends Error {
  constructor(
    message: string,
    public timeout: number
  ) {
    super(message);
    this.name = "DatabaseTimeoutError";
  }
}

export class DatabaseQueryError extends Error {
  constructor(
    message: string,
    public query?: string,
    public parameters?: any[]
  ) {
    super(message);
    this.name = "DatabaseQueryError";
  }
}

export class DatabaseMigrationError extends Error {
  constructor(
    message: string,
    public migration?: string
  ) {
    super(message);
    this.name = "DatabaseMigrationError";
  }
}

/**
 * Enhanced error handler for database operations
 */
export class DatabaseErrorHandler {
  private static instance: DatabaseErrorHandler;

  private constructor() {}

  public static getInstance(): DatabaseErrorHandler {
    if (!DatabaseErrorHandler.instance) {
      DatabaseErrorHandler.instance = new DatabaseErrorHandler();
    }
    return DatabaseErrorHandler.instance;
  }

  /**
   * Handle database errors with proper logging and categorization
   */
  public handleError(
    error: unknown,
    context?: {
      operation?: string;
      query?: string;
      parameters?: any[];
      userId?: string;
      requestId?: string;
    }
  ): NextResponse {
    const errorInfo = this.categorizeError(error, context);

    // Log the error with full context
    logger.error(
      `Database error in ${context?.operation || "unknown operation"}`,
      error instanceof Error ? error : new Error(String(error)),
      {
        operation: context?.operation,
        query: context?.query,
        parameters: context?.parameters,
        userId: context?.userId,
        requestId: context?.requestId,
        errorCode: errorInfo.code,
        severity: errorInfo.severity,
        isRetryable: errorInfo.isRetryable,
      },
      `DATABASE_ERROR_${context?.operation?.toUpperCase() || "UNKNOWN"}`
    );

    // Return appropriate HTTP response
    return this.createErrorResponse(errorInfo);
  }

  /**
   * Categorize database errors for appropriate handling
   */
  private categorizeError(
    error: unknown,
    context?: any
  ): {
    type:
      | "connection"
      | "timeout"
      | "query"
      | "constraint"
      | "migration"
      | "unknown";
    code: string;
    message: string;
    severity: "low" | "medium" | "high" | "critical";
    isRetryable: boolean;
    userMessage: string;
  } {
    if (error instanceof DatabaseConnectionError) {
      return {
        type: "connection",
        code: ERROR_CODES.DATABASE_CONNECTION,
        message: error.message,
        severity: "critical",
        isRetryable: true,
        userMessage: "Database connection failed. Please try again.",
      };
    }

    if (error instanceof DatabaseTimeoutError) {
      return {
        type: "timeout",
        code: ERROR_CODES.DATABASE_TIMEOUT,
        message: error.message,
        severity: "high",
        isRetryable: true,
        userMessage: "Request timed out. Please try again.",
      };
    }

    if (error instanceof DatabaseQueryError) {
      return {
        type: "query",
        code: ERROR_CODES.DATABASE_QUERY,
        message: error.message,
        severity: "medium",
        isRetryable: false,
        userMessage: "Database query failed. Please contact support.",
      };
    }

    if (error instanceof DatabaseMigrationError) {
      return {
        type: "migration",
        code: ERROR_CODES.DATABASE_ERROR,
        message: error.message,
        severity: "critical",
        isRetryable: false,
        userMessage: "Database migration failed. Please contact administrator.",
      };
    }

    // Handle PostgreSQL specific errors
    if (this.isPostgresError(error)) {
      const pgError = error as DatabaseError;

      switch (pgError.code) {
        case "08006": // connection_failure
        case "08001": // sqlclient_unable_to_establish_sqlconnection
        case "08004": // sqlserver_rejected_establishment_of_sqlconnection
        case "08003": // connection_does_not_exist
        case "57P01": // admin_shutdown
        case "57P02": // crash_shutdown
        case "57P03": // cannot_connect_now
          return {
            type: "connection",
            code: ERROR_CODES.DATABASE_CONNECTION,
            message: pgError.message,
            severity: "critical",
            isRetryable: true,
            userMessage: "Database connection failed. Please try again.",
          };

        case "57014": // statement_timeout
        case "53100": // disk_full
        case "53200": // out_of_memory
        case "53300": // too_many_connections
        case "53400": // configuration_limit_exceeded
          return {
            type: "timeout",
            code: ERROR_CODES.DATABASE_TIMEOUT,
            message: pgError.message,
            severity: "high",
            isRetryable: true,
            userMessage: "Database temporarily unavailable. Please try again.",
          };

        case "23505": // unique_violation
        case "23503": // foreign_key_violation
        case "23514": // check_violation
        case "23P01": // exclusion_violation
          return {
            type: "constraint",
            code: ERROR_CODES.DUPLICATE_ENTRY,
            message: pgError.message,
            severity: "medium",
            isRetryable: false,
            userMessage: "Data validation failed. Please check your input.",
          };

        case "42P01": // undefined_table
        case "42703": // undefined_column
        case "42883": // undefined_function
          return {
            type: "query",
            code: ERROR_CODES.DATABASE_QUERY,
            message: pgError.message,
            severity: "high",
            isRetryable: false,
            userMessage: "Database schema error. Please contact support.",
          };

        default:
          return {
            type: "unknown",
            code: ERROR_CODES.DATABASE_ERROR,
            message: pgError.message,
            severity: "medium",
            isRetryable: false,
            userMessage: "Database error occurred. Please try again.",
          };
      }
    }

    // Handle generic errors
    if (error instanceof Error) {
      return {
        type: "unknown",
        code: ERROR_CODES.INTERNAL_ERROR,
        message: error.message,
        severity: "medium",
        isRetryable: false,
        userMessage: "An unexpected error occurred. Please try again.",
      };
    }

    // Handle unknown error types
    return {
      type: "unknown",
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Unknown error occurred",
      severity: "high",
      isRetryable: false,
      userMessage: "An unexpected error occurred. Please try again.",
    };
  }

  /**
   * Check if error is a PostgreSQL error
   */
  private isPostgresError(error: any): error is DatabaseError {
    return error && typeof error === "object" && "code" in error;
  }

  /**
   * Create appropriate HTTP response based on error type
   */
  private createErrorResponse(errorInfo: {
    type: string;
    code: string;
    message: string;
    severity: string;
    isRetryable: boolean;
    userMessage: string;
  }): NextResponse {
    const statusCode = this.getStatusCode(errorInfo.type, errorInfo.severity);

    const response = {
      success: false,
      message: errorInfo.userMessage,
      error: {
        code: errorInfo.code,
        type: errorInfo.type,
        severity: errorInfo.severity,
        isRetryable: errorInfo.isRetryable,
      },
      timestamp: new Date().toISOString(),
    };

    // Add detailed error information in development
    if (process.env.NODE_ENV === "development") {
      (response.error as any).details = {
        originalMessage: errorInfo.message,
        stack: new Error().stack,
      };
    }

    return NextResponse.json(response, { status: statusCode });
  }

  /**
   * Get appropriate HTTP status code based on error type and severity
   */
  private getStatusCode(type: string, severity: string): number {
    switch (type) {
      case "connection":
      case "timeout":
        return 503; // Service Unavailable
      case "constraint":
        return 400; // Bad Request
      case "query":
        return severity === "high" ? 500 : 422; // Internal Server Error or Unprocessable Entity
      case "migration":
        return 503; // Service Unavailable
      default:
        return 500; // Internal Server Error
    }
  }
}

/**
 * Database operation wrapper with error handling
 */
export async function withDatabaseErrorHandling<T>(
  operation: () => Promise<T>,
  context: {
    operation: string;
    query?: string;
    parameters?: any[];
    userId?: string;
    requestId?: string;
  }
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const errorHandler = DatabaseErrorHandler.getInstance();
    const response = errorHandler.handleError(error, context);
    throw response;
  }
}

/**
 * Database connection retry logic
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry on non-retryable errors
      if (
        error instanceof DatabaseQueryError ||
        error instanceof DatabaseMigrationError ||
        (error instanceof Error && error.message.includes("constraint"))
      ) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );

      logger.warn(
        `Database operation failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`,
        error instanceof Error ? error : new Error(String(error)),
        { attempt: attempt + 1, maxRetries, delay }
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Circuit breaker pattern for database operations
 */
export class DatabaseCircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: "closed" | "open" | "half-open" = "closed";

  constructor(
    private options: {
      failureThreshold?: number;
      recoveryTimeout?: number;
      monitoringPeriod?: number;
    } = {}
  ) {
    this.options = {
      failureThreshold: 5,
      recoveryTimeout: 60000, // 1 minute
      monitoringPeriod: 10000, // 10 seconds
      ...options,
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime > this.options.recoveryTimeout!) {
        this.state = "half-open";
      } else {
        throw new DatabaseConnectionError("Circuit breaker is open");
      }
    }

    try {
      const result = await operation();

      if (this.state === "half-open") {
        this.state = "closed";
        this.failures = 0;
      }

      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();

      if (this.failures >= this.options.failureThreshold!) {
        this.state = "open";
      }

      throw error;
    }
  }

  getState(): string {
    return this.state;
  }

  getFailures(): number {
    return this.failures;
  }

  reset(): void {
    this.failures = 0;
    this.state = "closed";
    this.lastFailureTime = 0;
  }
}

export const databaseErrorHandler = DatabaseErrorHandler.getInstance();
