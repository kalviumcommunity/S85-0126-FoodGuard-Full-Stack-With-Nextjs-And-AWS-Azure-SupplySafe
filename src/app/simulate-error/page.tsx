"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Bug } from "lucide-react";

export default function SimulateErrorPage() {
  const [shouldError, setShouldError] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shouldError) {
      throw new Error("This is a simulated error to test the error boundary!");
    }
  }, [shouldError]);

  const fetchData = async () => {
    setLoading(true);
    // Simulate API call that might fail
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate random failure (30% chance)
    if (Math.random() < 0.3) {
      throw new Error("Failed to fetch data from server");
    }

    setData("Data loaded successfully!");
    setLoading(false);
  };

  const triggerError = () => {
    setShouldError(true);
  };

  return (
    <AppShell>
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Error Simulation
          </h1>
          <p className="text-gray-600">
            Test different error scenarios and see how the error boundary
            handles them
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Component Error */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bug className="w-5 h-5" />
                <span>Component Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                This will throw an error in the component, triggering the error
                boundary.
              </p>
              <Button
                onClick={triggerError}
                variant="destructive"
                className="w-full"
                disabled={shouldError}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Trigger Component Error
              </Button>
              <p className="text-xs text-gray-500">
                This will cause the page to show the error boundary UI.
              </p>
            </CardContent>
          </Card>

          {/* Async Error */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Async Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Simulates an async operation that might fail (30% failure rate).
              </p>
              <Button
                onClick={fetchData}
                disabled={loading || shouldError}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Fetching Data...
                  </>
                ) : (
                  "Simulate API Call"
                )}
              </Button>
              {data && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">{data}</p>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Try multiple times - it has a 30% chance of failing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h3 className="font-medium text-amber-900 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Testing Instructions</span>
              </h3>
              <div className="text-sm text-amber-800 space-y-2">
                <p>
                  <strong>What to expect:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    When an error occurs, you'll see the error boundary UI
                    instead of a blank page
                  </li>
                  <li>
                    The error boundary provides options to retry, go back, or
                    return home
                  </li>
                  <li>
                    In development mode, you'll see detailed error information
                  </li>
                  <li>In production, error details are hidden for security</li>
                </ul>

                <p className="pt-2">
                  <strong>To recover:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Click "Try Again" to re-render the component</li>
                  <li>Use "Go Back" to return to the previous page</li>
                  <li>Click "Home" to return to the dashboard</li>
                  <li>Refresh the page to reset the error state</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
