/**
 * Structured Logger Utility
 *
 * Provides consistent, structured logging for the application.
 * Logs are formatted as JSON for easy parsing by log aggregation tools.
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  context?: string;
  meta?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private formatLog(
    level: LogLevel,
    message: string,
    meta?: Record<string, unknown>,
    context?: string,
    error?: Error,
    requestId?: string
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
    };

    if (requestId) {
      entry.requestId = requestId;
    }

    if (context) {
      entry.context = context;
    }

    if (meta) {
      entry.meta = meta;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      };
    }

    return entry;
  }

  private writeLog(entry: LogEntry): void {
    const logString = JSON.stringify(entry);
    /* eslint-disable no-console */
    if (entry.level === "error") {
      console.error(logString);
    } else {
      console.log(logString);
    }
    /* eslint-enable no-console */
  }

  info(
    message: string,
    meta?: Record<string, unknown>,
    context?: string,
    requestId?: string
  ): void {
    const entry = this.formatLog(
      "info",
      message,
      meta,
      context,
      undefined,
      requestId
    );
    this.writeLog(entry);
  }

  warn(
    message: string,
    meta?: Record<string, unknown>,
    context?: string,
    requestId?: string
  ): void {
    const entry = this.formatLog(
      "warn",
      message,
      meta,
      context,
      undefined,
      requestId
    );
    this.writeLog(entry);
  }

  error(
    message: string,
    error?: Error,
    meta?: Record<string, unknown>,
    context?: string,
    requestId?: string
  ): void {
    const entry = this.formatLog(
      "error",
      message,
      meta,
      context,
      error,
      requestId
    );
    this.writeLog(entry);
  }

  debug(
    message: string,
    meta?: Record<string, unknown>,
    context?: string,
    requestId?: string
  ): void {
    if (process.env.NODE_ENV === "development") {
      const entry = this.formatLog(
        "debug",
        message,
        meta,
        context,
        undefined,
        requestId
      );
      this.writeLog(entry);
    }
  }

  // Helper method to generate a unique request ID
  static generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  // Helper method to log API request/response
  logApiRequest(
    method: string,
    url: string,
    requestId: string,
    meta?: Record<string, unknown>
  ): void {
    this.info(
      `API ${method} request received`,
      {
        method,
        url,
        ...meta,
      },
      "API",
      requestId
    );
  }

  logApiResponse(
    method: string,
    url: string,
    statusCode: number,
    requestId: string,
    responseTime?: number,
    meta?: Record<string, unknown>
  ): void {
    const level = statusCode >= 400 ? "error" : "info";
    const message = `API ${method} response - ${statusCode}`;

    if (level === "error") {
      this.error(
        message,
        undefined,
        {
          method,
          url,
          statusCode,
          responseTime,
          ...meta,
        },
        "API",
        requestId
      );
    } else {
      this.info(
        message,
        {
          method,
          url,
          statusCode,
          responseTime,
          ...meta,
        },
        "API",
        requestId
      );
    }
  }
}

export const logger = new Logger();
export { Logger };
