import { NextRequest, NextResponse } from "next/server";

// CORS configuration utility
export const corsConfig = {
  // Allowed origins based on environment
  allowedOrigins:
    process.env.NODE_ENV === "production"
      ? [
          "https://your-production-domain.com",
          "https://www.your-production-domain.com",
          // Add your production domains here
        ]
      : [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://127.0.0.1:3000",
          "http://127.0.0.1:3001",
        ],

  // Allowed HTTP methods
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  // Allowed headers
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "X-CSRF-Token",
  ],

  // Exposed headers (if any)
  exposedHeaders: [],

  // Allow credentials
  credentials: true,

  // Max age for preflight requests
  maxAge: 86400, // 24 hours in seconds
};

// CORS middleware function
export function addCorsHeaders(
  response: NextResponse,
  origin?: string
): NextResponse {
  // Check if origin is allowed
  const isOriginAllowed = origin && corsConfig.allowedOrigins.includes(origin);

  if (isOriginAllowed) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else if (process.env.NODE_ENV === "development") {
    // In development, allow all origins for easier testing
    response.headers.set("Access-Control-Allow-Origin", "*");
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    corsConfig.allowedMethods.join(", ")
  );

  response.headers.set(
    "Access-Control-Allow-Headers",
    corsConfig.allowedHeaders.join(", ")
  );

  if (corsConfig.exposedHeaders.length > 0) {
    response.headers.set(
      "Access-Control-Expose-Headers",
      corsConfig.exposedHeaders.join(", ")
    );
  }

  response.headers.set(
    "Access-Control-Allow-Credentials",
    corsConfig.credentials.toString()
  );
  response.headers.set("Access-Control-Max-Age", corsConfig.maxAge.toString());

  return response;
}

// Handle preflight OPTIONS requests
export function handleCorsPreflight(request: NextRequest): NextResponse | null {
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 });
    return addCorsHeaders(response, request.headers.get("origin") || undefined);
  }

  return null;
}

// Security headers utility
export const securityHeaders = {
  // Content Security Policy
  csp: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.github.com https://*.amazonaws.com https://*.azure.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; "),

  // HSTS
  hsts: "max-age=63072000; includeSubDomains; preload",

  // Other security headers
  xFrameOptions: "DENY",
  xContentTypeOptions: "nosniff",
  referrerPolicy: "strict-origin-when-cross-origin",

  // Permissions Policy
  permissionsPolicy: [
    "camera=()",
    "microphone=()",
    "geolocation=()",
    "payment=()",
    "usb=()",
    "magnetometer=()",
    "gyroscope=()",
    "accelerometer=()",
    "ambient-light-sensor=()",
    "autoplay=(self)",
    "encrypted-media=(self)",
    "fullscreen=(self)",
    "picture-in-picture=(self)",
  ].join(", "),
};

// Add security headers to response
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set(
    "X-Content-Type-Options",
    securityHeaders.xContentTypeOptions
  );
  response.headers.set("X-Frame-Options", securityHeaders.xFrameOptions);
  response.headers.set("Referrer-Policy", securityHeaders.referrerPolicy);
  response.headers.set("Permissions-Policy", securityHeaders.permissionsPolicy);

  return response;
}

// Validate origin for API routes
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    // No origin header (same-origin request)
    return true;
  }

  return corsConfig.allowedOrigins.includes(origin);
}

// Rate limiting utility (basic implementation)
export const rateLimitConfig = {
  // Basic rate limiting configuration
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // Maximum requests per window
  message: "Too many requests from this IP, please try again later.",
};

// Simple in-memory rate limiter (for development)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  resetTime?: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + rateLimitConfig.windowMs,
    });
    return { allowed: true };
  }

  if (record.count >= rateLimitConfig.maxRequests) {
    return { allowed: false, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true };
}
