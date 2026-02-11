import { resourcePermissions, hasResourcePermission } from "../src/lib/rbac";

const resources = Object.keys(resourcePermissions) as Array<
  keyof typeof resourcePermissions
>;
const permissions = ["create", "read", "update", "delete"] as const;

console.log("Checking admin permissions:");
resources.forEach((resource) => {
  permissions.forEach((permission) => {
    const ok = hasResourcePermission(
      "admin" as any,
      resource as any,
      permission as any
    );
    if (!ok) {
      console.log(`MISSING: admin ${permission} on ${resource}`);
    }
  });
});

console.log("Done");
