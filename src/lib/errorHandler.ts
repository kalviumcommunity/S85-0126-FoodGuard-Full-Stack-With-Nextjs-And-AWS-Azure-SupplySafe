/**
 * Centralized Error Handler
 *
 * Provides a unified way to handle and log errors across the application.
 * Ensures consistent error responses and structured logging while keeping
 * sensitive information secure in production.
 */

import { NextResponse } from "next/server";
import { logger } from "./logger";
import { sendError } from "./responseHandler";
import { ERROR_CODES, type ErrorCode } from "./errorCodes";

interface ErrorContext {
  route?: string;
  method?: string;
  userId?: string;
  [key: string]: unknown;
}

/**
 * Custom error types for better error categorization
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public code: ErrorCode,
    public statusCode: number = 500,
    public isOperational = true
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message, ERROR_CODES.VALIDATION_ERROR, 400);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message, ERROR_CODES.DATABASE_ERROR, 503);
    this.name = "DatabaseError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, ERROR_CODES.UNAUTHORIZED, 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, ERROR_CODES.FORBIDDEN, 403);
    this.name = "AuthorizationError";
  }
}

/**
 * Categorizes an error and extracts relevant information
 */
function categorizeError(error: unknown): {
  message: string;
  code: ErrorCode;
  statusCode: number;
  isOperational: boolean;
  stack?: string;
  originalError?: unknown;
} {
  // Handle custom AppError instances
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
      stack: error.stack,
    };
  }

  // Handle Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code?: string; meta?: unknown };
    if (prismaError.code === "P2002") {
      return {
        message: "Duplicate entry detected",
        code: ERROR_CODES.DUPLICATE_ENTRY,
        statusCode: 409,
        isOperational: true,
      };
    }
    if (prismaError.code?.startsWith("P")) {
      return {
        message: "Database operation failed",
        code: ERROR_CODES.DATABASE_QUERY_FAILED,
        statusCode: 503,
        isOperational: true,
        originalError: prismaError,
      };
    }
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return {
      message: error.message || "An unexpected error occurred",
      code: ERROR_CODES.INTERNAL_ERROR,
      statusCode: 500,
      isOperational: false,
      stack: error.stack,
    };
  }

  // Handle unknown error types
  return {
    message: "An unexpected error occurred",
    code: ERROR_CODES.INTERNAL_ERROR,
    statusCode: 500,
    isOperational: false,
    originalError: error,
  };
}

/**
 * Centralized error handler
 *
 * @param error - The error to handle (can be Error, AppError, or unknown)
 * @param context - Additional context about where the error occurred
 * @returns NextResponse with formatted error
 */
export function handleError(
  error: unknown,
  context?: ErrorContext
): NextResponse {
  const isProduction = process.env.NODE_ENV === "production";
  const categorized = categorizeError(error);

  // Build context string for logging
  const contextString = context?.route
    ? `${context.method || "UNKNOWN"} ${context.route}`
    : context?.method || "Unknown";

  // Log error with full details (always log everything internally)
  logger.error(
    `Error in ${contextString}`,
    error instanceof Error ? error : new Error(String(error)),
    {
      errorCode: categorized.code,
      statusCode: categorized.statusCode,
      isOperational: categorized.isOperational,
      ...(context?.userId && { userId: context.userId }),
      ...(categorized.originalError && {
        originalError: categorized.originalError,
      }),
    },
    contextString
  );

  // Determine user-facing message
  let userMessage = categorized.message;
  if (isProduction && !categorized.isOperational) {
    // Hide internal error details in production for non-operational errors
    userMessage = "Something went wrong. Please try again later.";
  }

  // Build error details for response (only in development)
  const errorDetails: Record<string, unknown> = {};
  if (!isProduction) {
    if (categorized.stack) {
      errorDetails.stack = categorized.stack;
    }
    if (categorized.originalError) {
      errorDetails.originalError = categorized.originalError;
    }
    if (error instanceof ValidationError && error.fields) {
      errorDetails.fields = error.fields;
    }
  }

  // Return formatted error response
  return sendError(
    userMessage,
    categorized.code,
    categorized.statusCode,
    errorDetails
  );
}

/**
 * Wrapper for async route handlers to automatically catch and handle errors
 *
 * @example
 * export const GET = withErrorHandling(async (req) => {
 *   // Your route logic here
 *   return sendSuccess(data, "Success");
 * }, "GET /api/users");
 */
export function withErrorHandling<
  T extends (...args: unknown[]) => Promise<NextResponse>,
>(handler: T, context: string): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleError(error, {
        route: context,
        method: context.split(" ")[0],
      });
    }
  }) as T;
}
