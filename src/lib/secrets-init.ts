import { initializeSecrets, getSecret } from "./secrets";

/**
 * Initialize secrets on application startup
 * This should be called early in the application lifecycle
 */
export async function initializeApplicationSecrets(): Promise<void> {
  try {
    // eslint-disable-next-line no-console
    console.log("🔐 Initializing application secrets...");

    const isInitialized = await initializeSecrets();

    if (!isInitialized) {
      // eslint-disable-next-line no-console
      console.warn(
        "⚠️ Secrets initialization failed, but application will continue with fallback"
      );
    }

    // Test critical secrets
    const criticalSecrets = ["DATABASE_URL", "JWT_SECRET"];
    for (const secretKey of criticalSecrets) {
      const secret = await getSecret(secretKey);
      if (!secret) {
        // eslint-disable-next-line no-console
        console.error(`❌ Critical secret missing: ${secretKey}`);
      } else {
        // eslint-disable-next-line no-console
        console.log(`✅ Critical secret available: ${secretKey}`);
      }
    }

    // eslint-disable-next-line no-console
    console.log("🔐 Secrets initialization completed");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("❌ Failed to initialize application secrets:", error);
    // Don't throw error to prevent application crash
    // Application will fallback to environment variables
  }
}

/**
 * Get database URL from secrets
 */
export async function getDatabaseUrl(): Promise<string> {
  return (await getSecret("DATABASE_URL")) || process.env.DATABASE_URL || "";
}

/**
 * Get JWT secrets
 */
export async function getJwtSecret(): Promise<string> {
  return (await getSecret("JWT_SECRET")) || process.env.JWT_SECRET || "";
}

export async function getRefreshSecret(): Promise<string> {
  return (
    (await getSecret("REFRESH_SECRET")) || process.env.REFRESH_SECRET || ""
  );
}

/**
 * Get session secret
 */
export async function getSessionSecret(): Promise<string> {
  return (
    (await getSecret("SESSION_SECRET")) || process.env.SESSION_SECRET || ""
  );
}

/**
 * Get AWS configuration
 */
export async function getAwsConfig(): Promise<{
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  s3Bucket: string;
}> {
  return {
    accessKeyId:
      (await getSecret("AWS_ACCESS_KEY_ID")) ||
      process.env.AWS_ACCESS_KEY_ID ||
      "",
    secretAccessKey:
      (await getSecret("AWS_SECRET_ACCESS_KEY")) ||
      process.env.AWS_SECRET_ACCESS_KEY ||
      "",
    region:
      (await getSecret("AWS_REGION")) || process.env.AWS_REGION || "us-east-1",
    s3Bucket:
      (await getSecret("AWS_S3_BUCKET_NAME")) ||
      process.env.AWS_S3_BUCKET_NAME ||
      "",
  };
}

/**
 * Get Azure configuration
 */
export async function getAzureConfig(): Promise<{
  connectionString: string;
  accountName: string;
  containerName: string;
}> {
  return {
    connectionString:
      (await getSecret("AZURE_STORAGE_CONNECTION_STRING")) ||
      process.env.AZURE_STORAGE_CONNECTION_STRING ||
      "",
    accountName:
      (await getSecret("AZURE_STORAGE_ACCOUNT_NAME")) ||
      process.env.AZURE_STORAGE_ACCOUNT_NAME ||
      "",
    containerName:
      (await getSecret("AZURE_STORAGE_CONTAINER_NAME")) ||
      process.env.AZURE_STORAGE_CONTAINER_NAME ||
      "",
  };
}

/**
 * Get external service configuration
 */
export async function getExternalServicesConfig(): Promise<{
  sendgridApiKey: string;
  stripeSecretKey: string;
  stripePublishableKey: string;
}> {
  return {
    sendgridApiKey:
      (await getSecret("SENDGRID_API_KEY")) ||
      process.env.SENDGRID_API_KEY ||
      "",
    stripeSecretKey:
      (await getSecret("STRIPE_SECRET_KEY")) ||
      process.env.STRIPE_SECRET_KEY ||
      "",
    stripePublishableKey:
      (await getSecret("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")) ||
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      "",
  };
}

/**
 * Get Redis URL
 */
export async function getRedisUrl(): Promise<string> {
  return (await getSecret("REDIS_URL")) || process.env.REDIS_URL || "";
}
