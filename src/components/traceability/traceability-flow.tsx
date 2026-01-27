"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  ChefHat, 
  Truck, 
  Train, 
  Users, 
  CheckCircle, 
  MapPin,
  Calendar,
  User,
  Thermometer,
  Shield
} from 'lucide-react'

interface TraceabilityStep {
  id: string
  title: string
  icon: any
  status: 'completed' | 'in-progress' | 'pending' | 'failed'
  timestamp: string
  location: string
  responsible: string
  hygieneStatus: 'compliant' | 'warning' | 'critical' | 'pending'
  qrStatus: 'verified' | 'pending' | 'failed'
  temperature?: string
  notes?: string
}

const traceabilityData: TraceabilityStep[] = [
  {
    id: 'supplier',
    title: 'Supplier',
    icon: Package,
    status: 'completed',
    timestamp: '2024-01-27 08:00:00',
    location: 'Fresh Farms, Nashik',
    responsible: 'Raj Kumar - Supplier Manager',
    hygieneStatus: 'compliant',
    qrStatus: 'verified',
    temperature: '4°C',
    notes: 'Fresh vegetables loaded and inspected'
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    icon: ChefHat,
    status: 'completed',
    timestamp: '2024-01-27 10:30:00',
    location: 'Central Kitchen - Mumbai',
    responsible: 'Priya Sharma - Head Chef',
    hygieneStatus: 'compliant',
    qrStatus: 'verified',
    temperature: '18°C',
    notes: 'Food preparation completed with quality check'
  },
  {
    id: 'transport',
    title: 'Transport',
    icon: Truck,
    status: 'in-progress',
    timestamp: '2024-01-27 14:00:00',
    location: 'Mumbai to Pune Route',
    responsible: 'Amit Singh - Transport Lead',
    hygieneStatus: 'pending',
    qrStatus: 'pending',
    temperature: '8°C',
    notes: 'Vehicle temperature monitoring active'
  },
  {
    id: 'train',
    title: 'Train',
    icon: Train,
    status: 'pending',
    timestamp: '2024-01-27 16:30:00',
    location: 'Train 12123 - Pune Express',
    responsible: 'Suresh Kumar - Train Manager',
    hygieneStatus: 'pending',
    qrStatus: 'pending',
    temperature: '12°C',
    notes: 'Awaiting arrival at transport hub'
  },
  {
    id: 'passenger',
    title: 'Passenger',
    icon: Users,
    status: 'pending',
    timestamp: '2024-01-27 18:00:00',
    location: 'Coach A2 - Seat 45',
    responsible: 'Service Staff',
    hygieneStatus: 'pending',
    qrStatus: 'pending',
    temperature: '15°C',
    notes: 'Final delivery point'
  }
]

export function TraceabilityFlow() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="compliant" className="text-xs">Completed</Badge>
      case 'in-progress':
        return <Badge variant="pending" className="text-xs">In Progress</Badge>
      case 'failed':
        return <Badge variant="critical" className="text-xs">Failed</Badge>
      default:
        return <Badge variant="default" className="text-xs">Pending</Badge>
    }
  }

  const getHygieneBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge variant="compliant" className="text-xs">Compliant</Badge>
      case 'warning':
        return <Badge variant="pending" className="text-xs">Warning</Badge>
      case 'critical':
        return <Badge variant="critical" className="text-xs">Critical</Badge>
      default:
        return <Badge variant="default" className="text-xs">Pending</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Food Traceability Flow
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">Batch ID: #7845</Badge>
              <Badge variant="outline" className="text-xs">Real-time Tracking</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Horizontal Flow */}
      <div className="relative">
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200"></div>
        <div className="relative flex justify-between">
          {traceabilityData.map((step) => {
            const Icon = step.icon
            const isActive = step.status === 'in-progress'
            const isCompleted = step.status === 'completed'
            
            return (
              <div key={step.id} className="flex flex-col items-center space-y-4">
                <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                  isCompleted ? 'bg-green-100 border-green-300' :
                  isActive ? 'bg-amber-100 border-amber-300' :
                  'bg-gray-100 border-gray-300'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isCompleted ? 'text-green-600' :
                    isActive ? 'text-amber-600' :
                    'text-gray-400'
                  }`} />
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-sm text-gray-900">{step.title}</h3>
                  {getStatusBadge(step.status)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {traceabilityData.map((step) => {
          const Icon = step.icon
          const isCompleted = step.status === 'completed'
          const isActive = step.status === 'in-progress'
          
          return (
            <Card key={step.id} className={`${
              isActive ? 'border-amber-200 bg-amber-50' :
              isCompleted ? 'border-green-200 bg-green-50' :
              'border-gray-200'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                    isCompleted ? 'bg-green-100' :
                    isActive ? 'bg-amber-100' :
                    'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isCompleted ? 'text-green-600' :
                      isActive ? 'text-amber-600' :
                      'text-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(step.status)}
                        {isActive && (
                          <Badge variant="secondary" className="text-xs animate-pulse">
                            LIVE
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{step.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{step.timestamp}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{step.responsible}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Hygiene: </span>
                        {getHygieneBadge(step.hygieneStatus)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">QR: </span>
                        <Badge variant={
                          step.qrStatus === 'verified' ? 'compliant' :
                          step.qrStatus === 'failed' ? 'critical' :
                          'default'
                        } className="text-xs">
                          {step.qrStatus}
                        </Badge>
                      </div>
                      
                      {step.temperature && (
                        <div className="flex items-center space-x-2">
                          <Thermometer className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Temp: {step.temperature}</span>
                        </div>
                      )}
                    </div>
                    
                    {step.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">{step.notes}</p>
                      </div>
                    )}
                    
                    {isActive && (
                      <div className="mt-4 flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Download Certificate
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
