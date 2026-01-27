"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LucideIcon } from 'lucide-react'

interface MetricsCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  status?: 'success' | 'warning' | 'critical' | 'default'
}

export function MetricsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  status = 'default'
}: MetricsCardProps) {
  const statusColors = {
    success: 'border-green-200 bg-green-50',
    warning: 'border-amber-200 bg-amber-50',
    critical: 'border-red-200 bg-red-50',
    default: 'border-gray-200 bg-white'
  }

  return (
    <Card className={`${statusColors[status]} hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              status === 'success' ? 'bg-green-100' :
              status === 'warning' ? 'bg-amber-100' :
              status === 'critical' ? 'bg-red-100' :
              'bg-blue-100'
            }`}>
              <Icon className={`w-6 h-6 ${
                status === 'success' ? 'text-green-600' :
                status === 'warning' ? 'text-amber-600' :
                status === 'critical' ? 'text-red-600' :
                'text-blue-600'
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </div>
          
          {trend && (
            <div className="text-right">
              <Badge variant={trend.isPositive ? 'success' : 'critical'} className="text-xs">
                {trend.isPositive ? '+' : ''}{trend.value}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
