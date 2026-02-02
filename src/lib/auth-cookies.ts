import { NextRequest, NextResponse } from "next/server";

// Cookie configuration for security
export const COOKIE_CONFIG = {
  ACCESS_TOKEN: {
    name: "accessToken",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 15 * 60, // 15 minutes in seconds
      path: "/",
    },
  },
  REFRESH_TOKEN: {
    name: "refreshToken",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    },
  },
};

// Set tokens in secure HTTP-only cookies
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  response.cookies.set(
    COOKIE_CONFIG.ACCESS_TOKEN.name,
    accessToken,
    COOKIE_CONFIG.ACCESS_TOKEN.options
  );
  response.cookies.set(
    COOKIE_CONFIG.REFRESH_TOKEN.name,
    refreshToken,
    COOKIE_CONFIG.REFRESH_TOKEN.options
  );
}

// Clear auth cookies
export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(COOKIE_CONFIG.ACCESS_TOKEN.name);
  response.cookies.delete(COOKIE_CONFIG.REFRESH_TOKEN.name);
}

// Get access token from request
export function getAccessToken(request: NextRequest): string | undefined {
  // Try Authorization header first (Bearer token)
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  // Fallback to cookie
  return request.cookies.get(COOKIE_CONFIG.ACCESS_TOKEN.name)?.value;
}

// Get refresh token from request
export function getRefreshToken(request: NextRequest): string | undefined {
  return request.cookies.get(COOKIE_CONFIG.REFRESH_TOKEN.name)?.value;
}

// Get tokens from client-side (for use in components)
export function getClientTokens() {
  // Note: This function should only be used in client components
  // In server components, use the server-side functions above
  if (typeof window === "undefined") {
    throw new Error("getClientTokens can only be used in client components");
  }

  // For client-side, we'll use memory storage instead of cookies
  // This is safer than localStorage for access tokens
  return {
    accessToken:
      (window as unknown as { __accessToken?: string | null }).__accessToken ||
      null,
    refreshToken:
      (window as unknown as { __refreshToken?: string | null })
        .__refreshToken || null,
  };
}

// Set tokens in client-side memory
export function setClientTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") {
    throw new Error("setClientTokens can only be used in client components");
  }

  // Store in memory (not localStorage) to prevent XSS
  (window as unknown as { __accessToken: string }).__accessToken = accessToken;
  (window as unknown as { __refreshToken: string }).__refreshToken =
    refreshToken;
}

// Clear client-side tokens
export function clearClientTokens() {
  if (typeof window === "undefined") {
    throw new Error("clearClientTokens can only be used in client components");
  }

  delete (window as unknown as { __accessToken?: string }).__accessToken;
  delete (window as unknown as { __refreshToken?: string }).__refreshToken;
}

// Check if tokens are present and valid
export function hasValidTokens(request: NextRequest): boolean {
  const accessToken = getAccessToken(request);
  const refreshToken = getRefreshToken(request);

  return !!(accessToken && refreshToken);
}

// Refresh token rotation helper
export function rotateRefreshToken(
  response: NextResponse,
  newRefreshToken: string
) {
  response.cookies.set(
    COOKIE_CONFIG.REFRESH_TOKEN.name,
    newRefreshToken,
    COOKIE_CONFIG.REFRESH_TOKEN.options
  );
}
