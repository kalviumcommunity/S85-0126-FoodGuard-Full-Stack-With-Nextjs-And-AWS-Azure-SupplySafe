"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react'

const hygieneData = [
  {
    category: 'Food Handling',
    score: 92,
    status: 'compliant',
    issues: 0,
    lastChecked: '2 hours ago'
  },
  {
    category: 'Storage Temperature',
    score: 88,
    status: 'compliant',
    issues: 1,
    lastChecked: '1 hour ago'
  },
  {
    category: 'Kitchen Cleanliness',
    score: 76,
    status: 'warning',
    issues: 3,
    lastChecked: '30 mins ago'
  },
  {
    category: 'Personal Hygiene',
    score: 95,
    status: 'compliant',
    issues: 0,
    lastChecked: '45 mins ago'
  },
  {
    category: 'Equipment Sanitation',
    score: 68,
    status: 'critical',
    issues: 5,
    lastChecked: '15 mins ago'
  }
]

export function HygieneComplianceStatus() {
  const overallScore = Math.round(
    hygieneData.reduce((acc, item) => acc + item.score, 0) / hygieneData.length
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Hygiene Compliance Status
          </CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{overallScore}%</div>
            <div className="text-xs text-gray-500">Overall Score</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hygieneData.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.status)}
                  <span className="text-sm font-medium text-gray-900">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {item.score}%
                  </span>
                  <Badge variant={item.status === 'compliant' ? 'compliant' : 
                                  item.status === 'warning' ? 'pending' : 'critical'}
                          className="text-xs">
                    {item.status}
                  </Badge>
                </div>
              </div>
              
              <Progress value={item.score} className="h-2" />
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.issues} issues found</span>
                <span>Last checked: {item.lastChecked}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Quick Actions</span>
            <div className="space-x-2">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View Full Report
              </button>
              <span className="text-gray-400">•</span>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Schedule Inspection
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
