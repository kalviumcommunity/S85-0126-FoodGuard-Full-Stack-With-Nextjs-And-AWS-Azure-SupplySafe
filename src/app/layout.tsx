import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import { Toaster } from "sonner";
import "./globals.css";

// Load fonts with proper fallback
const inter = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SupplySafe DFTS - Digital Food Traceability System",
  description: "Digital Food Traceability System for Indian Railway Catering Services - Ensuring food safety, hygiene compliance, and complete traceability across the food supply chain with real-time monitoring and blockchain verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <UIProvider>
            <Toaster
              position="top-right"
              richColors
              closeButton
              expand={false}
              duration={4000}
            />
            <main className="min-h-screen">
              {children}
            </main>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
