import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers configuration
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // HSTS (HTTP Strict Transport Security)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          // Content Security Policy (CSP)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.github.com https://*.amazonaws.com https://*.azure.com https://*.supabase.co",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },

          // X-Frame-Options (Clickjacking protection)
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          // X-Content-Type-Options (MIME sniffing protection)
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // Referrer Policy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // Permissions Policy (formerly Feature Policy)
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
              "magnetometer=()",
              "gyroscope=()",
              "accelerometer=()",
              "autoplay=(self)",
              "encrypted-media=(self)",
              "fullscreen=(self)",
              "picture-in-picture=(self)",
            ].join(", "),
          },

          // Cross-Origin Embedder Policy
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },

          // Cross-Origin Opener Policy
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },

          // Cross-Origin Resource Policy
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
        ],
      },

      // API routes specific headers
      {
        source: "/api/(.*)",
        headers: [
          // API-specific CORS headers
          {
            key: "Access-Control-Allow-Origin",
            value:
              process.env.NODE_ENV === "production"
                ? "https://your-production-domain.com"
                : "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, X-Requested-With, Accept, Origin",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400", // 24 hours
          },

          // API-specific security headers
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },

      // Static assets headers
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // Images and media
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },

  // Redirect HTTP to HTTPS in production
  async redirects() {
    return [
      {
        source: "/((?!api/).*)",
        has: [
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "http",
          },
        ],
        destination: "https://localhost:3000/:splat",
        permanent: true,
      },
    ];
  },

  // Environment-specific configurations
  ...(process.env.NODE_ENV === "production" && {
    // Production-specific optimizations
    compress: true,
    poweredByHeader: false,

    // Remove X-Powered-By header
    experimental: {
      forceSwcTransforms: true,
    },
  }),

  // Development-specific configurations
  ...(process.env.NODE_ENV === "development" && {
    // Development-specific settings
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
  }),
};

export default nextConfig;
