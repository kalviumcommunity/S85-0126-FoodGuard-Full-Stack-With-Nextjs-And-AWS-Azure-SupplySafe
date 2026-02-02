"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getClientTokens, clearClientTokens } from "@/lib/auth-cookies";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const tokens = getClientTokens();
        if (tokens.accessToken) {
          // In a real app, you'd validate the token here
          // For now, we'll assume it's valid if it exists
          const payload = parseJWT(tokens.accessToken);
          if (payload) {
            setUser({
              id: payload.userId,
              email: payload.email,
              name: payload.name,
              role: payload.role,
            });
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Auth check failed:", error);
        clearClientTokens();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Tokens are set in HTTP-only cookies by the server
        // For client-side usage, we'll store them in memory
        setUser(data.data.user);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Login error:", error);
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      clearClientTokens();
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        // New refresh token is set in HTTP-only cookie by the server
        return true;
      } else {
        // Refresh failed, log out user
        await logout();
        return false;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Token refresh error:", error);
      await logout();
      return false;
    }
  };

  // Helper function to parse JWT payload
  const parseJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for authenticated API calls with automatic token refresh
export function useAuthenticatedFetch() {
  const { refreshToken } = useAuth();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      // If unauthorized, try to refresh token
      if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          // Retry the original request
          return fetch(url, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              ...options.headers,
            },
          });
        }
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Authenticated fetch error:", error);
      throw error;
    }
  };

  return { fetchWithAuth };
}

// Legacy export for backward compatibility
export function useAuthContext() {
  return useAuth();
}
