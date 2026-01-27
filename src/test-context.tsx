"use client";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";

export default function TestContext() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUI();

  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="font-bold mb-2">Context Test Results:</h3>

      <div className="mb-2">
        <strong>Auth Status:</strong>{" "}
        {isAuthenticated ? `Logged in as ${user}` : "Not logged in"}
      </div>

      <div className="mb-2">
        <strong>Theme:</strong> {theme}
      </div>

      <div className="mb-2">
        <strong>Sidebar:</strong> {sidebarOpen ? "Open" : "Closed"}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => login("TestUser")}
          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
        >
          Test Login
        </button>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
        >
          Test Logout
        </button>
        <button
          onClick={toggleTheme}
          className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
        >
          Toggle Theme
        </button>
        <button
          onClick={toggleSidebar}
          className="bg-yellow-500 text-black px-2 py-1 rounded text-sm"
        >
          Toggle Sidebar
        </button>
      </div>
    </div>
  );
}
