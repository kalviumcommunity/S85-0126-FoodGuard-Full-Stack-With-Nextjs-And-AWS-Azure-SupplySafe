"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";
import TestContext from "@/test-context";

export default function Home() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUI();

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">SupplySafe</h1>
          <p className="text-xl">Food Supply Chain Management System</p>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Context & Hooks Demo</h2>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Auth State</h3>
            {isAuthenticated ? (
              <>
                <p>Logged in as: {user}</p>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => login("SupplySafeUser")}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Login
              </button>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">UI Controls</h3>
            <p>Current Theme: {theme}</p>
            <button
              onClick={toggleTheme}
              className="bg-blue-500 text-white px-3 py-1 rounded mr-3"
            >
              Toggle Theme
            </button>
            <button
              onClick={toggleSidebar}
              className="bg-yellow-500 text-black px-3 py-1 rounded"
            >
              {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            </button>
          </div>
        </div>

        <TestContext />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link
            href="/"
            className={`${theme === "dark" ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-gray-800"} rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
          >
            <h2 className="text-2xl font-semibold mb-2">Home</h2>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
              Main landing page
            </p>
          </Link>

          <Link
            href="/about"
            className={`${theme === "dark" ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-gray-800"} rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
          >
            <h2 className="text-2xl font-semibold mb-2">About</h2>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
              Learn about our team and mission
            </p>
          </Link>

          <Link
            href="/dashboard"
            className={`${theme === "dark" ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-gray-800"} rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
          >
            <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
              View real-time metrics and analytics
            </p>
          </Link>

          <Link
            href="/news"
            className={`${theme === "dark" ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-gray-800"} rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
          >
            <h2 className="text-2xl font-semibold mb-2">News</h2>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
              Latest updates and announcements
            </p>
          </Link>

          <Link
            href="/api"
            className={`${theme === "dark" ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-gray-800"} rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
          >
            <h2 className="text-2xl font-semibold mb-2">API</h2>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
              API endpoints and documentation
            </p>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            Navigate to different routes to explore the application
          </p>
        </div>
      </div>
    </div>
  );
}
