"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import TestContext from "@/test-context";
import { useUI } from "@/hooks/useUI";

export default function Home() {
  const { theme } = useUI();

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SupplySafe</h1>
          <p className="text-xl text-gray-600">
            Food Supply Chain Management System
          </p>
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Dashboard
            </h2>
            <p className="text-gray-600">
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
      </div>

      {/* CTA Section */}
      <div className="bg-[#0F2A44] text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Access the DFTS Dashboard
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Monitor real-time food safety, hygiene compliance, and
              traceability across the entire Indian Railway catering network.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-[#1E7F5C] hover:bg-[#1a6f4c] text-white"
                >
                  Open Dashboard
                </Button>
              </Link>
              <Link href="/traceability">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#0F2A44]"
                >
                  View Traceability
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
