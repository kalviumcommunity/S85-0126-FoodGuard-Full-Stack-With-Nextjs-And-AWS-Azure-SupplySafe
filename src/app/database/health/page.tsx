"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Database,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface DatabaseHealth {
  success: boolean;
  timestamp: string;
  latency?: number;
  error?: string;
  details?: {
    prismaConnection: boolean;
    directConnection: boolean;
    serverTime?: string;
    version?: string;
  };
}

interface ConnectionTest {
  success: boolean;
  message: string;
}

export default function DatabaseHealthPage() {
  const [health, setHealth] = useState<DatabaseHealth | null>(null);
  const [testResult, setTestResult] = useState<ConnectionTest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/database/health");
      const result = await response.json();
      setHealth(result);
    } catch (error) {
      toast.error("Failed to fetch database health");
      console.error("Health check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsTestLoading(true);
    try {
      const response = await fetch("/api/database/health", { method: "POST" });
      const result = await response.json();
      setTestResult(result);

      if (result.success) {
        toast.success("Connection test successful");
      } else {
        toast.error("Connection test failed");
      }
    } catch (error) {
      toast.error("Failed to test connection");
      console.error("Connection test error:", error);
    } finally {
      setIsTestLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchHealth, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge variant="default" className="bg-green-500">
        Connected
      </Badge>
    ) : (
      <Badge variant="destructive">Disconnected</Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Database Health Monitor
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor your managed PostgreSQL database connection and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`}
            />
            Auto Refresh
          </Button>
          <Button
            onClick={fetchHealth}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Connection Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Status
            </CardTitle>
            {health ? (
              getStatusIcon(health.success)
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {health ? (
                getStatusBadge(health.success)
              ) : (
                <Badge variant="outline">Checking...</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Database connection status
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latency</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {health?.latency ? `${health.latency}ms` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Check</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {health
                ? new Date(health.timestamp).toLocaleTimeString()
                : "Never"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last health check
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Connection Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connection Details</CardTitle>
            <CardDescription>
              Detailed information about database connections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {health?.details ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Prisma Connection</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(health.details.prismaConnection)}
                    <span className="text-sm">
                      {health.details.prismaConnection
                        ? "Connected"
                        : "Disconnected"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Direct Connection</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(health.details.directConnection)}
                    <span className="text-sm">
                      {health.details.directConnection
                        ? "Connected"
                        : "Disconnected"}
                    </span>
                  </div>
                </div>
                {health.details.serverTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Server Time</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(health.details.serverTime).toLocaleString()}
                    </span>
                  </div>
                )}
                {health.details.version && (
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium">
                      PostgreSQL Version
                    </span>
                    <span className="text-sm text-muted-foreground text-right max-w-xs">
                      {health.details.version}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No connection details available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connection Test</CardTitle>
            <CardDescription>
              Run a comprehensive connection test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={testConnection}
              disabled={isTestLoading}
              className="w-full"
            >
              {isTestLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Test Database Connection
                </>
              )}
            </Button>

            {testResult && (
              <div
                className={`p-4 rounded-lg ${testResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(testResult.success)}
                  <span className="font-medium">
                    {testResult.success
                      ? "Connection Successful"
                      : "Connection Failed"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {testResult.message}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error Information */}
      {health?.error && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-800">{health.error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>
            How to configure your managed PostgreSQL database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">AWS RDS Setup</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Create RDS PostgreSQL instance</li>
                <li>Configure security groups</li>
                <li>Update DATABASE_URL in .env.local</li>
                <li>Test connection using this page</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">Azure PostgreSQL Setup</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Create Azure PostgreSQL server</li>
                <li>Configure firewall rules</li>
                <li>Update DATABASE_URL in .env.local</li>
                <li>Test connection using this page</li>
              </ol>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Check the README.md for detailed setup
              instructions and troubleshooting guides.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
