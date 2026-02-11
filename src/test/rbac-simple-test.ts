// Simple RBAC Test File (no testing framework required)
import {
  roles,
  hasPermission,
  hasResourcePermission,
  canPerformAction,
  hasRoleLevel,
  getRolesWithPermission,
  checkPermission,
  logAccessCheck,
  Role,
  Permission,
} from "../lib/rbac";

// Test runner functions
function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    return false;
  } else {
    console.log(`✅ PASSED: ${message}`);
    return true;
  }
}

function runTests() {
  console.log("🧪 Running RBAC Tests...\n");

  let passed = 0;
  let total = 0;

  function test(_description: string, testFn: () => boolean) {
    total++;
    if (testFn()) {
      passed++;
    }
  }

  // Role Configuration Tests
  test("Role Configuration - admin has all permissions", () => {
    return assert(
      JSON.stringify(roles.admin) ===
        JSON.stringify(["create", "read", "update", "delete"]),
      "Admin should have all permissions"
    );
  });

  test("Role Configuration - editor has read and update only", () => {
    return assert(
      JSON.stringify(roles.editor) === JSON.stringify(["read", "update"]),
      "Editor should have read and update permissions only"
    );
  });

  test("Role Configuration - viewer has read only", () => {
    return assert(
      JSON.stringify(roles.viewer) === JSON.stringify(["read"]),
      "Viewer should have read permission only"
    );
  });

  // Permission Tests
  test("Permissions - admin can create", () => {
    return assert(
      hasPermission("admin", "create"),
      "Admin should be able to create"
    );
  });

  test("Permissions - editor cannot delete", () => {
    return assert(
      !hasPermission("editor", "delete"),
      "Editor should not be able to delete"
    );
  });

  test("Permissions - viewer can only read", () => {
    return assert(
      hasPermission("viewer", "read") &&
        !hasPermission("viewer", "create") &&
        !hasPermission("viewer", "update") &&
        !hasPermission("viewer", "delete"),
      "Viewer should only be able to read"
    );
  });

  // Resource-specific Tests
  test("Resource Permissions - admin has all permissions on users", () => {
    return assert(
      hasResourcePermission("admin", "users", "create") &&
        hasResourcePermission("admin", "users", "read") &&
        hasResourcePermission("admin", "users", "update") &&
        hasResourcePermission("admin", "users", "delete"),
      "Admin should have all permissions on users"
    );
  });

  test("Resource Permissions - editor can create products but not users", () => {
    return assert(
      hasResourcePermission("editor", "products", "create") &&
        !hasResourcePermission("editor", "users", "create"),
      "Editor can create products but not users"
    );
  });

  test("Resource Permissions - viewer can read dashboard", () => {
    return assert(
      hasResourcePermission("viewer", "dashboard", "read"),
      "Viewer should be able to read dashboard"
    );
  });

  // Action Permission Tests
  test("Action Permissions - canPerformAction works correctly", () => {
    return assert(
      canPerformAction("admin", "create", "users") &&
        !canPerformAction("viewer", "delete", "users") &&
        canPerformAction("editor", "read", "products"),
      "canPerformAction should work correctly"
    );
  });

  // Role Hierarchy Tests
  test("Role Hierarchy - admin has higher level than editor", () => {
    return assert(
      hasRoleLevel("admin", "editor") && !hasRoleLevel("editor", "admin"),
      "Admin should have higher level than editor"
    );
  });

  test("Role Hierarchy - editor has higher level than viewer", () => {
    return assert(
      hasRoleLevel("editor", "viewer") && !hasRoleLevel("viewer", "editor"),
      "Editor should have higher level than viewer"
    );
  });

  // Utility Function Tests
  test("Utilities - getRolesWithPermission works correctly", () => {
    const createRoles = getRolesWithPermission("create");
    const readRoles = getRolesWithPermission("read");

    return assert(
      JSON.stringify(createRoles) === JSON.stringify(["admin"]) &&
        JSON.stringify(readRoles) ===
          JSON.stringify(["admin", "editor", "viewer"]),
      "getRolesWithPermission should return correct roles"
    );
  });

  test("Utilities - checkPermission utility works correctly", () => {
    const allowed = checkPermission("admin", "read", "users");
    const denied = checkPermission("viewer", "delete", "users");

    return assert(
      allowed.allowed && !denied.allowed && denied.reason,
      "checkPermission utility should work correctly"
    );
  });

  // Audit Logging Tests
  test("Audit Logging - logAccessCheck works", () => {
    // Capture console output
    const originalLog = console.log;
    let logOutput = "";
    console.log = (message: string) => {
      logOutput += message;
    };

    logAccessCheck("user123", "admin", "read", "users", true);

    // Restore console.log
    console.log = originalLog;

    return assert(
      Boolean(
        logOutput.includes("ALLOWED") &&
        logOutput.includes("admin") &&
        logOutput.includes("read")
      ),
      "logAccessCheck should log access correctly"
    );
  });

  // Edge Cases
  test("Edge Cases - handles invalid roles gracefully", () => {
    return assert(
      !hasPermission("invalid" as Role, "read"),
      "Should handle invalid roles gracefully"
    );
  });

  test("Edge Cases - handles invalid permissions gracefully", () => {
    return assert(
      !hasPermission("admin", "invalid" as Permission),
      "Should handle invalid permissions gracefully"
    );
  });

  // Real-world Scenarios
  test("Real-world - User management scenarios", () => {
    const adminCanDoAll =
      canPerformAction("admin", "create", "users") &&
      canPerformAction("admin", "read", "users") &&
      canPerformAction("admin", "update", "users") &&
      canPerformAction("admin", "delete", "users");

    const editorCanReadUpdate =
      !canPerformAction("editor", "create", "users") &&
      canPerformAction("editor", "read", "users") &&
      canPerformAction("editor", "update", "users") &&
      !canPerformAction("editor", "delete", "users");

    const viewerCanOnlyRead =
      !canPerformAction("viewer", "create", "users") &&
      canPerformAction("viewer", "read", "users") &&
      !canPerformAction("viewer", "update", "users") &&
      !canPerformAction("viewer", "delete", "users");

    return assert(
      adminCanDoAll && editorCanReadUpdate && viewerCanOnlyRead,
      "User management scenarios should work correctly"
    );
  });

  // Performance Test
  test("Performance - permission checks are fast", () => {
    const start = performance.now();

    // Perform 1000 permission checks
    for (let i = 0; i < 1000; i++) {
      canPerformAction("admin", "read", "users");
      canPerformAction("editor", "update", "products");
      canPerformAction("viewer", "read", "dashboard");
    }

    const end = performance.now();
    const duration = end - start;

    return assert(
      duration < 10,
      `Permission checks should be fast (took ${duration.toFixed(2)}ms, should be < 10ms)`
    );
  });

  // Results
  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log("🎉 All tests passed!");
  } else {
    console.log(`❌ ${total - passed} tests failed`);
  }

  return passed === total;
}

// Run tests if this file is executed directly
if (typeof require !== "undefined" && require.main === module) {
  runTests();
}

export { runTests };
