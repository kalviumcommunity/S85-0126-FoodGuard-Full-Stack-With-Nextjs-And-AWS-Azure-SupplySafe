import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: unknown;
  };
  timestamp: string;
}

export const sendSuccess = <T = unknown>(
  data: T,
  message = "Success",
  status = 200
): NextResponse<ApiSuccessResponse<T>> => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};

export const sendError = (
  message = "Something went wrong",
  code = "INTERNAL_ERROR",
  status = 500,
  details?: unknown
): NextResponse<ApiErrorResponse> => {
  const sanitizedDetails =
    process.env.NODE_ENV === "development" ? details : undefined;

  return NextResponse.json(
    {
      success: false,
      message,
      error: { code, details: sanitizedDetails },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};
