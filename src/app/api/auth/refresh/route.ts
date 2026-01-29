import { NextRequest, NextResponse } from "next/server";
import { verifyToken, generateToken } from "@/lib/jwt";
import { getRefreshToken, rotateRefreshToken } from "@/lib/auth-cookies";

/**
 * Refresh Token Endpoint
 *
 * Uses a valid refresh token to generate a new access token.
 * Implements token rotation for security.
 *
 * This endpoint should only be called when the access token has expired.
 */
export async function POST(request: NextRequest) {
  try {
    const refreshToken = getRefreshToken(request);

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token not provided" },
        { status: 401 }
      );
    }

    // Verify refresh token
    let payload;
    try {
      payload = await verifyToken(refreshToken, "refresh");
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    // Generate new access token
    const newAccessToken = await generateToken(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        name: payload.name,
      },
      "access"
    );

    // Generate new refresh token (token rotation)
    const newRefreshToken = await generateToken(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        name: payload.name,
      },
      "refresh"
    );

    // Create response and rotate refresh token
    const response = NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        expiresIn: "15m",
      },
    });

    // Set new refresh token in cookie (rotation)
    rotateRefreshToken(response, newRefreshToken);

    return response;
  } catch {
    // eslint-disable-next-line no-console
    console.error("Token refresh error:");
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
