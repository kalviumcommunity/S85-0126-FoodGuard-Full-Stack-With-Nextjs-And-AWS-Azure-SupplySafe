import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

// AWS Secrets Manager configuration
const secretsManagerClient = new SecretsManagerClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Secret name in AWS Secrets Manager
const SECRET_NAME = process.env.AWS_SECRET_NAME || "foodguard/app-secrets";

// Cache secrets to avoid repeated API calls
let secretsCache: Record<string, string> | null = null;
let cacheExpiry: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches secrets from AWS Secrets Manager
 * @returns Promise<Record<string, string>> - Key-value pairs of secrets
 */
export async function getSecrets(): Promise<Record<string, string>> {
  // Check cache first
  if (secretsCache && Date.now() < cacheExpiry) {
    // eslint-disable-next-line no-console
    console.log("🔐 Using cached secrets");
    return secretsCache;
  }

  try {
    // eslint-disable-next-line no-console
    console.log("🔐 Fetching secrets from AWS Secrets Manager...");

    const command = new GetSecretValueCommand({
      SecretId: SECRET_NAME,
    });

    const response = await secretsManagerClient.send(command);

    if (!response.SecretString) {
      throw new Error("Secret string is empty");
    }

    // Parse the secret JSON
    const secrets = JSON.parse(response.SecretString);

    // Cache the secrets
    secretsCache = secrets;
    cacheExpiry = Date.now() + CACHE_TTL;

    // eslint-disable-next-line no-console
    console.log("✅ Successfully retrieved secrets:", Object.keys(secrets));

    return secrets;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("❌ Error fetching secrets from AWS Secrets Manager:", error);

    // Fallback to environment variables for development
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("🔄 Falling back to environment variables for development");
      return getEnvironmentSecrets();
    }

    throw new Error("Failed to retrieve secrets from AWS Secrets Manager");
  }
}

/**
 * Fallback function to get secrets from environment variables
 * Used in development or when AWS Secrets Manager is unavailable
 */
function getEnvironmentSecrets(): Record<string, string> {
  const envSecrets: Record<string, string> = {
    // Database
    DATABASE_URL: process.env.DATABASE_URL || "",

    // JWT
    JWT_SECRET: process.env.JWT_SECRET || "",
    REFRESH_SECRET: process.env.REFRESH_SECRET || "",

    // Session
    SESSION_SECRET: process.env.SESSION_SECRET || "",

    // AWS Services
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || "",

    // Azure Services
    AZURE_STORAGE_CONNECTION_STRING:
      process.env.AZURE_STORAGE_CONNECTION_STRING || "",
    AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME || "",
    AZURE_STORAGE_CONTAINER_NAME:
      process.env.AZURE_STORAGE_CONTAINER_NAME || "",

    // External Services
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || "",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",

    // Redis
    REDIS_URL: process.env.REDIS_URL || "",

    // Public variables (not secrets but included for completeness)
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  };

  // Filter out empty values
  const filteredSecrets: Record<string, string> = {};
  Object.entries(envSecrets).forEach(([key, value]) => {
    if (value) {
      filteredSecrets[key] = value;
    }
  });

  return filteredSecrets;
}

/**
 * Get a specific secret by key
 * @param key - The secret key to retrieve
 * @returns Promise<string | undefined> - The secret value or undefined
 */
export async function getSecret(key: string): Promise<string | undefined> {
  const secrets = await getSecrets();
  return secrets[key];
}

/**
 * Initialize secrets and validate required secrets are present
 * @returns Promise<boolean> - True if initialization successful
 */
export async function initializeSecrets(): Promise<boolean> {
  try {
    const secrets = await getSecrets();

    // Validate required secrets
    const requiredSecrets = ["DATABASE_URL", "JWT_SECRET", "SESSION_SECRET"];

    const missingSecrets = requiredSecrets.filter((secret) => !secrets[secret]);

    if (missingSecrets.length > 0) {
      // eslint-disable-next-line no-console
      console.error("❌ Missing required secrets:", missingSecrets);
      return false;
    }

    // eslint-disable-next-line no-console
    console.log("✅ Secrets initialized successfully");
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("❌ Failed to initialize secrets:", error);
    return false;
  }
}

/**
 * Clear the secrets cache
 * Useful for testing or when secrets are updated
 */
export function clearSecretsCache(): void {
  secretsCache = null;
  cacheExpiry = 0;
  // eslint-disable-next-line no-console
  console.log("🗑️ Secrets cache cleared");
}

/**
 * Get secrets status and health check
 * @returns Promise<object> - Status information
 */
export async function getSecretsStatus(): Promise<{
  status: "healthy" | "degraded" | "error";
  source: "aws" | "environment" | "error";
  secretCount: number;
  lastUpdated: number;
  message: string;
}> {
  try {
    const secrets = await getSecrets();
    const secretCount = Object.keys(secrets).length;
    const source = secretsCache ? "aws" : "environment";

    if (secretCount === 0) {
      return {
        status: "error",
        source: "error",
        secretCount: 0,
        lastUpdated: 0,
        message: "No secrets available",
      };
    }

    if (secretCount < 5) {
      return {
        status: "degraded",
        source,
        secretCount,
        lastUpdated: cacheExpiry,
        message: "Limited secrets available",
      };
    }

    return {
      status: "healthy",
      source,
      secretCount,
      lastUpdated: cacheExpiry,
      message: "All secrets available",
    };
  } catch (error) {
    return {
      status: "error",
      source: "error",
      secretCount: 0,
      lastUpdated: 0,
      message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
