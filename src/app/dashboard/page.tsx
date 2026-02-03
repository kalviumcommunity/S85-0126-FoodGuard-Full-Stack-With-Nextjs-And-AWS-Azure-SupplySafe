"use client";

import { AppShell } from "@/components/layout/app-shell";
import { MetricsCard } from "@/components/dashboard/metrics-card";
import { FoodMovementTimeline } from "@/components/dashboard/food-movement-timeline";
import { HygieneComplianceStatus } from "@/components/dashboard/hygiene-compliance-status";
import { AlertsViolations } from "@/components/dashboard/alerts-violations";
import { RecentBatches } from "@/components/dashboard/recent-batches";
import { LatestComplaints } from "@/components/dashboard/latest-complaints";
import {
  Package,
  ChefHat,
  Shield,
  AlertTriangle,
  TrendingUp,
  Users,
  Train,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Key Metrics Cards */}
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

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Food Movement Timeline - Takes 2 columns */}
          <div className="lg:col-span-2">
            <FoodMovementTimeline />
          </div>

          {/* Hygiene Compliance Status */}
          <div className="lg:col-span-1">
            <HygieneComplianceStatus />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts & Violations */}
          <AlertsViolations />

          {/* Recent Batches */}
          <RecentBatches />
        </div>

        {/* Latest Complaints */}
        <LatestComplaints />

        {/* System Status Footer */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
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
                <TrendingUp className="w-4 h-4" />
                <span>99.8% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
