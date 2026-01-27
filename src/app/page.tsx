"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  ChefHat, 
  Truck, 
  Train, 
  Users, 
  Shield,
  TrendingUp,
  AlertTriangle,
  BarChart3
} from 'lucide-react'

const metrics = [
  {
    title: "Active Food Batches",
    value: "247",
    description: "Currently monitored",
    icon: Package,
    trend: "+12%"
  },
  {
    title: "Kitchens Live",
    value: "18",
    description: "Operating now",
    icon: ChefHat,
    trend: "+3%"
  },
  {
    title: "Hygiene Score",
    value: "84%",
    description: "Average compliance",
    icon: Shield,
    trend: "+2%"
  },
  {
    title: "Daily Passengers",
    value: "45K",
    description: "Meals served",
    icon: Users,
    trend: "+8%"
  }
]

const features = [
  {
    title: "Real-time Tracking",
    description: "Monitor food movement from supplier to passenger in real-time",
    icon: Package,
    href: "/traceability"
  },
  {
    title: "Hygiene Monitoring",
    description: "Comprehensive hygiene compliance tracking and reporting",
    icon: Shield,
    href: "/hygiene"
  },
  {
    title: "Quality Assurance",
    description: "Automated quality checks and temperature monitoring",
    icon: TrendingUp,
    href: "/dashboard"
  },
  {
    title: "Alert Management",
    description: "Instant notifications for violations and compliance issues",
    icon: AlertTriangle,
    href: "/alerts"
  },
  {
    title: "Batch Management",
    description: "Complete batch lifecycle management and documentation",
    icon: BarChart3,
    href: "/batches"
  },
  {
    title: "Analytics Dashboard",
    description: "Comprehensive analytics and operational insights",
    icon: BarChart3,
    href: "/dashboard"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0F2A44] to-[#1a3a5a] text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-[#1E7F5C] rounded-xl flex items-center justify-center">
                <Train className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-4">
              Digital Food Traceability System
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Indian Railway Catering Services - Ensuring Food Safety, Hygiene Compliance, 
              and Complete Traceability Across the Entire Food Lifecycle
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <Badge variant="secondary" className="bg-[#1E7F5C] text-white border-none">
                Government Grade Infrastructure
              </Badge>
              <Badge variant="outline" className="border-white text-white">
                Real-time Monitoring
              </Badge>
              <Badge variant="outline" className="border-white text-white">
                ISO 22000 Compliant
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">System Overview</h2>
          <p className="text-gray-600">Real-time monitoring across Indian Railway network</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-green-600 font-medium">{metric.trend}</span>
                        <span className="text-xs text-gray-500">{metric.description}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Food Flow Visualization */}
      <div className="bg-white border-y border-gray-200">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Traceability Chain</h2>
            <p className="text-gray-600">From supplier to passenger - every step monitored</p>
          </div>
          
          <div className="relative">
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200"></div>
            <div className="relative flex justify-between">
              {[
                { icon: Package, title: 'Supplier', desc: 'Quality sourcing' },
                { icon: ChefHat, title: 'Kitchen', desc: 'Food preparation' },
                { icon: Truck, title: 'Transport', desc: 'Cold chain logistics' },
                { icon: Train, title: 'Train', desc: 'In-transit monitoring' },
                { icon: Users, title: 'Passenger', desc: 'Final delivery' }
              ].map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="flex flex-col items-center space-y-4">
                    <div className="relative z-10 w-16 h-16 bg-[#0F2A44] rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">System Capabilities</h2>
          <p className="text-gray-600">Comprehensive food safety and quality management</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-all hover:border-blue-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Link href={feature.href}>
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#0F2A44] text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Access the DFTS Dashboard
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Monitor real-time food safety, hygiene compliance, and traceability 
              across the entire Indian Railway catering network.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-[#1E7F5C] hover:bg-[#1a6f4c] text-white">
                  Open Dashboard
                </Button>
              </Link>
              <Link href="/traceability">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0F2A44]">
                  View Traceability
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
