import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DFTS - Digital Food Traceability System",
  description:
    "Indian Railway Catering Services - Ensuring food safety, hygiene compliance, and complete traceability across the entire food lifecycle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="flex flex-wrap gap-4 p-4 bg-gray-100 border-b border-gray-200">
          <Link
            href="/"
            className="font-medium text-gray-700 hover:text-indigo-600"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="font-medium text-gray-700 hover:text-indigo-600"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="font-medium text-gray-700 hover:text-indigo-600"
          >
            Dashboard
          </Link>
          <Link
            href="/users"
            className="font-medium text-gray-700 hover:text-indigo-600"
          >
            Users
          </Link>
          <Link
            href="/users/1"
            className="font-medium text-gray-700 hover:text-indigo-600"
          >
            User 1
          </Link>
          <Link
            href="/about"
            className="font-medium text-gray-700 hover:text-indigo-600"
          >
            About
          </Link>
          <Link
            href="/news"
            className="font-medium text-gray-700 hover:text-indigo-600"
          >
            News
          </Link>
        </nav>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
