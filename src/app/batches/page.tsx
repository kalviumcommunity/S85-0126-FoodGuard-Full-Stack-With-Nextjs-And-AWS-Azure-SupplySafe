"use client"

import { useState } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Package,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  MapPin,
  User,
  Thermometer,
  QrCode,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  Train
} from 'lucide-react'

const batchesData = [
  {
    id: 'BATCH-7845',
    supplier: 'Fresh Foods Ltd',
    kitchen: 'Mumbai Central',
    status: 'in-transit',
    priority: 'high',
    items: 245,
    departure: '2024-01-27 08:00 AM',
    arrival: '2024-01-27 04:30 PM',
    route: 'Mumbai to Pune',
    hygieneScore: 92,
    temperature: '8°C',
    qrVerified: true,
    responsible: 'Amit Singh',
    trainNumber: '12123',
    lastUpdated: '2 hours ago'
  },
  {
    id: 'BATCH-7844',
    supplier: 'Green Valley Organics',
    kitchen: 'Pune Regional',
    status: 'delivered',
    priority: 'medium',
    items: 180,
    departure: '2024-01-27 06:30 AM',
    arrival: '2024-01-27 02:15 PM',
    route: 'Pune to Nagpur',
    hygieneScore: 88,
    temperature: '12°C',
    qrVerified: true,
    responsible: 'Priya Sharma',
    trainNumber: '12124',
    lastUpdated: '4 hours ago'
  },
  {
    id: 'BATCH-7843',
    supplier: 'Metro Supplies',
    kitchen: 'Nagpur Central',
    status: 'processing',
    priority: 'high',
    items: 320,
    departure: '2024-01-27 09:00 AM',
    arrival: '2024-01-27 05:45 PM',
    route: 'Nagpur to Delhi',
    hygieneScore: 76,
    temperature: '6°C',
    qrVerified: false,
    responsible: 'Raj Kumar',
    trainNumber: '12125',
    lastUpdated: '30 mins ago'
  },
  {
    id: 'BATCH-7842',
    supplier: 'Premium Foods Co',
    kitchen: 'Delhi Main',
    status: 'delivered',
    priority: 'low',
    items: 410,
    departure: '2024-01-27 05:00 AM',
    arrival: '2024-01-27 01:30 PM',
    route: 'Delhi to Jaipur',
    hygieneScore: 95,
    temperature: '4°C',
    qrVerified: true,
    responsible: 'Suresh Kumar',
    trainNumber: '12126',
    lastUpdated: '6 hours ago'
  },
  {
    id: 'BATCH-7841',
    supplier: 'Quality Provisions',
    kitchen: 'Chennai Central',
    status: 'delayed',
    priority: 'critical',
    items: 195,
    departure: '2024-01-27 07:30 AM',
    arrival: '2024-01-27 03:00 PM',
    route: 'Chennai to Bangalore',
    hygieneScore: 68,
    temperature: '10°C',
    qrVerified: false,
    responsible: 'Anita Desai',
    trainNumber: '12127',
    lastUpdated: '1 hour ago'
  },
  {
    id: 'BATCH-7840',
    supplier: 'Royal Catering',
    kitchen: 'Kolkata Central',
    status: 'scheduled',
    priority: 'medium',
    items: 275,
    departure: '2024-01-27 11:00 AM',
    arrival: '2024-01-27 07:00 PM',
    route: 'Kolkata to Bhubaneswar',
    hygieneScore: 85,
    temperature: '7°C',
    qrVerified: true,
    responsible: 'Vikram Mehta',
    trainNumber: '12128',
    lastUpdated: '3 hours ago'
  }
]

export default function BatchesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="compliant" className="text-xs">Delivered</Badge>
      case 'in-transit':
        return <Badge variant="pending" className="text-xs">In Transit</Badge>
      case 'processing':
        return <Badge variant="secondary" className="text-xs">Processing</Badge>
      case 'delayed':
        return <Badge variant="critical" className="text-xs">Delayed</Badge>
      case 'scheduled':
        return <Badge variant="outline" className="text-xs">Scheduled</Badge>
      default:
        return <Badge variant="default" className="text-xs">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="critical" className="text-xs">Critical</Badge>
      case 'high':
        return <Badge variant="pending" className="text-xs">High</Badge>
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium</Badge>
      case 'low':
        return <Badge variant="outline" className="text-xs">Low</Badge>
      default:
        return <Badge variant="default" className="text-xs">{priority}</Badge>
    }
  }

  const getHygieneColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-amber-600'
    return 'text-red-600'
  }

  const getTemperatureColor = (temp: string) => {
    const tempNum = parseInt(temp)
    if (tempNum <= 5) return 'text-blue-600'
    if (tempNum <= 10) return 'text-green-600'
    if (tempNum <= 15) return 'text-amber-600'
    return 'text-red-600'
  }

  const filteredBatches = batchesData.filter(batch => {
    const matchesSearch = batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.kitchen.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || batch.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || batch.priority === selectedPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Food Batches</h1>
            <p className="text-gray-600 mt-1">Manage and track food batches across the supply chain</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Batch
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Batches</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Transit</p>
                  <p className="text-2xl font-bold text-gray-900">127</p>
                </div>
                <Truck className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered Today</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delayed</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by batch ID, supplier, or kitchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="delivered">Delivered</option>
                  <option value="in-transit">In Transit</option>
                  <option value="processing">Processing</option>
                  <option value="delayed">Delayed</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
                
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Batches Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Batches ({filteredBatches.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Kitchen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Hygiene</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>QR</TableHead>
                    <TableHead>Responsible</TableHead>
                    <TableHead>Train</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.map((batch) => (
                    <TableRow key={batch.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{batch.id}</TableCell>
                      <TableCell className="text-sm text-gray-600">{batch.supplier}</TableCell>
                      <TableCell className="text-sm text-gray-600">{batch.kitchen}</TableCell>
                      <TableCell>{getStatusBadge(batch.status)}</TableCell>
                      <TableCell>{getPriorityBadge(batch.priority)}</TableCell>
                      <TableCell className="text-sm text-gray-900">{batch.items}</TableCell>
                      <TableCell className="text-sm text-gray-600">{batch.route}</TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${getHygieneColor(batch.hygieneScore)}`}>
                          {batch.hygieneScore}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${getTemperatureColor(batch.temperature)}`}>
                          {batch.temperature}
                        </span>
                      </TableCell>
                      <TableCell>
                        {batch.qrVerified ? (
                          <Badge variant="compliant" className="text-xs">✓</Badge>
                        ) : (
                          <Badge variant="critical" className="text-xs">✗</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{batch.responsible}</TableCell>
                      <TableCell className="text-sm text-gray-600">{batch.trainNumber}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Showing {filteredBatches.length} of {batchesData.length} batches
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Plus className="w-6 h-6" />
                <span className="text-sm">Create New Batch</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <QrCode className="w-6 h-6" />
                <span className="text-sm">Generate QR Codes</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Download className="w-6 h-6" />
                <span className="text-sm">Export Reports</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Shield className="w-6 h-6" />
                <span className="text-sm">Quality Check</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
