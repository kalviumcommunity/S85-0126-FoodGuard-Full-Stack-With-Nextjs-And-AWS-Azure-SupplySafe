"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Package, QrCode, Shield } from "lucide-react";
import { canCreateBatch, requireBatchAuth } from "@/lib/batch-auth";
import { getCurrentUser } from "@/lib/pure-custom-auth-v2";

interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  supplier: {
    id: string;
    name: string;
  };
}

interface Supplier {
  id: string;
  name: string;
  email: string;
}

export default function CreateBatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [productsLoading, setProductsLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check authentication and permissions
  useEffect(() => {
    const authCheck = requireBatchAuth("create");
    if (!authCheck.authorized) {
      setAuthError(
        authCheck.reason || "You do not have permission to create batches"
      );
      setAuthChecking(false);
      return;
    }

    // Get current user info from client-side auth
    const { user, isAuthenticated } = getCurrentUser();
    if (isAuthenticated && user) {
      setCurrentUser(user);
      console.log("🔍 Current user:", user); // Debug log
    }

    setAuthChecking(false);

    // Load products and suppliers
    fetchProducts();
    fetchSuppliers();
  }, []);

  const [formData, setFormData] = useState({
    productId: "",
    supplierId: "",
    manufacturingDate: "",
    expiryDate: "",
    storageConditions: "",
    quantity: "",
    unit: "",
    currentLocation: "Warehouse",
  });

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      console.log("🔍 Starting to fetch products...");
      // Get current user from client-side auth
      const { user } = getCurrentUser();
      console.log("👤 Current user:", user);

      let productsLoaded = false;

      if (user?.role === "SUPPLIER") {
        // If user is supplier, fetch only their products
        console.log("🏪 Fetching products for supplier:", user.id);
        try {
          const response = await fetch(
            `/api/products/simple?supplierId=${user.id}`
          );
          if (response.ok) {
            const data = await response.json();
            console.log("📦 Supplier products loaded:", data.products);
            if (data.products && data.products.length > 0) {
              setProducts(data.products);
              productsLoaded = true;
            }
          }
        } catch (err) {
          console.log("❌ Failed to fetch supplier products:", err);
        }
      } else {
        // If admin or other role, fetch all products
        console.log("👑 Fetching all products for admin");
        try {
          const response = await fetch("/api/products/simple");
          if (response.ok) {
            const data = await response.json();
            console.log("📦 All products loaded:", data.products);
            if (data.products && data.products.length > 0) {
              setProducts(data.products);
              productsLoaded = true;
            }
          }
        } catch (err) {
          console.log("❌ Failed to fetch all products:", err);
        }
      }

      // Always use mock data if no products were loaded
      if (!productsLoaded) {
        console.log("🔄 Using fallback mock data - no products found");
        setProducts([
          {
            id: "1",
            name: "Organic Tomatoes",
            category: "Vegetables",
            unit: "lb",
            supplier: {
              id: "1",
              name: "Fresh Farms Ltd",
            },
          },
          {
            id: "2",
            name: "Premium Salmon",
            category: "Seafood",
            unit: "lb",
            supplier: {
              id: "2",
              name: "Ocean Harvest Co",
            },
          },
          {
            id: "3",
            name: "Free Range Eggs",
            category: "Dairy",
            unit: "dozen",
            supplier: {
              id: "1",
              name: "Fresh Farms Ltd",
            },
          },
          {
            id: "4",
            name: "Fresh Spinach",
            category: "Vegetables",
            unit: "lb",
            supplier: {
              id: "1",
              name: "Fresh Farms Ltd",
            },
          },
          {
            id: "5",
            name: "Jumbo Shrimp",
            category: "Seafood",
            unit: "lb",
            supplier: {
              id: "2",
              name: "Ocean Harvest Co",
            },
          },
        ]);
      }
    } catch (error) {
      console.error("💥 Error fetching products:", error);
      // Fallback to mock data
      console.log("🔄 Using fallback mock data - error occurred");
      setProducts([
        {
          id: "1",
          name: "Organic Tomatoes",
          category: "Vegetables",
          unit: "lb",
          supplier: {
            id: "1",
            name: "Fresh Farms Ltd",
          },
        },
        {
          id: "2",
          name: "Premium Salmon",
          category: "Seafood",
          unit: "lb",
          supplier: {
            id: "2",
            name: "Ocean Harvest Co",
          },
        },
        {
          id: "3",
          name: "Free Range Eggs",
          category: "Dairy",
          unit: "dozen",
          supplier: {
            id: "1",
            name: "Fresh Farms Ltd",
          },
        },
      ]);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      console.log("🔍 Starting to fetch suppliers...");
      // Get current user from client-side auth
      const { user } = getCurrentUser();
      console.log("👤 Current user for suppliers:", user);

      let suppliersLoaded = false;

      if (user?.role === "SUPPLIER") {
        // If user is supplier, set only themselves as supplier option
        console.log("🏪 Setting current supplier as option:", user.name);
        setSuppliers([
          {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        ]);
        // Auto-select current supplier
        setFormData((prev) => ({
          ...prev,
          supplierId: user.id,
        }));
        suppliersLoaded = true;
      } else {
        // If admin, fetch all suppliers
        console.log("👑 Fetching all suppliers for admin");
        try {
          const response = await fetch("/api/suppliers/simple");
          if (response.ok) {
            const data = await response.json();
            console.log("📦 All suppliers loaded:", data.suppliers);
            if (data.suppliers && data.suppliers.length > 0) {
              setSuppliers(data.suppliers);
              suppliersLoaded = true;
            }
          }
        } catch (err) {
          console.log("❌ Failed to fetch all suppliers:", err);
        }
      }

      // Always use mock data if no suppliers were loaded (for admins)
      if (!suppliersLoaded && user?.role !== "SUPPLIER") {
        console.log("🔄 Using fallback mock suppliers - no suppliers found");
        setSuppliers([
          {
            id: "1",
            name: "Fresh Farms Ltd",
            email: "contact@freshfarms.com",
          },
          {
            id: "2",
            name: "Ocean Harvest Co",
            email: "info@oceanharvest.com",
          },
          {
            id: "3",
            name: "Green Valley Organics",
            email: "hello@greenvalley.com",
          },
        ]);
      }
    } catch (error) {
      console.error("💥 Error fetching suppliers:", error);
      // Fallback to mock data
      console.log("🔄 Using fallback mock suppliers - error occurred");
      setSuppliers([
        {
          id: "1",
          name: "Fresh Farms Ltd",
          email: "contact@freshfarms.com",
        },
        {
          id: "2",
          name: "Ocean Harvest Co",
          email: "info@oceanharvest.com",
        },
      ]);
    }
  };

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
    setFormData((prev) => ({
      ...prev,
      productId,
      supplierId: product?.supplier.id || "",
      unit: product?.unit || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Show success and redirect
        alert("Batch created successfully! QR Code generated.");
        router.push("/batches");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create batch");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (authChecking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">{authError}</p>
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Package
            className="h-8 w-8 text-blue-600"
            style={{ color: "#3b82f6" }}
          />
          <h1 className="text-3xl font-bold" style={{ color: "#000" }}>
            Create New Batch
          </h1>
        </div>

        <Card
          style={{
            backgroundColor: "#fff",
            borderColor: "#d1d5db",
            borderWidth: "1px",
          }}
        >
          <CardHeader
            style={{
              backgroundColor: "#fff",
              borderBottom: "1px solid #d1d5db",
              padding: "16px",
            }}
          >
            <CardTitle
              style={{
                color: "#000",
                fontWeight: "bold",
                fontSize: "1.125rem",
              }}
            >
              Batch Information
            </CardTitle>
          </CardHeader>
          <CardContent style={{ backgroundColor: "#fff", padding: "16px" }}>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              style={{ color: "#000" }}
            >
              {error && (
                <Alert
                  variant="destructive"
                  style={{
                    backgroundColor: "#fef2f2",
                    borderColor: "#fecaca",
                    color: "#991b1b",
                  }}
                >
                  <AlertDescription style={{ color: "#991b1b" }}>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2" style={{ marginBottom: "16px" }}>
                  <Label
                    htmlFor="productId"
                    style={{
                      color: "#000000",
                      fontWeight: "600",
                      fontSize: "14px",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Product *
                  </Label>
                  <Select
                    value={formData.productId}
                    onValueChange={handleProductChange}
                    required
                  >
                    <SelectTrigger
                      style={{
                        color: "#000",
                        backgroundColor: "#fff",
                        borderColor: "#d1d5db",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        fontSize: "14px",
                        width: "100%",
                        height: "40px",
                        boxSizing: "border-box",
                        outline: "none",
                        transition: "border-color 0.2s",
                        cursor: "pointer",
                      }}
                    >
                      <SelectValue
                        placeholder={
                          productsLoading
                            ? "Loading products..."
                            : "Click to select product..."
                        }
                        style={{
                          color: productsLoading ? "#999" : "#666",
                          fontSize: "14px",
                        }}
                      />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        backgroundColor: "#fff",
                        borderColor: "#d1d5db",
                        color: "#000",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderRadius: "6px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        maxHeight: "200px",
                        overflow: "auto",
                      }}
                    >
                      {productsLoading ? (
                        <div
                          style={{
                            padding: "12px",
                            color: "#666",
                            textAlign: "center",
                          }}
                        >
                          Loading products...
                        </div>
                      ) : products.length === 0 ? (
                        <div
                          style={{
                            padding: "12px",
                            color: "#666",
                            textAlign: "center",
                          }}
                        >
                          No products available
                        </div>
                      ) : (
                        products.map((product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id}
                            style={{
                              color: "#000",
                              backgroundColor: "#fff",
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            {product.name} ({product.category})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {!productsLoading && products.length > 0 && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginTop: "4px",
                      }}
                    >
                      Available: {products.length} products
                    </div>
                  )}
                </div>

                {/* Only show supplier field for admins, not for suppliers */}
                {currentUser?.role !== "SUPPLIER" && (
                  <div className="space-y-2" style={{ marginBottom: "16px" }}>
                    <Label
                      htmlFor="supplierId"
                      style={{
                        color: "#000000",
                        fontWeight: "600",
                        fontSize: "14px",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Supplier *
                    </Label>
                    <Select
                      value={formData.supplierId}
                      onValueChange={(value) =>
                        handleInputChange("supplierId", value)
                      }
                      required
                    >
                      <SelectTrigger
                        style={{
                          color: "#000",
                          backgroundColor: "#fff",
                          borderColor: "#d1d5db",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderRadius: "6px",
                          padding: "8px 12px",
                          fontSize: "14px",
                          width: "100%",
                          height: "40px",
                          boxSizing: "border-box",
                          outline: "none",
                          transition: "border-color 0.2s",
                          cursor: "pointer",
                        }}
                      >
                        <SelectValue
                          placeholder="Select supplier"
                          style={{ color: "#666", fontSize: "14px" }}
                        />
                      </SelectTrigger>
                      <SelectContent
                        style={{
                          backgroundColor: "#fff",
                          borderColor: "#d1d5db",
                          color: "#000",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderRadius: "6px",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          maxHeight: "200px",
                          overflow: "auto",
                        }}
                      >
                        {suppliers.map((supplier) => (
                          <SelectItem
                            key={supplier.id}
                            value={supplier.id}
                            style={{
                              color: "#000",
                              backgroundColor: "#fff",
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2" style={{ marginBottom: "16px" }}>
                  <Label
                    htmlFor="manufacturingDate"
                    style={{
                      color: "#000000",
                      fontWeight: "600",
                      fontSize: "14px",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Manufacturing Date *
                  </Label>
                  <Input
                    id="manufacturingDate"
                    type="date"
                    value={formData.manufacturingDate}
                    onChange={(e) =>
                      handleInputChange("manufacturingDate", e.target.value)
                    }
                    required
                    style={{
                      color: "#000",
                      backgroundColor: "#fff",
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "14px",
                      width: "100%",
                      height: "40px",
                      boxSizing: "border-box",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                  />
                </div>

                <div className="space-y-2" style={{ marginBottom: "16px" }}>
                  <Label
                    htmlFor="expiryDate"
                    style={{
                      color: "#000000",
                      fontWeight: "600",
                      fontSize: "14px",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Expiry Date *
                  </Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      handleInputChange("expiryDate", e.target.value)
                    }
                    required
                    style={{
                      color: "#000",
                      backgroundColor: "#fff",
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "14px",
                      width: "100%",
                      height: "40px",
                      boxSizing: "border-box",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                  />
                </div>

                <div className="space-y-2" style={{ marginBottom: "16px" }}>
                  <Label
                    htmlFor="quantity"
                    style={{
                      color: "#000000",
                      fontWeight: "600",
                      fontSize: "14px",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Quantity *
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
                    required
                    style={{
                      color: "#000",
                      backgroundColor: "#fff",
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "14px",
                      width: "100%",
                      height: "40px",
                      boxSizing: "border-box",
                      outline: "none",
                      transition: "border-color 0.2s",
                      placeholderColor: "#6b7280",
                    }}
                  />
                </div>

                <div className="space-y-2" style={{ marginBottom: "16px" }}>
                  <Label
                    htmlFor="unit"
                    style={{
                      color: "#000000",
                      fontWeight: "600",
                      fontSize: "14px",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Unit *
                  </Label>
                  <Input
                    id="unit"
                    type="text"
                    placeholder="e.g., kg, liters, pieces"
                    value={formData.unit}
                    onChange={(e) => handleInputChange("unit", e.target.value)}
                    required
                    style={{
                      color: "#000",
                      backgroundColor: "#fff",
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "14px",
                      width: "100%",
                      height: "40px",
                      boxSizing: "border-box",
                      outline: "none",
                      transition: "border-color 0.2s",
                      placeholderColor: "#6b7280",
                    }}
                  />
                </div>

                <div className="space-y-2" style={{ marginBottom: "16px" }}>
                  <Label
                    htmlFor="currentLocation"
                    style={{
                      color: "#000000",
                      fontWeight: "600",
                      fontSize: "14px",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Current Location
                  </Label>
                  <Input
                    id="currentLocation"
                    type="text"
                    placeholder="e.g., Warehouse, Kitchen A"
                    value={formData.currentLocation}
                    onChange={(e) =>
                      handleInputChange("currentLocation", e.target.value)
                    }
                    style={{
                      color: "#000",
                      backgroundColor: "#fff",
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "14px",
                      width: "100%",
                      height: "40px",
                      boxSizing: "border-box",
                      outline: "none",
                      transition: "border-color 0.2s",
                      placeholderColor: "#6b7280",
                    }}
                  />
                </div>

                <div
                  className="space-y-2 md:col-span-2"
                  style={{ marginBottom: "16px" }}
                >
                  <Label
                    htmlFor="storageConditions"
                    style={{
                      color: "#000000",
                      fontWeight: "600",
                      fontSize: "14px",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Storage Conditions
                  </Label>
                  <Textarea
                    id="storageConditions"
                    placeholder="Enter storage requirements (temperature, humidity, etc.)"
                    value={formData.storageConditions}
                    onChange={(e) =>
                      handleInputChange("storageConditions", e.target.value)
                    }
                    rows={3}
                    style={{
                      color: "#000",
                      backgroundColor: "#fff",
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "14px",
                      width: "100%",
                      boxSizing: "border-box",
                      outline: "none",
                      transition: "border-color 0.2s",
                      placeholderColor: "#6b7280",
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4" style={{ paddingTop: "24px" }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                  style={{
                    color: "#000",
                    backgroundColor: "#fff",
                    borderColor: "#d1d5db",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                  style={{
                    color: loading ? "#999" : "#fff",
                    backgroundColor: loading ? "#f3f4f6" : "#3b82f6",
                    borderColor: "#3b82f6",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Batch...
                    </>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4 mr-2" />
                      Create Batch & Generate QR
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {selectedProduct && (
          <Card
            className="mt-6"
            style={{ backgroundColor: "#fff", borderColor: "#d1d5db" }}
          >
            <CardHeader
              style={{
                backgroundColor: "#fff",
                borderBottom: "1px solid #d1d5db",
              }}
            >
              <CardTitle
                className="text-lg"
                style={{ color: "#000", fontWeight: "bold" }}
              >
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent style={{ backgroundColor: "#fff", padding: "16px" }}>
              <div
                className="grid grid-cols-2 gap-4 text-sm"
                style={{ color: "#000" }}
              >
                <div style={{ color: "#000" }}>
                  <span className="font-medium" style={{ color: "#000" }}>
                    Product:
                  </span>{" "}
                  {selectedProduct.name}
                </div>
                <div style={{ color: "#000" }}>
                  <span className="font-medium" style={{ color: "#000" }}>
                    Category:
                  </span>{" "}
                  {selectedProduct.category}
                </div>
                <div style={{ color: "#000" }}>
                  <span className="font-medium" style={{ color: "#000" }}>
                    Default Unit:
                  </span>{" "}
                  {selectedProduct.unit}
                </div>
                <div style={{ color: "#000" }}>
                  <span className="font-medium" style={{ color: "#000" }}>
                    Supplier:
                  </span>{" "}
                  {selectedProduct.supplier.name}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
