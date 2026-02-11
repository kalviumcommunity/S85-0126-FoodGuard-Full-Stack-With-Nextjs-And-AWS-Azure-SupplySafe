import { getCurrentUser, canAccess } from "./pure-custom-auth-v2";

// Batch-specific permission checks
export function canCreateBatch(): boolean {
  const { user } = getCurrentUser();
  return canAccess(user, "batches");
}

export function canViewBatch(): boolean {
  const { user } = getCurrentUser();
  return canAccess(user, "batches");
}

export function canEditBatch(): boolean {
  const { user } = getCurrentUser();
  return canAccess(user, "batches");
}

export function canDeleteBatch(): boolean {
  const { user } = getCurrentUser();
  return user?.role === "ADMIN"; // Only admins can delete batches
}

export function canTrackBatchMovement(): boolean {
  const { user } = getCurrentUser();
  return canAccess(user, "batches");
}

// Role-based batch creation limits
export function getBatchCreationLimits() {
  const { user } = getCurrentUser();

  if (!user) return { canCreate: false, maxBatches: 0 };

  switch (user.role) {
    case "SUPPLIER":
      return { canCreate: true, maxBatches: 50 }; // Suppliers can create up to 50 batches
    case "ADMIN":
      return { canCreate: true, maxBatches: 1000 }; // Admins have high limit
    case "USER":
      return { canCreate: false, maxBatches: 0 }; // Users cannot create batches
    default:
      return { canCreate: false, maxBatches: 0 };
  }
}

// Middleware for batch operations
export function requireBatchAuth(
  action: "create" | "view" | "edit" | "delete" | "track"
) {
  const { user, isAuthenticated } = getCurrentUser();

  if (!isAuthenticated || !user) {
    return { authorized: false, reason: "Authentication required" };
  }

  switch (action) {
    case "create":
      return {
        authorized: canCreateBatch(),
        reason: canCreateBatch()
          ? null
          : "Insufficient permissions to create batches",
      };
    case "view":
      return {
        authorized: canViewBatch(),
        reason: canViewBatch()
          ? null
          : "Insufficient permissions to view batches",
      };
    case "edit":
      return {
        authorized: canEditBatch(),
        reason: canEditBatch()
          ? null
          : "Insufficient permissions to edit batches",
      };
    case "delete":
      return {
        authorized: canDeleteBatch(),
        reason: canDeleteBatch() ? null : "Only admins can delete batches",
      };
    case "track":
      return {
        authorized: canTrackBatchMovement(),
        reason: canTrackBatchMovement()
          ? null
          : "Insufficient permissions to track batch movements",
      };
    default:
      return { authorized: false, reason: "Invalid action" };
  }
}
