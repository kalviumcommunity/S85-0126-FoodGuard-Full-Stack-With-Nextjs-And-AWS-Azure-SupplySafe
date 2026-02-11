"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
      <Header sidebarCollapsed={sidebarCollapsed} />

      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
