"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { ComplaintsPageSkeleton } from "@/components/ui/skeleton";
import {
  ErrorCard,
  NetworkError,
  DataLoadError,
} from "@/components/ui/error-boundary";
import { AlertTriangle, Loader2, Bug } from "lucide-react";

export default function ErrorLoadingDemo() {
  const [showLoading, setShowLoading] = useState<
    "dashboard" | "complaints" | null
  >(null);
  const [showError, setShowError] = useState<
    "network" | "data" | "custom" | null
  >(null);

  const simulateSlowLoad = (type: "dashboard" | "complaints") => {
    setShowLoading(type);
    setTimeout(() => {
      setShowLoading(null);
    }, 3000);
  };

  const simulateError = (type: "network" | "data" | "custom") => {
    setShowError(type);
    setTimeout(() => {
      setShowError(null);
    }, 5000);
  };

  if (showLoading === "dashboard") {
    return <DashboardSkeleton />;
  }

  if (showLoading === "complaints") {
    return <ComplaintsPageSkeleton />;
  }

  return (
    <AppShell>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Loading & Error States Demo
          </h1>
          <p className="text-gray-600">
            Test different loading skeletons and error fallbacks
          </p>
        </div>

        {/* Loading States */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5" />
              <span>Loading States</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Dashboard Loading</h3>
                <p className="text-sm text-gray-600">
                  Shows skeleton UI for dashboard metrics and charts
                </p>
                <Button
                  onClick={() => simulateSlowLoad("dashboard")}
                  disabled={showLoading !== null}
                  className="w-full"
                >
                  {showLoading === "dashboard" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading Dashboard...
                    </>
                  ) : (
                    "Test Dashboard Loading"
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">
                  Complaints Loading
                </h3>
                <p className="text-sm text-gray-600">
                  Shows skeleton UI for complaints table and filters
                </p>
                <Button
                  onClick={() => simulateSlowLoad("complaints")}
                  disabled={showLoading !== null}
                  className="w-full"
                >
                  {showLoading === "complaints" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading Complaints...
                    </>
                  ) : (
                    "Test Complaints Loading"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error States */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bug className="w-5 h-5" />
              <span>Error States</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Network Error</h3>
                  <p className="text-sm text-gray-600">
                    Simulates connection issues
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => simulateError("network")}
                    disabled={showError !== null}
                    className="w-full"
                  >
                    Test Network Error
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Data Load Error</h3>
                  <p className="text-sm text-gray-600">Simulates API failure</p>
                  <Button
                    variant="outline"
                    onClick={() => simulateError("data")}
                    disabled={showError !== null}
                    className="w-full"
                  >
                    Test Data Error
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Custom Error</h3>
                  <p className="text-sm text-gray-600">Custom error message</p>
                  <Button
                    variant="outline"
                    onClick={() => simulateError("custom")}
                    disabled={showError !== null}
                    className="w-full"
                  >
                    Test Custom Error
                  </Button>
                </div>
              </div>

              {/* Error Display */}
              {showError && (
                <div className="mt-6">
                  {showError === "network" && (
                    <NetworkError onRetry={() => setShowError(null)} />
                  )}
                  {showError === "data" && (
                    <DataLoadError onRetry={() => setShowError(null)} />
                  )}
                  {showError === "custom" && (
                    <ErrorCard
                      title="Custom Error Occurred"
                      message="This is a custom error message for demonstration purposes."
                      onRetry={() => setShowError(null)}
                      action={{
                        label: "View Details",
                        onClick: () =>
                          alert("Error details would be shown here"),
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium text-blue-900 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>How to Test in Production</span>
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>Loading States:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    Use browser Network throttling (Slow 3G) to see loading
                    states
                  </li>
                  <li>
                    Add artificial delays in API calls with{" "}
                    <code>setTimeout</code>
                  </li>
                  <li>Navigate between routes to see skeleton transitions</li>
                </ul>

                <p className="pt-2">
                  <strong>Error States:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    Simulate network failures by disabling network connection
                  </li>
                  <li>Use invalid API endpoints to trigger 404/500 errors</li>
                  <li>Throw errors in components to test error boundaries</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
