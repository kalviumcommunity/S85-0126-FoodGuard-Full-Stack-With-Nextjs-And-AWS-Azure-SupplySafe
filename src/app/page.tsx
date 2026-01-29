"use client";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { MetricsCard } from "@/components/dashboard/metrics-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function Home() {
  return (
    <AppShell>
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

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Active Food Batches"
            value="127"
            description="Currently in transit"
            icon={Package}
            trend={{ value: "12.5%", isPositive: true }}
            status="success"
          />
          <MetricsCard
            title="Kitchens Live"
            value="43"
            description="Operational now"
            icon={ChefHat}
            trend={{ value: "2.1%", isPositive: true }}
            status="success"
          />
          <MetricsCard
            title="Hygiene Score"
            value="83.7%"
            description="Average compliance"
            icon={Shield}
            trend={{ value: "5.2%", isPositive: false }}
            status="warning"
          />
          <MetricsCard
            title="Open Complaints"
            value="8"
            description="Requires attention"
            icon={AlertTriangle}
            trend={{ value: "18.3%", isPositive: false }}
            status="critical"
          />
        </div>

        {/* Quick Actions */}
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
                  <div className="text-2xl font-bold text-gray-900">99.8%</div>
                  <div className="text-sm text-gray-600">System Uptime</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">2,847</div>
                  <div className="text-sm text-gray-600">
                    Daily Transactions
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">127</div>
                  <div className="text-sm text-gray-600">Active Routes</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">43</div>
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
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Batch BATCH-7845 delivered
                      </p>
                      <p className="text-xs text-gray-500">
                        Mumbai to Pune - 2 hours ago
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Hygiene inspection scheduled
                      </p>
                      <p className="text-xs text-gray-500">
                        Pune Kitchen - 4 hours ago
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        New supplier registered
                      </p>
                      <p className="text-xs text-gray-500">
                        Fresh Foods Ltd - 6 hours ago
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

        {/* System Status Footer */}
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
                  Last updated: 2 minutes ago
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Train className="w-4 h-4" />
                  <span>127 Active Routes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>43 Kitchens Online</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>99.8% Uptime</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
