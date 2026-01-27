"use client"

import { headers } from "next/headers";

// Force dynamic rendering - page will be generated on every request
export const dynamic = "force-dynamic";

interface Metric {
  id: string;
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
}

interface Activity {
  id: number;
  action: string;
  timestamp: string;
  user: string;
}

async function getLiveMetrics(cookie: string) {
  const timestamp = new Date().toISOString();
  const requestTime = new Date().toLocaleTimeString();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const headersInit: HeadersInit = cookie ? { cookie } : {};

  try {
    const [usersRes, productsRes, ordersRes, suppliersRes] = await Promise.all([
      fetch(`${baseUrl}/api/users`, {
        cache: "no-store",
        headers: headersInit,
      }),
      fetch(`${baseUrl}/api/products`, {
        cache: "no-store",
        headers: headersInit,
      }),
      fetch(
        `${baseUrl}/api/orders?userId=395dcbc2-0405-4758-9c3a-8208eaae3ba7`,
        { cache: "no-store", headers: headersInit }
      ),
      fetch(`${baseUrl}/api/suppliers?verified=true`, {
        cache: "no-store",
        headers: headersInit,
      }),
    ]);

    const users = await usersRes.json();
    const products = await productsRes.json();
    const orders = await ordersRes.json();
    const suppliers = await suppliersRes.json();

    const totalUsers = users.data?.length || 0;
    const totalOrders = orders.data?.length || 0;
    const totalSuppliers = suppliers.data?.length || 0;

    interface Product {
      inStock: boolean;
    }

    const inStockProducts =
      products.data?.filter((p: Product) => p.inStock)?.length || 0;

    return {
      timestamp,
      requestTime,
      metrics: [
        {
          id: "users",
          label: "Total Users",
          value: totalUsers,
          change: "+12.5%",
          trend: "up" as const,
        },
        {
          id: "products",
          label: "Products Available",
          value: inStockProducts,
          change: "+8.2%",
          trend: "up" as const,
        },
        {
          id: "orders",
          label: "Total Orders",
          value: totalOrders,
          change: "+15.3%",
          trend: "up" as const,
        },
        {
          id: "suppliers",
          label: "Verified Suppliers",
          value: totalSuppliers,
          change: "+5.7%",
          trend: "up" as const,
        },
      ] as Metric[],
      recentActivity: [
        {
          id: 1,
          action: "New order created",
          timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString(),
          user: "John Restaurant Manager",
        },
        {
          id: 2,
          action: "Product added",
          timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString(),
          user: "Fresh Farms Owner",
        },
        {
          id: 3,
          action: "Order confirmed",
          timestamp: new Date(Date.now() - 30 * 60000).toLocaleTimeString(),
          user: "Admin User",
        },
        {
          id: 4,
          action: "Supplier verified",
          timestamp: new Date(Date.now() - 45 * 60000).toLocaleTimeString(),
          user: "Admin User",
        },
      ] as Activity[],
    };
  } catch {
    return {
      timestamp,
      requestTime,
      metrics: [
        {
          id: "users",
          label: "Total Users",
          value: 0,
          change: "0%",
          trend: "up" as const,
        },
        {
          id: "products",
          label: "Products Available",
          value: 0,
          change: "0%",
          trend: "up" as const,
        },
        {
          id: "orders",
          label: "Total Orders",
          value: 0,
          change: "0%",
          trend: "up" as const,
        },
        {
          id: "suppliers",
          label: "Verified Suppliers",
          value: 0,
          change: "0%",
          trend: "up" as const,
        },
      ] as Metric[],
      recentActivity: [] as Activity[],
    };
  }
}

export default async function DashboardPage() {
  const h = await headers();
  const data = await getLiveMetrics(h.get("cookie") ?? "");

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Active Food Batches"
            value="247"
            description="Currently in transit"
            icon={Package}
            trend={{ value: "12%", isPositive: true }}
            status="success"
          />
          <MetricsCard
            title="Kitchens Live"
            value="18"
            description="Operating now"
            icon={ChefHat}
            trend={{ value: "3%", isPositive: true }}
            status="success"
          />
          <MetricsCard
            title="Hygiene Score"
            value="84%"
            description="Average compliance"
            icon={TrendingUp}
            trend={{ value: "2%", isPositive: false }}
            status="warning"
          />
          <MetricsCard
            title="Open Complaints"
            value="7"
            description="Awaiting resolution"
            icon={AlertTriangle}
            trend={{ value: "5%", isPositive: true }}
            status="critical"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Food Movement Timeline - Takes 2 columns */}
          <div className="lg:col-span-2">
            <FoodMovementTimeline />
          </div>

          {/* Alerts & Violations */}
          <div>
            <AlertsViolations />
          </div>
        </div>

        {/* Hygiene Compliance Status */}
        <div className="grid grid-cols-1 lg:grid-cols-1">
          <HygieneComplianceStatus />
        </div>
      </div>
    </AppShell>
  )
}
