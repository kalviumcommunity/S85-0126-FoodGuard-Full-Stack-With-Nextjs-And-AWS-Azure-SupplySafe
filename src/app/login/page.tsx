"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/pure-custom-auth-v2";
import { testDatabaseConnection } from "@/lib/test-db-connection";
import { Shield, Eye, EyeOff, CheckCircle, Activity, Truck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const router = useRouter();

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage("Confirmation email resent! Please check your inbox.");
      }
    } catch (error) {
      setError("Failed to resend confirmation email.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    console.log('🔍 Testing database connection...');
    await testDatabaseConnection();
    console.log('🔍 Attempting login with custom auth system');

    // Use custom auth system
    const { success, error, user, token } = await loginUser(email, password);

    if (success && user) {
      console.log('✅ Custom login successful', { user: { email: user.email, role: user.role } });
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      console.log('❌ Custom login error:', error);
      setError(error || "Invalid login credentials");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'stretch' }}>
      {/* LEFT HERO PANEL - 55% Width */}
      <div style={{ 
        width: '55%', 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1
          }}
        >
          <source src="/Woman using Login page.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(rgba(15, 42, 68, 0.75), rgba(8, 24, 38, 0.9))',
          zIndex: 2
        }} />

        {/* Content Container */}
        <div style={{ position: 'relative', zIndex: 3, padding: '40px', display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Top Branding */}
          <div>
            <h1 style={{ 
              color: 'white', 
              fontSize: '28px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>
              SupplySafe
            </h1>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Digital Food Traceability System
            </p>
          </div>

          {/* Center Hero Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <h2 style={{ 
              color: 'white', 
              fontSize: '42px', 
              fontWeight: 'bold', 
              lineHeight: '1.2',
              marginBottom: '24px',
              maxWidth: '500px'
            }}>
              Monitoring Safe Food Delivery Across Indian Railways
            </h2>
            
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '18px',
              lineHeight: '1.6',
              marginBottom: '48px',
              maxWidth: '450px'
            }}>
              Track supply batches, verify hygiene compliance, and ensure food safety across the railway network.
            </p>

            {/* Trust Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Activity style={{ color: '#16A34A', width: '20px', height: '20px' }} />
                <span style={{ color: 'white', fontSize: '16px' }}>Real-time kitchen monitoring</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Truck style={{ color: '#16A34A', width: '20px', height: '20px' }} />
                <span style={{ color: 'white', fontSize: '16px' }}>End-to-end supply chain visibility</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle style={{ color: '#16A34A', width: '20px', height: '20px' }} />
                <span style={{ color: 'white', fontSize: '16px' }}>Government-compliant traceability</span>
              </div>
            </div>
          </div>

          {/* Bottom Live Stats */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            alignSelf: 'flex-start'
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: '#16A34A', 
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>Live Monitoring Active</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>500+ Kitchens Connected</span>
          </div>
        </div>
      </div>

      {/* RIGHT AUTH PANEL - 45% Width */}
      <div style={{ 
        width: '45%', 
        backgroundColor: '#F8FAFC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        {/* Form Container */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(15, 42, 68, 0.1)',
          padding: '32px',
          width: '100%',
          maxWidth: '420px'
        }}>
          {/* Form Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0F2A44, #16A34A)',
                borderRadius: '12px',
                padding: '12px',
                display: 'inline-flex'
              }}>
                <Shield style={{ color: 'white', width: '32px', height: '32px' }} />
              </div>
            </div>
            <h1 style={{ 
              color: '#0B1220', 
              fontSize: '28px', 
              fontWeight: 'bold', 
              marginBottom: '8px' 
            }}>
              Secure Network Access
            </h1>
            <p style={{ color: '#64748B', fontSize: '16px' }}>
              Sign in to continue to SupplySafe dashboard
            </p>
          </div>

          {error && error.includes("Email not confirmed") && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              backgroundColor: '#FEF3C7',
              border: '1px solid #F59E0B',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <p style={{ color: '#92400E', fontSize: '14px', marginBottom: '12px' }}>{error}</p>
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={isResending || !email}
                style={{
                  width: '100%',
                  backgroundColor: '#F59E0B',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isResending || !email ? 'not-allowed' : 'pointer',
                  opacity: isResending || !email ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {isResending ? "Resending..." : "Resend Confirmation Email"}
              </button>
            </div>
          )}

          {error && !error.includes("Email not confirmed") && (
            <div style={{
              backgroundColor: '#FEE2E2',
              border: '1px solid #EF4444',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{ color: '#DC2626', fontSize: '14px' }}>{error}</p>
            </div>
          )}

          {successMessage && (
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #16A34A',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{ color: '#16A34A', fontSize: '14px' }}>{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your email"
                onFocus={(e) => {
                  e.target.style.borderColor = '#0F2A44';
                  e.target.style.boxShadow = '0 0 0 3px rgba(15, 42, 68, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    paddingRight: '48px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your password"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0F2A44';
                    e.target.style.boxShadow = '0 0 0 3px rgba(15, 42, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6B7280',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#0F2A44' }} />
                Remember me
              </label>
              <a href="#" style={{ color: '#0F2A44', textDecoration: 'none', fontWeight: '500' }}>
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: '#0F2A44',
                color: 'white',
                padding: '14px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#0A1F33';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(15, 42, 68, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#0F2A44';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Signing in...
                </>
              ) : (
                <>
                  Access Dashboard
                  <span style={{ fontSize: '18px' }}>→</span>
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ fontSize: '14px', color: '#64748B' }}>
              Don't have an account?{" "}
              <a href="/signup" style={{ color: '#0F2A44', textDecoration: 'none', fontWeight: '600' }}>
                Create one
              </a>
            </p>
          </div>

          {/* Security Footer */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '24px', 
            paddingTop: '24px', 
            borderTop: '1px solid #E5E7EB' 
          }}>
            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
              Authorized access only.
              <br />
              All activity is monitored and logged.
            </p>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
