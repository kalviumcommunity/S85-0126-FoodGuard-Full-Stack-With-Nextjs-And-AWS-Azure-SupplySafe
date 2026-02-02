import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, XCircle } from 'lucide-react'

const alerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Temperature Violation - Storage Unit A3',
    description: 'Temperature exceeded safe limits for dairy products',
    location: 'Mumbai Central Kitchen',
    time: '15 mins ago',
    status: 'open',
    assignedTo: 'Maintenance Team'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Hygiene Score Drop - Kitchen B2',
    description: 'Hygiene compliance fell below 80% threshold',
    location: 'Pune Regional Kitchen',
    time: '1 hour ago',
    status: 'investigating',
    assignedTo: 'Quality Inspector'
  },
  {
    id: 3,
    type: 'info',
    title: 'Scheduled Maintenance - Equipment C1',
    description: 'Routine maintenance scheduled for refrigeration unit',
    location: 'Nagpur Kitchen',
    time: '2 hours ago',
    status: 'scheduled',
    assignedTo: 'Facility Manager'
  },
  {
    id: 4,
    type: 'critical',
    title: 'QR Verification Failed - Batch #7845',
    description: 'Food batch QR code could not be verified at checkpoint',
    location: 'Transport Hub - Mumbai',
    time: '3 hours ago',
    status: 'resolved',
    assignedTo: 'IT Support'
  }
]

export function AlertsViolations() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />
      case 'info':
        return <Clock className="w-5 h-5 text-blue-600" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="critical" className="text-xs">Open</Badge>
      case 'investigating':
        return <Badge variant="pending" className="text-xs">Investigating</Badge>
      case 'scheduled':
        return <Badge variant="secondary" className="text-xs">Scheduled</Badge>
      case 'resolved':
        return <Badge variant="compliant" className="text-xs">Resolved</Badge>
      default:
        return <Badge variant="default" className="text-xs">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Alerts & Violations
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="critical" className="text-xs">2 Critical</Badge>
            <Badge variant="pending" className="text-xs">1 Warning</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="border-l-4 border-gray-200 pl-4 py-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>📍 {alert.location}</span>
                      <span>🕐 {alert.time}</span>
                      <span>👤 {alert.assignedTo}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getStatusBadge(alert.status)}
                  {alert.status === 'open' && (
                    <Button variant="outline" size="sm" className="text-xs">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">4 active alerts</span>
            <Button variant="link" className="text-sm text-blue-600 p-0">
              View All Alerts →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
