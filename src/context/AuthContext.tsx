"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: (router?: any) => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error);
        setUser(null);
        setSupabaseUser(null);
      } else if (session?.user) {
        const userObj = {
          id: session.user.id,
          email: session.user.email || "",
          name:
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "",
          role: session.user.user_metadata?.role || "USER",
        };
        setUser(userObj);
        setSupabaseUser(session.user);
      } else {
        setUser(null);
        setSupabaseUser(null);
      }
      setIsLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userObj = {
          id: session.user.id,
          email: session.user.email || "",
          name:
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "",
          role: session.user.user_metadata?.role || "USER",
        };
        setUser(userObj);
        setSupabaseUser(session.user);
      } else {
        setUser(null);
        setSupabaseUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        const userObj = {
          id: data.user.id,
          email: data.user.email || "",
          name:
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            "",
          role: data.user.user_metadata?.role || "USER",
        };
        setUser(userObj);
        setSupabaseUser(data.user);
        return { success: true, message: "Login successful" };
      }

      return { success: false, message: "Login failed" };
    } catch (error) {
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const logout = async (router?: any): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setSupabaseUser(null);
      if (router) {
        router.push("/login");
      }
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        await logout();
        return false;
      }

      if (data.session) {
        const userObj = {
          id: data.session.user.id,
          email: data.session.user.email || "",
          name:
            data.session.user.user_metadata?.name ||
            data.session.user.email?.split("@")[0] ||
            "",
          role: data.session.user.user_metadata?.role || "USER",
        };
        setUser(userObj);
        setSupabaseUser(data.session.user);
        return true;
      }

      await logout();
      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      await logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, supabaseUser, isLoading, login, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthenticatedFetch() {
  const { refreshToken } = useAuth();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          return fetch(url, {
            ...options,
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...options.headers,
            },
          });
        }
      }

      return response;
    } catch (error) {
      console.error("Authenticated fetch error:", error);
      throw error;
    }
  };

  return { fetchWithAuth };
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
