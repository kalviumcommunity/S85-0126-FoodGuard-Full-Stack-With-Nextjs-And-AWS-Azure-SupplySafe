import { sendSuccess } from "@/lib/responseHandler";

export async function GET() {
  const apiInfo = {
    name: "FoodGuard API",
    version: "1.0.0",
    description: "Unified API for Food Supply Chain Management",
    documentation: "/api",

    endpoints: {
      users: {
        base: "/api/users",
        methods: {
          GET: {
            description: "Fetch all users",
            response: "Array of users",
          },
          POST: {
            description: "Create a new user",
            body: {
              name: "string (required)",
              email: "string (required)",
              password: "string (required)",
              role: "USER | SUPPLIER | ADMIN (optional, default: USER)",
            },
          },
        },
        byId: {
          GET: {
            path: "/api/users/:id",
            description: "Get user by ID",
          },
          PUT: {
            path: "/api/users/:id",
            description: "Update user by ID",
            body: {
              name: "string (optional)",
              email: "string (optional)",
              role: "string (optional)",
            },
          },
          DELETE: {
            path: "/api/users/:id",
            description: "Delete user by ID",
          },
        },
      },

      products: {
        base: "/api/products",
        methods: {
          GET: {
            description: "Fetch all products",
            queryParams: {
              category: "string (optional)",
              inStock: "true | false (optional)",
              supplierId: "string (optional)",
            },
          },
          POST: {
            description: "Create a new product",
            body: {
              name: "string (required)",
              price: "number (required)",
              unit: "string (required)",
              supplierId: "string (required)",
              description: "string (optional)",
              category: "string (optional)",
              imageUrl: "string (optional)",
              inStock: "boolean (optional, default: true)",
            },
          },
        },
      },

      orders: {
        base: "/api/orders",
        methods: {
          GET: {
            description: "Fetch orders for a user",
            queryParams: {
              userId: "string (required)",
              status:
                "PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED (optional)",
            },
          },
          POST: {
            description: "Create a new order",
            body: {
              userId: "string (required)",
              items: "array of { productId, quantity } (required)",
              deliveryDate: "ISO date string (optional)",
              notes: "string (optional)",
            },
          },
        },
      },

      suppliers: {
        base: "/api/suppliers",
        methods: {
          GET: {
            description: "Fetch all suppliers",
            queryParams: {
              verified: "true | false (optional)",
            },
          },
          POST: {
            description: "Create a new supplier",
            body: {
              name: "string (required)",
              email: "string (required)",
              userId: "string (required)",
              phone: "string (optional)",
              address: "string (optional)",
              description: "string (optional)",
            },
          },
        },
      },

      upload: {
        base: "/api/upload",
        methods: {
          POST: {
            description:
              "Generate a signed upload URL for Supabase Storage (direct client upload)",
            body: {
              fileName: "string (required)",
              fileType: "image/png | image/jpeg | application/pdf",
              fileSize: "number (bytes)",
            },
            response: {
              uploadURL: "signed URL (expires in short time)",
              path: "storage file path",
            },
          },
        },
      },

      files: {
        base: "/api/files",
        methods: {
          POST: {
            description: "Store uploaded file metadata in database",
            body: {
              name: "string",
              path: "string",
              size: "number",
              mimeType: "string",
            },
          },
        },
      },
    },

    responseFormat: {
      success: {
        success: true,
        message: "Operation description",
        data: "Response data",
        timestamp: "ISO 8601 timestamp",
      },
      error: {
        success: false,
        message: "Error description",
        error: {
          code: "Error code (E001, E404_USER, etc.)",
          details: "Additional error details (development only)",
        },
        timestamp: "ISO 8601 timestamp",
      },
    },

    errorCodes: {
      E001: "Validation Error",
      E002: "Missing Required Field",
      E003: "Invalid Input",
      E004: "Invalid Email",
      E006: "Invalid Price",
      E007: "Invalid Quantity",
      E404: "Resource Not Found",
      E404_USER: "User Not Found",
      E404_PRODUCT: "Product Not Found",
      E404_ORDER: "Order Not Found",
      E404_SUPPLIER: "Supplier Not Found",
      E401: "Unauthorized",
      E403: "Forbidden",
      E403_SUPPLIER: "Supplier Not Verified",
      E409: "Duplicate Entry",
      E409_EMAIL: "Duplicate Email",
      E400_OUT_STOCK: "Product Out of Stock",
      E503: "Database Error",
      E500: "Internal Server Error",
    },
  };

  return sendSuccess(apiInfo, "FoodGuard API v1.0.0");
}
