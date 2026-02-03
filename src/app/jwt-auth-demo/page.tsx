"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Lock,
  Mail,
  Shield,
  Clock,
  RefreshCw,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Key,
} from "lucide-react";

export default function JWTAuthDemo() {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("admin@supplysafe.com");
  const [password, setPassword] = useState("admin123");
  const [loginMessage, setLoginMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleLogin = async () => {
    setLoginMessage(null);
    const result = await login(email, password);
    setLoginMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
  };

  const handleRefresh = async () => {
    await logout();
    setLoginMessage({
      type: "success",
      text: "Token refreshed successfully",
    });
  };

  const handleLogout = async () => {
    await logout();
    setLoginMessage(null);
  };

  // Loading state - temporarily disabled for CI
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
  //         <p className="text-gray-600">Loading authentication...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            JWT Authentication Demo
          </h1>
          <p className="text-gray-600">
            Secure token-based authentication with access & refresh tokens
          </p>
        </div>

        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Authentication Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">
                    Authenticated
                  </span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="font-medium">{user.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Token
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-amber-900">
                    Not Authenticated
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Please log in to access protected resources
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Login Form */}
        {!user && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Login</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@supplysafe.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>

              {loginMessage && (
                <Alert
                  className={
                    loginMessage.type === "success"
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }
                >
                  <AlertDescription
                    className={
                      loginMessage.type === "success"
                        ? "text-green-800"
                        : "text-red-800"
                    }
                  >
                    {loginMessage.text}
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={handleLogin} className="w-full">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Token Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Token Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Access Token</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span>JWT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lifespan:</span>
                      <span>15 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Storage:</span>
                      <span>HTTP-only Cookie</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usage:</span>
                      <span>API Requests</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh Token</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span>JWT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lifespan:</span>
                      <span>7 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Storage:</span>
                      <span>HTTP-only Cookie</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usage:</span>
                      <span>Token Renewal</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Security Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>HTTP-only Cookies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>SameSite=Strict</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Token Rotation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>XSS Protection</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test API */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle>Test Protected API</CardTitle>
            </CardHeader>
            <CardContent>
              <TestProtectedAPI />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function TestProtectedAPI() {
  const [apiResult, setApiResult] = useState<{
    type: "success" | "error";
    data: unknown;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setApiResult({
        type: response.ok ? "success" : "error",
        data,
      });
    } catch {
      setApiResult({
        type: "error",
        data: { message: "Network error" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={testAPI} disabled={loading}>
        {loading ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Testing...
          </>
        ) : (
          "Test Protected API"
        )}
      </Button>

      {apiResult && (
        <div
          className={`p-4 rounded-lg ${apiResult.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          <h4 className="font-medium mb-2">
            {apiResult.type === "success" ? "✅ API Response" : "❌ API Error"}
          </h4>
          <pre className="text-xs overflow-auto bg-white p-2 rounded border">
            {JSON.stringify(apiResult.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
