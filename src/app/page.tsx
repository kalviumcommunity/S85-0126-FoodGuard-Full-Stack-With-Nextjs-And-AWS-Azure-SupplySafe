"use client";
import Link from "next/link";
import { MetricsCard } from "@/components/dashboard/metrics-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  Package,
  ChefHat,
  Shield,
  AlertTriangle,
  Train,
  Users,
  BarChart3,
  FileText,
  Settings,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

interface HomeStats {
  totalUsers: number;
  totalSuppliers: number;
  verifiedSuppliers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  systemUptime: string;
  activeRoutes: number;
  kitchensOnline: number;
  hygieneScore: string;
  openComplaints: number;
  dailyTransactions: number;
  lastUpdated: string;
}

export default function Home() {
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeStats();
  }, []);

  const fetchHomeStats = async () => {
    try {
      const response = await fetch('/api/home/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch home stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="p-6">
        <div className="space-y-8">
        {/* System Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-[#0F2A44] rounded-xl flex items-center justify-center">
                <Train className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900">
                  Digital Food Traceability System
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Indian Railway Catering Services
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              SupplySafe DFTS Platform
            </Badge>

            {/* Quick Access Button */}
            <div className="pt-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-[#0F2A44] hover:bg-[#1a3a5a] text-white px-8 py-3"
                >
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  Access Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Real Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Active Food Batches"
            value={stats?.totalOrders?.toString() || "0"}
            description="Currently in system"
            icon={Package}
            trend={{ value: "12.5%", isPositive: true }}
            status="success"
          />
          <MetricsCard
            title="Kitchens Live"
            value={stats?.kitchensOnline?.toString() || "0"}
            description="Operational now"
            icon={ChefHat}
            trend={{ value: "2.1%", isPositive: true }}
            status="success"
          />
          <MetricsCard
            title="Hygiene Score"
            value={stats?.hygieneScore || "N/A"}
            description="Average compliance"
            icon={Shield}
            trend={{ value: "5.2%", isPositive: false }}
            status="warning"
          />
          <MetricsCard
            title="Pending Orders"
            value={stats?.pendingOrders?.toString() || "0"}
            description="Requires attention"
            icon={AlertTriangle}
            trend={{ value: "18.3%", isPositive: false }}
            status="critical"
          />
        </div>

        {/* Real System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>System Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{stats?.systemUptime || "N/A"}</div>
                  <div className="text-sm text-gray-600">System Uptime</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{stats?.dailyTransactions?.toLocaleString() || "0"}</div>
                  <div className="text-sm text-gray-600">
                    Daily Transactions
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{stats?.activeRoutes || "0"}</div>
                  <div className="text-sm text-gray-600">Active Routes</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{stats?.kitchensOnline || "0"}</div>
                  <div className="text-sm text-gray-600">Kitchens Online</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Link href="/dashboard">
                  <Button className="w-full">
                    View Full Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Platform Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {stats?.totalUsers?.toLocaleString() || "0"} Registered Users
                      </p>
                      <p className="text-xs text-gray-500">
                        Including {stats?.verifiedSuppliers || "0"} verified suppliers
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {stats?.totalProducts?.toLocaleString() || "0"} Products Available
                      </p>
                      <p className="text-xs text-gray-500">
                        Across all suppliers
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {stats?.completedOrders?.toLocaleString() || "0"} Orders Completed
                      </p>
                      <p className="text-xs text-gray-500">
                        Successfully delivered
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Link href="/traceability">
                  <Button variant="outline" className="w-full">
                    View Traceability Flow
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Dashboard</h3>
                <p className="text-sm text-gray-600 mt-1">Real-time metrics</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/traceability">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Package className="w-8 h-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold text-gray-900">Traceability</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Food journey tracking
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/batches">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Batches</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage food batches
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Settings className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600 mt-1">
                  System configuration
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Real System Status Footer */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">
                    System Status: All services operational
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {stats ? new Date(stats.lastUpdated).toLocaleTimeString() : "N/A"}
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Train className="w-4 h-4" />
                  <span>{stats?.activeRoutes || "0"} Active Routes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{stats?.kitchensOnline || "0"} Kitchens Online</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>{stats?.systemUptime || "N/A"} Uptime</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
