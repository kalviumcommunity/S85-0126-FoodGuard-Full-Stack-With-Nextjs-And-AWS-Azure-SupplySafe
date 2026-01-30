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
  Copy,
  Eye,
  Lock,
  Globe,
  Code,
} from "lucide-react";

interface SecurityHeader {
  name: string;
  value: string;
  status: "present" | "missing" | "warning";
  description: string;
  importance: "high" | "medium" | "low";
  actualValue?: string;
}

export default function SecurityHeadersTest() {
  const [headers, setHeaders] = useState<SecurityHeader[]>([]);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    pageHeaders?: { [key: string]: string };
    apiHeaders?: { [key: string]: string };
    corsTest?: Array<{
      origin: string;
      corsHeaders?: {
        "Access-Control-Allow-Origin"?: string | null;
        "Access-Control-Allow-Methods"?: string | null;
        "Access-Control-Allow-Headers"?: string | null;
        "Access-Control-Allow-Credentials"?: string | null;
      };
      status: number | string;
      error?: string;
    }>;
    timestamp?: string;
  }>({});

  const expectedHeaders: SecurityHeader[] = [
    {
      name: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
      status: "missing",
      description: "HSTS forces browsers to use HTTPS only",
      importance: "high",
    },
    {
      name: "Content-Security-Policy",
      value: "default-src 'self'...",
      status: "missing",
      description: "CSP prevents XSS attacks by restricting content sources",
      importance: "high",
    },
    {
      name: "X-Frame-Options",
      value: "DENY",
      status: "missing",
      description: "Prevents clickjacking attacks",
      importance: "high",
    },
    {
      name: "X-Content-Type-Options",
      value: "nosniff",
      status: "missing",
      description: "Prevents MIME-type sniffing attacks",
      importance: "medium",
    },
    {
      name: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
      status: "missing",
      description: "Controls how much referrer information is sent",
      importance: "medium",
    },
    {
      name: "Permissions-Policy",
      value: "camera=(), microphone=()...",
      status: "missing",
      description: "Controls browser feature access",
      importance: "medium",
    },
    {
      name: "Cross-Origin-Embedder-Policy",
      value: "require-corp",
      status: "missing",
      description: "Controls cross-origin resource loading",
      importance: "low",
    },
    {
      name: "Cross-Origin-Opener-Policy",
      value: "same-origin",
      status: "missing",
      description: "Controls cross-origin window opening",
      importance: "low",
    },
  ];

  const testSecurityHeaders = async () => {
    setLoading(true);

    try {
      // Test main page headers
      const response = await fetch(window.location.href);
      const responseHeaders: { [key: string]: string } = {};

      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Test API headers
      const apiResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@test.com", password: "test" }),
      });

      const apiHeaders: { [key: string]: string } = {};
      apiResponse.headers.forEach((value, key) => {
        apiHeaders[key] = value;
      });

      // Analyze headers
      const analyzedHeaders = expectedHeaders.map((header) => {
        const headerValue = responseHeaders[header.name];
        let status: "present" | "missing" | "warning" = "missing";
        let actualValue = "";

        if (headerValue) {
          status = "present";
          actualValue = headerValue;

          // Check for specific values or patterns
          if (header.name === "Content-Security-Policy") {
            if (
              !headerValue.includes("default-src") ||
              !headerValue.includes("script-src")
            ) {
              status = "warning";
            }
          }
        }

        return {
          ...header,
          status,
          actualValue,
        };
      });

      setHeaders(analyzedHeaders);
      setTestResults({
        pageHeaders: responseHeaders,
        apiHeaders: apiHeaders,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error testing security headers:", error);
    } finally {
      setLoading(false);
    }
  };

  const testCORS = async () => {
    try {
      // Test CORS with different origins
      const testOrigins = [
        "http://localhost:3000",
        "https://malicious-site.com",
        "http://127.0.0.1:3000",
      ];

      const corsResults = await Promise.all(
        testOrigins.map(async (origin) => {
          try {
            const response = await fetch("/api/auth/login", {
              method: "OPTIONS",
              headers: { Origin: origin },
            });

            const corsHeaders = {
              "Access-Control-Allow-Origin": response.headers.get(
                "Access-Control-Allow-Origin"
              ),
              "Access-Control-Allow-Methods": response.headers.get(
                "Access-Control-Allow-Methods"
              ),
              "Access-Control-Allow-Headers": response.headers.get(
                "Access-Control-Allow-Headers"
              ),
              "Access-Control-Allow-Credentials": response.headers.get(
                "Access-Control-Allow-Credentials"
              ),
            };

            return { origin, corsHeaders, status: response.status };
          } catch (error) {
            return { origin, error: (error as Error).message, status: "error" };
          }
        })
      );

      setTestResults((prev) => ({ ...prev, corsTest: corsResults }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error testing CORS:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "missing":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getImportanceBadge = (importance: string) => {
    const variants = {
      high: "destructive",
      medium: "secondary",
      low: "outline",
    } as const;

    return (
      <Badge variant={variants[importance as keyof typeof variants]}>
        {importance}
      </Badge>
    );
  };

  useEffect(() => {
    testSecurityHeaders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span>Security Headers Test</span>
          </h1>
          <p className="text-gray-600">
            Verify HTTPS enforcement and security headers configuration
          </p>
        </div>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5" />
              <span>Security Tests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button
                onClick={testSecurityHeaders}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Test Headers</span>
              </Button>
              <Button
                onClick={testCORS}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Globe className="w-4 h-4" />
                <span>Test CORS</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Headers Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Security Headers Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {headers.map((header, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(header.status)}
                      <h3 className="font-medium">{header.name}</h3>
                      {getImportanceBadge(header.importance)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(header.actualValue || header.value)
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {header.description}
                  </p>

                  {header.actualValue && (
                    <div className="bg-gray-50 rounded p-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <Code className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          Actual Value:
                        </span>
                      </div>
                      <code className="text-xs break-all">
                        {header.actualValue}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CORS Test Results */}
        {testResults.corsTest && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>CORS Test Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.corsTest?.map((result, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Origin: {result.origin}</h3>
                      <Badge
                        variant={
                          result.status === 200 ? "default" : "destructive"
                        }
                      >
                        {result.status}
                      </Badge>
                    </div>

                    {result.corsHeaders && (
                      <div className="space-y-2">
                        {Object.entries(result.corsHeaders).map(
                          ([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="font-medium">{key}:</span>
                              <span className="ml-2 text-gray-600">
                                {String(value || "Not set")}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {result.error && (
                      <Alert>
                        <AlertDescription className="text-red-600">
                          Error: {result.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Raw Headers */}
        {testResults.pageHeaders && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Raw Response Headers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded p-4">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(testResults.pageHeaders, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
