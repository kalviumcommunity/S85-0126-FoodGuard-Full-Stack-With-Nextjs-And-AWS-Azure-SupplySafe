"use client"

import { AppShell } from '@/components/layout/app-shell'
import { MetricsCard } from '@/components/dashboard/metrics-card'
import { FoodMovementTimeline } from '@/components/dashboard/food-movement-timeline'
import { HygieneComplianceStatus } from '@/components/dashboard/hygiene-compliance-status'
import { AlertsViolations } from '@/components/dashboard/alerts-violations'
import { Package, ChefHat, AlertTriangle, TrendingUp } from 'lucide-react'

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
