"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/pure-custom-auth-v2";
import {
  Shield,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=80",
    caption: "Railway food operations at scale",
  },
  {
    url: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1400&q=80",
    caption: "Hygiene-first kitchen monitoring",
  },
  {
    url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80",
    caption: "End-to-end supply chain traceability",
  },
  {
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    caption: "Real-time compliance dashboards",
  },
];

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []); // Remove isHovered dependency to prevent re-renders

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting || isLoading) {
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    setError("");

    // Basic validation only
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setIsSubmitting(false);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsSubmitting(false);
      setIsLoading(false);
      return;
    }

    try {
      console.log("📡 Creating user with V2 custom auth system");
      console.log("🔍 Debug: Using pure-custom-auth-v2 createUser function");

      // Use custom auth system - no Supabase Auth, just database
      const { success, error, user } = await createUser(
        formData.email,
        formData.password,
        formData.name || "User",
        formData.accountType as "USER" | "SUPPLIER" | "ADMIN"
      );

      if (success && user) {
        console.log("✅ User created successfully with custom auth");
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        console.log("❌ Custom auth error:", error);
        setError(error || "Failed to create user");
      }
    } catch (error) {
      console.log("💥 Unexpected error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(to bottom right, #dbeafe, white, #dcfce8)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#10b981",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            >
              <CheckCircle
                style={{ width: "40px", height: "40px", color: "white" }}
              />
            </div>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "1rem",
              }}
            >
              Account Created!
            </h1>
            <p
              style={{
                fontSize: "20px",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              Welcome to SupplySafe
            </p>
            <p style={{ color: "#9ca3af" }}>Logging you in automatically...</p>
          </div>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "8px" }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#10b981",
                borderRadius: "50%",
                animation: "bounce 1s infinite",
              }}
            ></div>
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#10b981",
                borderRadius: "50%",
                animation: "bounce 1s infinite",
                animationDelay: "0.1s",
              }}
            ></div>
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#10b981",
                borderRadius: "50%",
                animation: "bounce 1s infinite",
                animationDelay: "0.2s",
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* LEFT SIDE - SIGNUP FORM (45%) */}
      <div
        style={{
          width: "45%",
          backgroundColor: "#F8FAFC",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          position: "relative",
          zIndex: 10,
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          {/* Logo and Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                backgroundColor: "#0F2A44",
                borderRadius: "12px",
                marginBottom: "1rem",
              }}
            >
              <Shield
                style={{ width: "24px", height: "24px", color: "white" }}
              />
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "#6B7280",
                marginBottom: "0.5rem",
              }}
            >
              Digital Food Traceability System
            </p>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "0.75rem",
              }}
            >
              Create your SupplySafe account
            </h1>
            <p style={{ color: "#6B7280" }}>
              Join India's railway food safety monitoring network
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <AlertCircle
                style={{
                  width: "20px",
                  height: "20px",
                  color: "#EF4444",
                  flexShrink: 0,
                }}
              />
              <p style={{ color: "#B91C1C", fontSize: "14px" }}>{error}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Account Type Pills */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: "12px",
                }}
              >
                Account Type
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {["User", "Supplier", "Administrator"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        accountType: type.toUpperCase(),
                      })
                    }
                    style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      border: "2px solid",
                      transition: "all 0.3s ease",
                      fontSize: "14px",
                      fontWeight: "500",
                      backgroundColor:
                        formData.accountType === type.toUpperCase()
                          ? "#0F2A44"
                          : "white",
                      borderColor:
                        formData.accountType === type.toUpperCase()
                          ? "#0F2A44"
                          : "#D1D5DB",
                      color:
                        formData.accountType === type.toUpperCase()
                          ? "white"
                          : "#374151",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (formData.accountType !== type.toUpperCase()) {
                        e.currentTarget.style.borderColor = "#0F2A44";
                        e.currentTarget.style.color = "#0F2A44";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.accountType !== type.toUpperCase()) {
                        e.currentTarget.style.borderColor = "#D1D5DB";
                        e.currentTarget.style.color = "#374151";
                      }
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields - 2 Column Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div style={{ position: "relative" }}>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "12px",
                    fontSize: "16px",
                    backgroundColor: "white",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0F2A44";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(15, 42, 68, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#D1D5DB";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  placeholder=" "
                />
                <label
                  htmlFor="name"
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: formData.name ? "-8px" : "12px",
                    backgroundColor: "#F8FAFC",
                    padding: "0 8px",
                    fontSize: formData.name ? "12px" : "16px",
                    color: formData.name ? "#0F2A44" : "#9CA3AF",
                    transition: "all 0.3s ease",
                    fontWeight: formData.name ? "500" : "normal",
                  }}
                >
                  Full Name
                </label>
              </div>

              <div style={{ position: "relative" }}>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "12px",
                    fontSize: "16px",
                    backgroundColor: "white",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0F2A44";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(15, 42, 68, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#D1D5DB";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: formData.email ? "-8px" : "12px",
                    backgroundColor: "#F8FAFC",
                    padding: "0 8px",
                    fontSize: formData.email ? "12px" : "16px",
                    color: formData.email ? "#0F2A44" : "#9CA3AF",
                    transition: "all 0.3s ease",
                    fontWeight: formData.email ? "500" : "normal",
                  }}
                >
                  Email Address
                </label>
              </div>

              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px 48px 12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "12px",
                    fontSize: "16px",
                    backgroundColor: "white",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0F2A44";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(15, 42, 68, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#D1D5DB";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: formData.password ? "-8px" : "12px",
                    backgroundColor: "#F8FAFC",
                    padding: "0 8px",
                    fontSize: formData.password ? "12px" : "16px",
                    color: formData.password ? "#0F2A44" : "#9CA3AF",
                    transition: "all 0.3s ease",
                    fontWeight: formData.password ? "500" : "normal",
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "14px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6B7280",
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: "20px", height: "20px" }} />
                  ) : (
                    <Eye style={{ width: "20px", height: "20px" }} />
                  )}
                </button>
              </div>

              <div style={{ position: "relative" }}>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "12px 48px 12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "12px",
                    fontSize: "16px",
                    backgroundColor: "white",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0F2A44";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(15, 42, 68, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#D1D5DB";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  placeholder=" "
                />
                <label
                  htmlFor="confirmPassword"
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: formData.confirmPassword ? "-8px" : "12px",
                    backgroundColor: "#F8FAFC",
                    padding: "0 8px",
                    fontSize: formData.confirmPassword ? "12px" : "16px",
                    color: formData.confirmPassword ? "#0F2A44" : "#9CA3AF",
                    transition: "all 0.3s ease",
                    fontWeight: formData.confirmPassword ? "500" : "normal",
                  }}
                >
                  Confirm Password
                </label>
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <div
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "14px",
                      }}
                    >
                      <Check
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#10B981",
                        }}
                      />
                    </div>
                  )}
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              style={{
                width: "100%",
                backgroundColor:
                  isLoading || isSubmitting ? "#6b7280" : "#0F2A44",
                color: "white",
                padding: "12px 24px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                border: "none",
                cursor: isLoading || isSubmitting ? "not-allowed" : "pointer",
                opacity: isLoading || isSubmitting ? 0.5 : 1,
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                if (!isLoading && !isSubmitting) {
                  e.currentTarget.style.backgroundColor = "#1a3a5a";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(15, 42, 68, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && !isSubmitting) {
                  e.currentTarget.style.backgroundColor = "#0F2A44";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {isLoading ? (
                <>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid white",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight style={{ width: "20px", height: "20px" }} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <p style={{ fontSize: "14px", color: "#6B7280" }}>
              Already have an account?{" "}
              <a
                href="/login"
                style={{
                  color: "#0F2A44",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - IMAGE CAROUSEL (55%) */}
      <div
        style={{
          width: "55%",
          position: "relative",
          background: "linear-gradient(135deg, #0F2A44, #081826)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Divider Line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "1px",
            backgroundColor: "#E5E7EB",
            zIndex: 1,
          }}
        ></div>

        <div
          style={{
            width: "100%",
            height: "100vh",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Carousel */}
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {carouselImages.map((image, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: index === currentImageIndex ? 1 : 0,
                  transition: "opacity 1s ease",
                }}
              >
                <img
                  src={image.url}
                  alt={image.caption}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    zIndex: 2,
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "2rem",
                    zIndex: 3,
                  }}
                >
                  <p
                    style={{
                      color: "white",
                      fontSize: "20px",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    {image.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "8px",
              zIndex: 4,
            }}
          >
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  width: index === currentImageIndex ? "32px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor:
                    index === currentImageIndex
                      ? "white"
                      : "rgba(255, 255, 255, 0.5)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
