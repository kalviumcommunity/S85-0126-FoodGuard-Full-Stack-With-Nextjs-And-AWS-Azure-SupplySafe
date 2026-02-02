"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Key,
  Cloud,
  Database,
  Lock,
} from "lucide-react";

interface SecretStatus {
  status: "healthy" | "degraded" | "error";
  source: "aws" | "environment" | "error";
  secretCount: number;
  lastUpdated: number;
  message: string;
}

interface SecretInfo {
  key: string;
  value: string;
  isMasked: boolean;
  category: "database" | "auth" | "cloud" | "external" | "public";
}

export default function SecretsTestPage() {
  const [secrets, setSecrets] = useState<SecretInfo[]>([]);
  const [status, setStatus] = useState<SecretStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showValues, setShowValues] = useState(false);

  const categorizeSecret = (
    key: string
  ): "database" | "auth" | "cloud" | "external" | "public" => {
    if (key.includes("DATABASE") || key.includes("REDIS")) return "database";
    if (key.includes("JWT") || key.includes("SESSION")) return "auth";
    if (key.includes("AWS") || key.includes("AZURE")) return "cloud";
    if (key.includes("SENDGRID") || key.includes("STRIPE")) return "external";
    return "public";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      database: "bg-blue-100 text-blue-800",
      auth: "bg-red-100 text-red-800",
      cloud: "bg-green-100 text-green-800",
      external: "bg-purple-100 text-purple-800",
      public: "bg-gray-100 text-gray-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      database: Database,
      auth: Lock,
      cloud: Cloud,
      external: Key,
      public: Eye,
    };
    return icons[category as keyof typeof icons] || Key;
  };

  const maskValue = (value: string): string => {
    if (!value) return "";
    if (value.length <= 8) return "*".repeat(value.length);
    return (
      value.substring(0, 4) +
      "*".repeat(value.length - 8) +
      value.substring(value.length - 4)
    );
  };

  const testSecrets = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test secrets status
      const statusResponse = await fetch("/api/secrets/status");
      const statusData = await statusResponse.json();
      setStatus(statusData);

      // Test secrets retrieval
      const secretsResponse = await fetch("/api/secrets/list");
      const secretsData = await secretsResponse.json();

      if (secretsData.secrets) {
        const formattedSecrets = Object.entries(secretsData.secrets).map(
          ([key, value]) => ({
            key,
            value: value as string,
            isMasked: true,
            category: categorizeSecret(key),
          })
        );
        setSecrets(formattedSecrets);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleSecretVisibility = (index: number) => {
    setSecrets((prev) =>
      prev.map((secret, i) =>
        i === index ? { ...secret, isMasked: !secret.isMasked } : secret
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: "default",
      degraded: "secondary",
      error: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  useEffect(() => {
    testSecrets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span>Cloud Secrets Manager Test</span>
          </h1>
          <p className="text-gray-600">
            Verify AWS Secrets Manager integration and secure secret retrieval
          </p>
        </div>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5" />
              <span>Secrets Test Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button
                onClick={testSecrets}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Test Secrets</span>
              </Button>
              <Button
                onClick={() => setShowValues(!showValues)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                {showValues ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>{showValues ? "Hide Values" : "Show Values"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Overview */}
        {status && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cloud className="w-5 h-5" />
                <span>Secrets Manager Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(status.status)}
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="text-sm text-gray-600">
                      {getStatusBadge(status.status)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Source</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {status.source}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Secrets Count</p>
                    <p className="text-sm text-gray-600">
                      {status.secretCount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{status.message}</p>
                {status.lastUpdated > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated:{" "}
                    {new Date(status.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-600">
              Error: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Secrets List */}
        {secrets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Retrieved Secrets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {secrets.map((secret, index) => {
                  const CategoryIcon = getCategoryIcon(secret.category);
                  return (
                    <div key={secret.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="w-4 h-4" />
                          <h3 className="font-medium">{secret.key}</h3>
                          <Badge className={getCategoryColor(secret.category)}>
                            {secret.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSecretVisibility(index)}
                        >
                          {secret.isMasked ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      <div className="bg-gray-50 rounded p-2">
                        <code className="text-xs break-all font-mono">
                          {showValues || !secret.isMasked
                            ? secret.value
                            : maskValue(secret.value)}
                        </code>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">AWS Secrets Manager Setup:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>
                    Create a secret in AWS Secrets Manager named
                    "foodguard/app-secrets"
                  </li>
                  <li>Add your environment variables as key-value pairs</li>
                  <li>
                    Set AWS_SECRET_NAME environment variable if using a
                    different name
                  </li>
                  <li>
                    Ensure AWS credentials have permissions to read the secret
                  </li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-2">
                  Required Environment Variables:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>AWS_REGION - AWS region (default: us-east-1)</li>
                  <li>AWS_ACCESS_KEY_ID - AWS access key</li>
                  <li>AWS_SECRET_ACCESS_KEY - AWS secret key</li>
                  <li>
                    AWS_SECRET_NAME - Secret name in Secrets Manager (optional)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
