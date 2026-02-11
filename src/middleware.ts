import { NextResponse } from "next/server";

// Temporarily disable auth middleware to allow Supabase to work
export async function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
