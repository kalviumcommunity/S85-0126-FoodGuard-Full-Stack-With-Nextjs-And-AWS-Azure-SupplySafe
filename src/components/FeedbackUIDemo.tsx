"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { Spinner, LoadingOverlay, ButtonLoader } from "@/components/ui/loader";
import {
  Trash2,
  Save,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";

export function FeedbackUIDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const handleSave = async () => {
    toast.loading("Saving data...", { id: "save" });

    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Data saved successfully!", {
        id: "save",
        description: "Your changes have been saved to the database.",
      });
    } catch {
      toast.error("Failed to save data", {
        id: "save",
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    toast.loading("Deleting item...", { id: "delete" });

    try {
      setIsDeleting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Item deleted successfully!", {
        id: "delete",
        description: `${itemName} has been removed from the system.`,
      });
      setIsModalOpen(false);
      setItemName("");
    } catch {
      toast.error("Failed to delete item", {
        id: "delete",
        description: "Please try again or contact support.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpload = async () => {
    toast.loading("Uploading file...", { id: "upload" });

    try {
      setIsUploading(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast.success("File uploaded successfully!", {
        id: "upload",
        description: "Your file has been processed and stored.",
        action: {
          label: "View",
          onClick: () => {
            // Handle view action
          },
        },
      });
    } catch {
      toast.error("Upload failed", {
        id: "upload",
        description: "File format not supported or size too large.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleNetworkError = () => {
    toast.error("Network error", {
      description:
        "Unable to connect to the server. Please check your internet connection.",
      action: {
        label: "Retry",
        onClick: () => toast.info("Retrying connection..."),
      },
    });
  };

  const handleSuccessMessage = () => {
    toast.success("Operation completed!", {
      description: "All tasks have been processed successfully.",
      icon: <CheckCircle className="h-4 w-4" />,
    });
  };

  const handleWarningMessage = () => {
    toast.warning("Please review", {
      description: "Some items require your attention before proceeding.",
      icon: <AlertTriangle className="h-4 w-4" />,
    });
  };

  const handleOverlayDemo = async () => {
    setShowOverlay(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowOverlay(false);
    toast.success("Process completed!");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Feedback UI Components Demo
        </h1>
        <p className="text-gray-600">
          Interactive demonstration of toasts, modals, and loading states
        </p>
      </div>

      {/* Toast Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🔔</span>
            <span>Toast Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Data</span>
            </Button>

            <Button
              onClick={handleSuccessMessage}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Success</span>
            </Button>

            <Button
              onClick={handleWarningMessage}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Warning</span>
            </Button>

            <Button
              onClick={handleNetworkError}
              variant="destructive"
              className="flex items-center space-x-2"
            >
              <XCircle className="h-4 w-4" />
              <span>Error</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialog Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🗂️</span>
            <span>Modal Dialog</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
              <ModalTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Item</span>
                </Button>
              </ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Confirm Deletion</span>
                  </ModalTitle>
                  <ModalDescription>
                    This action cannot be undone. This will permanently delete
                    the item and remove all associated data from our servers.
                  </ModalDescription>
                </ModalHeader>
                <div className="py-4">
                  <Input
                    placeholder="Enter item name to confirm"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>
                <ModalFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <ButtonLoader
                    isLoading={isDeleting}
                    onClick={handleDelete}
                    disabled={!itemName}
                    loaderText="Deleting..."
                  >
                    Delete Item
                  </ButtonLoader>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </CardContent>
      </Card>

      {/* Loading States Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>⏳</span>
            <span>Loading States</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Spinners */}
            <div>
              <h4 className="font-medium mb-3">Spinners</h4>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Spinner size="sm" />
                  <span className="text-sm">Small</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Spinner size="md" />
                  <span className="text-sm">Medium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Spinner size="lg" />
                  <span className="text-sm">Large</span>
                </div>
              </div>
            </div>

            {/* Button Loaders */}
            <div>
              <h4 className="font-medium mb-3">Button Loading States</h4>
              <div className="flex items-center space-x-4">
                <ButtonLoader
                  isLoading={isLoading}
                  onClick={handleSave}
                  loaderText="Saving..."
                >
                  Save Changes
                </ButtonLoader>

                <ButtonLoader
                  isLoading={isUploading}
                  onClick={handleUpload}
                  loaderText="Uploading..."
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload File</span>
                </ButtonLoader>
              </div>
            </div>

            {/* Loading Overlay */}
            <div>
              <h4 className="font-medium mb-3">Loading Overlay</h4>
              <LoadingOverlay
                isLoading={showOverlay}
                message="Processing your request..."
              >
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 mb-3">
                    This content will be covered by loading overlay when
                    processing.
                  </p>
                  <Button
                    onClick={handleOverlayDemo}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Start Process</span>
                  </Button>
                </div>
              </LoadingOverlay>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🏷️</span>
            <span>Status Indicators</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="compliant">Success</Badge>
            <Badge variant="pending">Pending</Badge>
            <Badge variant="critical">Error</Badge>
            <Badge variant="secondary">Warning</Badge>
            <Badge variant="outline">Info</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-900">
              🎯 How to Use These Components
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • <strong>Toasts:</strong> Use `toast.success()`,
                `toast.error()`, `toast.warning()`, `toast.loading()`
              </li>
              <li>
                • <strong>Modals:</strong> Import from `@/components/ui/modal`
                and wrap with `Modal` component
              </li>
              <li>
                • <strong>Loaders:</strong> Use `Spinner`, `ButtonLoader`, or
                `LoadingOverlay` from `@/components/ui/loader`
              </li>
              <li>
                • <strong>Accessibility:</strong> All components include proper
                ARIA labels and keyboard navigation
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
