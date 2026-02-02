import { NextRequest, NextResponse } from "next/server";
import { getSecretsStatus } from "@/lib/secrets";
import { addCorsHeaders, handleCorsPreflight } from "@/lib/security";

export async function GET(request: NextRequest) {
  // Handle CORS preflight
  const preflightResponse = handleCorsPreflight(request);
  if (preflightResponse) return preflightResponse;

  try {
    const status = await getSecretsStatus();

    const response = NextResponse.json({
      success: true,
      ...status,
    });

    return addCorsHeaders(response, request.headers.get("origin") || undefined);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting secrets status:", error);

    const response = NextResponse.json(
      {
        success: false,
        error: "Failed to get secrets status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );

    return addCorsHeaders(response, request.headers.get("origin") || undefined);
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response, request.headers.get("origin") || undefined);
}
