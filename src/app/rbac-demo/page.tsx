"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ProtectedComponent,
  usePermissions,
  PermissionButton,
} from "@/components/rbac/ProtectedComponent";
import { Role, Permission, Resource } from "@/lib/rbac";

export default function RBACDemo() {
  const { user, login, logout } = useAuth();
  const { can, hasRole, isAdmin, isEditor, isViewer } = usePermissions();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 10));
  };

  const testPermission = (permission: Permission, resource?: Resource) => {
    const hasAccess = can(permission, resource);
    const message = `${user?.role} tried ${permission}${resource ? ` on ${resource}` : ""}: ${hasAccess ? "ALLOWED" : "DENIED"}`;
    addLog(message);
    console.log(`[RBAC] ${message}`);
  };

  const mockLogin = async (role: Role) => {
    // Mock login for demonstration
    const mockCredentials = {
      admin: { email: "admin@example.com", password: "admin123" },
      editor: { email: "editor@example.com", password: "editor123" },
      viewer: { email: "viewer@example.com", password: "viewer123" },
    };

    try {
      await login(mockCredentials[role].email, mockCredentials[role].password);
      addLog(`Logged in as ${role}`);
    } catch (error) {
      addLog(`Login failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">RBAC Demo</h1>

        {/* User Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          {user ? (
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {user.role}
                </span>
              </p>
              <button
                onClick={logout}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Not logged in. Test with different roles:
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => mockLogin("admin")}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  Login as Admin
                </button>
                <button
                  onClick={() => mockLogin("editor")}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Login as Editor
                </button>
                <button
                  onClick={() => mockLogin("viewer")}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Login as Viewer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Permission Testing Section */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Permission Testing</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => testPermission("read", "users")}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Read Users
              </button>
              <button
                onClick={() => testPermission("create", "users")}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Create Users
              </button>
              <button
                onClick={() => testPermission("update", "users")}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Update Users
              </button>
              <button
                onClick={() => testPermission("delete", "users")}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Delete Users
              </button>
              <button
                onClick={() => testPermission("read", "products")}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Read Products
              </button>
              <button
                onClick={() => testPermission("create", "products")}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Create Products
              </button>
              <button
                onClick={() => testPermission("update", "products")}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Update Products
              </button>
              <button
                onClick={() => testPermission("delete", "products")}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Delete Products
              </button>
            </div>
          </div>
        )}

        {/* UI Components with Role-Based Rendering */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              UI Components with Role-Based Access
            </h2>

            <div className="space-y-4">
              {/* Admin-only button */}
              <ProtectedComponent requiredRole="admin">
                <div className="p-4 bg-purple-100 rounded">
                  <p className="font-semibold">Admin Only Section</p>
                  <PermissionButton
                    requiredPermission="delete"
                    resource="users"
                    className="mt-2 px-4 py-2 bg-purple-500 text-white rounded"
                  >
                    Delete All Users
                  </PermissionButton>
                </div>
              </ProtectedComponent>

              {/* Editor and Admin section */}
              <ProtectedComponent requiredRole="editor">
                <div className="p-4 bg-blue-100 rounded">
                  <p className="font-semibold">Editor & Admin Section</p>
                  <PermissionButton
                    requiredPermission="update"
                    resource="products"
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Edit Products
                  </PermissionButton>
                </div>
              </ProtectedComponent>

              {/* All authenticated users */}
              <ProtectedComponent
                requiredPermission="read"
                resource="dashboard"
              >
                <div className="p-4 bg-green-100 rounded">
                  <p className="font-semibold">All Authenticated Users</p>
                  <PermissionButton
                    requiredPermission="read"
                    resource="dashboard"
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                  >
                    View Dashboard
                  </PermissionButton>
                </div>
              </ProtectedComponent>

              {/* Fallback example */}
              <ProtectedComponent
                requiredPermission="delete"
                resource="users"
                fallback={
                  <div className="p-4 bg-gray-100 rounded">
                    <p className="text-gray-600">
                      You don't have permission to delete users.
                    </p>
                  </div>
                }
              >
                <div className="p-4 bg-red-100 rounded">
                  <p className="font-semibold">Delete Users Section</p>
                  <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded">
                    Delete Users
                  </button>
                </div>
              </ProtectedComponent>
            </div>
          </div>
        )}

        {/* Access Logs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Access Logs</h2>
          {logs.length > 0 ? (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    log.includes("ALLOWED")
                      ? "bg-green-100 text-green-800"
                      : log.includes("DENIED")
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              No access attempts yet. Try the permission tests above.
            </p>
          )}
        </div>

        {/* Role Permissions Reference */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Role Permissions Reference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded">
              <h3 className="font-semibold text-purple-600 mb-2">Admin</h3>
              <ul className="text-sm space-y-1">
                <li>✓ Read Users</li>
                <li>✓ Create Users</li>
                <li>✓ Update Users</li>
                <li>✓ Delete Users</li>
                <li>✓ Read Products</li>
                <li>✓ Create Products</li>
                <li>✓ Update Products</li>
                <li>✓ Delete Products</li>
              </ul>
            </div>
            <div className="p-4 border rounded">
              <h3 className="font-semibold text-blue-600 mb-2">Editor</h3>
              <ul className="text-sm space-y-1">
                <li>✓ Read Users</li>
                <li>✗ Create Users</li>
                <li>✓ Update Users</li>
                <li>✗ Delete Users</li>
                <li>✓ Read Products</li>
                <li>✓ Create Products</li>
                <li>✓ Update Products</li>
                <li>✗ Delete Products</li>
              </ul>
            </div>
            <div className="p-4 border rounded">
              <h3 className="font-semibold text-green-600 mb-2">Viewer</h3>
              <ul className="text-sm space-y-1">
                <li>✓ Read Users</li>
                <li>✗ Create Users</li>
                <li>✗ Update Users</li>
                <li>✗ Delete Users</li>
                <li>✓ Read Products</li>
                <li>✗ Create Products</li>
                <li>✗ Update Products</li>
                <li>✗ Delete Products</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
