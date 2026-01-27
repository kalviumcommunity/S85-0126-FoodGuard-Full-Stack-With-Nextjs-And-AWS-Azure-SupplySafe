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
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
    };

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
    context?: string
  ): void {
    const entry = this.formatLog("info", message, meta, context);
    this.writeLog(entry);
  }

  warn(
    message: string,
    meta?: Record<string, unknown>,
    context?: string
  ): void {
    const entry = this.formatLog("warn", message, meta, context);
    this.writeLog(entry);
  }

  error(
    message: string,
    error?: Error,
    meta?: Record<string, unknown>,
    context?: string
  ): void {
    const entry = this.formatLog("error", message, meta, context, error);
    this.writeLog(entry);
  }

  debug(
    message: string,
    meta?: Record<string, unknown>,
    context?: string
  ): void {
    if (process.env.NODE_ENV === "development") {
      const entry = this.formatLog("debug", message, meta, context);
      this.writeLog(entry);
    }
  }
}

export const logger = new Logger();
