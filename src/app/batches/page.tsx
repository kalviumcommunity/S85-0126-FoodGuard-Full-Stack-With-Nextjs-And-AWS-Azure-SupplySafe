"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { canCreateBatch } from '@/lib/batch-auth'
import {
  Package,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  QrCode,
  Shield,
  AlertTriangle,
  CheckCircle,
  Truck,
  Loader2
} from 'lucide-react'

interface Batch {
  id: string
  batchNumber: string
  product: {
    id: string
    name: string
    category: string
    supplier: {
      id: string
      name: string
    }
  }
  supplierId: string
  manufacturingDate: string
  expiryDate: string
  storageConditions?: string
  quantity: number
  unit: string
  currentLocation?: string
  status: 'ACTIVE' | 'EXPIRED' | 'RECALLED' | 'DISPOSED'
  qrCodeUrl?: string
  createdAt: string
  updatedAt: string
  movements: Array<{
    id: string
    fromLocation?: string
    toLocation: string
    quantity: number
    unit: string
    movementType: string
    notes?: string
    createdAt: string
  }>
}

export default function BatchesPage() {
  const router = useRouter()
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    fetchBatches()
  }, [searchTerm, selectedStatus])

  const fetchBatches = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      
      const response = await fetch(`/api/batches?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setBatches(data.batches || [])
      }
    } catch (error) {
      console.error('Error fetching batches:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="text-xs bg-green-100 text-green-800">Active</Badge>
      case 'EXPIRED':
        return <Badge variant="destructive" className="text-xs">Expired</Badge>
      case 'RECALLED':
        return <Badge variant="critical" className="text-xs">Recalled</Badge>
      case 'DISPOSED':
        return <Badge variant="secondary" className="text-xs">Disposed</Badge>
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>
    }
  }


  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.product.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || batch.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const handleViewBatch = (batchId: string) => {
    router.push(`/batches/${batchId}`)
  }

  const handleCreateBatch = () => {
    if (canCreateBatch()) {
      router.push('/batches/create')
    } else {
      alert('You do not have permission to create batches. Please contact your administrator.')
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Food Batches</h1>
            <p className="text-gray-600 mt-1">Manage and track food batches across the supply chain</p>
          </div>
          <Button onClick={handleCreateBatch}>
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
                  <p className="text-2xl font-bold text-gray-900">{batches.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{batches.filter(b => b.status === 'ACTIVE').length}</p>
                </div>
                <Truck className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {batches.filter(b => {
                      const expiry = new Date(b.expiryDate);
                      const today = new Date();
                      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                    }).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-gray-900">{batches.filter(b => b.status === 'EXPIRED').length}</p>
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
                    placeholder="Search by batch ID, product, or supplier..."
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
                  style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d1d5db' }}
                >
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="RECALLED">Recalled</option>
                  <option value="DISPOSED">Disposed</option>
                </select>
                
                <Button 
                  variant="outline"
                  style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d1d5db' }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
                
                <Button 
                  variant="outline"
                  style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d1d5db' }}
                >
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
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Manufacturing Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>QR Code</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.map((batch) => (
                    <TableRow key={batch.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                      <TableCell className="text-sm text-gray-600">{batch.product.name}</TableCell>
                      <TableCell className="text-sm text-gray-600">{batch.product.supplier.name}</TableCell>
                      <TableCell>{getStatusBadge(batch.status)}</TableCell>
                      <TableCell className="text-sm text-gray-900">{batch.quantity} {batch.unit}</TableCell>
                      <TableCell className="text-sm text-gray-600">{batch.currentLocation || 'N/A'}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(batch.manufacturingDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(batch.expiryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {batch.qrCodeUrl ? (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800">✓ Generated</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Not Generated</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleViewBatch(batch.id)}
                          >
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
                  Showing {filteredBatches.length} of {batches.length} batches
                </span>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled
                    style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d1d5db' }}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d1d5db' }}
                  >
                    1
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d1d5db' }}
                  >
                    2
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d1d5db' }}
                  >
                    3
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d1d5db' }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#000', fontWeight: 'bold', fontSize: '1.125rem' }}>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={handleCreateBatch}
                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d1d5db' }}
              >
                <Plus className="w-6 h-6" />
                <span className="text-sm" style={{ color: '#000' }}>Create New Batch</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => alert('QR Code generation coming soon!')}
                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d1d5db' }}
              >
                <QrCode className="w-6 h-6" />
                <span className="text-sm" style={{ color: '#000' }}>Generate QR Codes</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => alert('Export reports coming soon!')}
                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d1d5db' }}
              >
                <Download className="w-6 h-6" />
                <span className="text-sm" style={{ color: '#000' }}>Export Reports</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => alert('Quality check coming soon!')}
                style={{ color: '#000', backgroundColor: '#fff', borderColor: '#d1d5db' }}
              >
                <Shield className="w-6 h-6" />
                <span className="text-sm" style={{ color: '#000' }}>Quality Check</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
