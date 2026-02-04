import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FoodGuard API Documentation",
      version: "1.0.0", // Clearly state the API version
      description:
        "Interactive API documentation for the FoodGuard SupplySafe platform",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Document authentication method
        },
      },
    },
  },
  // Path to the API files where you will add JSDoc comments
  apis: ["./src/pages/api/**/*.ts", "./src/app/api/**/*.ts"],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
