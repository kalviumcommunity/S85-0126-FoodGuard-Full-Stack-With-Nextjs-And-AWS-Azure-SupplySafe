"use client";

import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UIProvider>{children}</UIProvider>
    </AuthProvider>
  );
}
