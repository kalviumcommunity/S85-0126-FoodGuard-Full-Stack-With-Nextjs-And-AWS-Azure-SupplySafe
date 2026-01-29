import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth-cookies";

/**
 * Logout Endpoint
 *
 * Clears authentication cookies and invalidates the user session.
 * This endpoint should be called when the user explicitly logs out.
 */
export async function POST() {
  try {
    // Create response and clear all auth cookies
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    clearAuthCookies(response);

    return response;
  } catch {
    // eslint-disable-next-line no-console
    console.error("Logout error:");
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
