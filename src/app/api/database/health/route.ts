import { NextRequest, NextResponse } from "next/server";
import { dbHealthChecker } from "@/lib/database-health";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function GET(request: NextRequest) {
  try {
    const health = await dbHealthChecker.checkHealth();

    if (health.success) {
      return sendSuccess(health, "Database is healthy and connected");
    } else {
      return sendError(
        "Database health check failed",
        ERROR_CODES.DATABASE_ERROR,
        503,
        health.error
      );
    }
  } catch (error) {
    return sendError(
      "Failed to perform database health check",
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      500,
      error
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await dbHealthChecker.testConnection();

    if (result.success) {
      return sendSuccess(
        { message: result.message },
        "Connection test successful"
      );
    } else {
      return sendError(result.message, ERROR_CODES.DATABASE_ERROR, 503);
    }
  } catch (error) {
    return sendError(
      "Connection test failed",
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      500,
      error
    );
  }
}
