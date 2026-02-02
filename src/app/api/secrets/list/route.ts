import { NextRequest, NextResponse } from "next/server";
import { getSecrets } from "@/lib/secrets";
import { addCorsHeaders, handleCorsPreflight } from "@/lib/security";

export async function GET(request: NextRequest) {
  // Handle CORS preflight
  const preflightResponse = handleCorsPreflight(request);
  if (preflightResponse) return preflightResponse;

  try {
    const secrets = await getSecrets();

    // Mask sensitive values for security
    const maskedSecrets: Record<string, string> = {};
    Object.entries(secrets).forEach(([key, value]) => {
      // Don't mask public variables
      if (key.startsWith("NEXT_PUBLIC_")) {
        maskedSecrets[key] = value;
      } else {
        // Mask sensitive values
        if (value && value.length > 8) {
          maskedSecrets[key] =
            value.substring(0, 4) +
            "*".repeat(value.length - 8) +
            value.substring(value.length - 4);
        } else {
          maskedSecrets[key] = "*".repeat(value?.length || 0);
        }
      }
    });

    const response = NextResponse.json({
      success: true,
      secrets: maskedSecrets,
      count: Object.keys(secrets).length,
      timestamp: new Date().toISOString(),
    });

    return addCorsHeaders(response, request.headers.get("origin") || undefined);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting secrets:", error);

    const response = NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve secrets",
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
