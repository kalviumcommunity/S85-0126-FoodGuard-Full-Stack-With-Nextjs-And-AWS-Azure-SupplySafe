import { createClient } from "@supabase/supabase-js";

// Custom Auth System - Database only, no Auth
const supabaseDB = createClient(
  "https://mdrqntpedztxxfcxsbxk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnFudHBlZHp0eHhmY3hzYnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjYxMDIsImV4cCI6MjA4NjIwMjEwMn0.N9MxcjKxuYho3dGOlMcd0fF3vtjjq-UTYCPwQLJ5hG0",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "SUPPLIER" | "ADMIN";
  createdat: string;
  updatedat: string;
}

export interface AuthUser {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Simple JWT for testing
function generateJWT(payload: any): string {
  return btoa(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    })
  );
}

function verifyJWT(token: string): any {
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

// Hash password - simple MD5-style for testing
async function hashPassword(password: string): Promise<string> {
  // Simple hash for testing - just convert to base64
  return btoa(password + "supplysafe-salt");
}

// Verify password
async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const inputHash = await hashPassword(password);
  console.log("🔍 Password verification:", {
    input: password,
    inputHash,
    storedHash: hashedPassword,
    match: inputHash === hashedPassword,
  });
  return inputHash === hashedPassword;
}

// Generate UUID v4
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Create user
export async function createUser(
  email: string,
  password: string,
  name: string,
  role: "USER" | "SUPPLIER" | "ADMIN" = "USER"
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    console.log("🔍 Checking if user exists:", email);

    // Check if user already exists
    const { data: existingUser } = await supabaseDB
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      console.log("❌ User already exists");
      return { success: false, error: "User already exists" };
    }

    console.log("🔐 Hashing password");
    const hashedPassword = await hashPassword(password);

    console.log("💾 Creating user in database");
    // Create user with hashed password
    const { data, error } = await supabaseDB
      .from("users")
      .insert({
        id: generateUUID(),
        email,
        name,
        role,
        password: hashedPassword,
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
      })
      .select("id, email, name, role, createdat, updatedat")
      .single();

    if (error) {
      console.log("❌ Database error:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ User created successfully");
    return { success: true, user: data };
  } catch (error) {
    console.log("💥 Unexpected error:", error);
    return { success: false, error: "Failed to create user" };
  }
}

// Login user
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User; token?: string }> {
  try {
    console.log("🔍 Looking up user:", email);

    // Get user by email
    const { data: user, error } = await supabaseDB
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      console.log("❌ User not found");
      return { success: false, error: "Invalid credentials" };
    }

    console.log("🔐 Verifying password");
    // Verify password
    const isValidPassword = await verifyPassword(password, user.password || "");
    if (!isValidPassword) {
      console.log("❌ Invalid password");
      return { success: false, error: "Invalid credentials" };
    }

    console.log("🎫 Generating JWT token");
    // Generate JWT token
    const token = generateJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdat: user.createdat,
          updatedat: user.updatedat,
        })
      );
    }

    console.log("✅ Login successful");
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdat: user.createdat,
        updatedat: user.updatedat,
      },
      token,
    };
  } catch (error) {
    console.log("💥 Login error:", error);
    return { success: false, error: "Login failed" };
  }
}

// Get current user
export function getCurrentUser(): AuthUser {
  if (typeof window === "undefined") {
    return { user: null, token: null, isAuthenticated: false };
  }

  const token = localStorage.getItem("auth_token");
  const userStr = localStorage.getItem("auth_user");

  if (!token || !userStr) {
    return { user: null, token: null, isAuthenticated: false };
  }

  try {
    const decoded = verifyJWT(token);
    if (!decoded) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      return { user: null, token: null, isAuthenticated: false };
    }

    const user = JSON.parse(userStr);
    return { user, token, isAuthenticated: true };
  } catch {
    return { user: null, token: null, isAuthenticated: false };
  }
}

// Logout user
export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }
}

// RBAC functions
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = { USER: 1, SUPPLIER: 2, ADMIN: 3 };
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel =
    roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  return userLevel >= requiredLevel;
}

export function canAccess(user: User | null, resource: string): boolean {
  if (!user) return false;

  const permissions = {
    USER: ["dashboard", "profile"],
    SUPPLIER: ["dashboard", "profile", "supplier-panel", "inventory"],
    ADMIN: [
      "dashboard",
      "profile",
      "supplier-panel",
      "inventory",
      "admin-panel",
      "users",
    ],
  };

  return permissions[user.role]?.includes(resource) || false;
}
