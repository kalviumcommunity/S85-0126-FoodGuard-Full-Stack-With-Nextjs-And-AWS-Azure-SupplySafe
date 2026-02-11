import * as jose from "jose";

// JWT Configuration - using environment variables directly
const JWT_SECRET =
  process.env.JWT_SECRET || "super_secure_secret_min_32_characters_long";
const REFRESH_SECRET =
  process.env.REFRESH_SECRET ||
  "super_secure_refresh_secret_min_32_characters_long";

// Token expiration times
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: "15m", // 15 minutes
  REFRESH_TOKEN: "7d", // 7 days
};

// Token types
export type TokenType = "access" | "refresh";

// JWT Payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  type: TokenType;
  iat?: number;
  exp?: number;
}

// Generate JWT token
export async function generateToken(
  payload: Omit<JWTPayload, "type" | "iat" | "exp">,
  type: TokenType
): Promise<string> {
  const secret = type === "access" ? JWT_SECRET : REFRESH_SECRET;
  const expiration =
    type === "access" ? TOKEN_EXPIRY.ACCESS_TOKEN : TOKEN_EXPIRY.REFRESH_TOKEN;

  const secretKey = new TextEncoder().encode(secret);

  return await new jose.SignJWT({ ...payload, type })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(secretKey);
}

// Verify JWT token
export async function verifyToken(
  token: string,
  type: TokenType = "access"
): Promise<JWTPayload> {
  const secret = type === "access" ? JWT_SECRET : REFRESH_SECRET;
  const secretKey = new TextEncoder().encode(secret);

  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload as unknown as JWTPayload;
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      throw new Error("Token expired");
    } else if (error instanceof jose.errors.JWTInvalid) {
      throw new Error("Invalid token");
    }
    throw new Error("Token verification failed");
  }
}

// Generate access and refresh tokens
export async function generateTokenPair(
  payload: Omit<JWTPayload, "type" | "iat" | "exp">
) {
  const [accessToken, refreshToken] = await Promise.all([
    generateToken(payload, "access"),
    generateToken(payload, "refresh"),
  ]);

  return {
    accessToken,
    refreshToken,
    expiresIn: TOKEN_EXPIRY.ACCESS_TOKEN,
  };
}

// Decode token without verification (for debugging)
export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload as JWTPayload;
  } catch {
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  return Date.now() >= decoded.exp * 1000;
}

// Get time until token expires (in seconds)
export function getTokenExpiresIn(token: string): number {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;

  return Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
}
