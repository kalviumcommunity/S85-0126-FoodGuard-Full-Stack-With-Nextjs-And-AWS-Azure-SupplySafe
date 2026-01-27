"use client"

import { AppShell } from '@/components/layout/app-shell'
import { EnterpriseTable } from '@/components/tables/enterprise-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Sample data for food batches
const batchesData = [
  {
    id: 'B7845',
    name: 'Vegetable Pack - Mumbai Route',
    supplier: 'Fresh Farms',
    quantity: 250,
    status: 'in-transit',
    departure: '2024-01-27 08:00',
    arrival: '2024-01-27 18:00',
    temperature: '4°C',
    hygieneScore: 92,
    qrVerified: true
  },
  {
    id: 'B7846',
    name: 'Dairy Products - Pune Route',
    supplier: 'Amul Dairy',
    quantity: 180,
    status: 'delivered',
    departure: '2024-01-27 06:00',
    arrival: '2024-01-27 14:00',
    temperature: '2°C',
    hygieneScore: 88,
    qrVerified: true
  },
  {
    id: 'B7847',
    name: 'Bread & Bakery - Delhi Route',
    supplier: 'Modern Bakery',
    quantity: 320,
    status: 'pending',
    departure: '2024-01-27 16:00',
    arrival: '2024-01-28 08:00',
    temperature: '20°C',
    hygieneScore: 95,
    qrVerified: false
  },
  {
    id: 'B7848',
    name: 'Fresh Fruits - Chennai Route',
    supplier: 'Tropical Farms',
    quantity: 150,
    status: 'critical',
    departure: '2024-01-27 10:00',
    arrival: '2024-01-27 20:00',
    temperature: '8°C',
    hygieneScore: 68,
    qrVerified: true
  },
  {
    id: 'B7849',
    name: 'Ready Meals - Kolkata Route',
    supplier: 'Gourmet Kitchen',
    quantity: 200,
    status: 'processing',
    departure: '2024-01-27 12:00',
    arrival: '2024-01-27 22:00',
    temperature: '15°C',
    hygieneScore: 85,
    qrVerified: true
  }
]

const columns = [
  {
    key: 'id',
    label: 'Batch ID',
    sortable: true,
    render: (value: string) => (
      <span className="font-mono text-sm font-medium">{value}</span>
    )
  },
  {
    key: 'name',
    label: 'Description',
    sortable: true
  },
  {
    key: 'supplier',
    label: 'Supplier',
    sortable: true
  },
  {
    key: 'quantity',
    label: 'Quantity',
    sortable: true,
    render: (value: number) => `${value} units`
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true
  },
  {
    key: 'departure',
    label: 'Departure',
    sortable: true
  },
  {
    key: 'arrival',
    label: 'Arrival',
    sortable: true
  },
  {
    key: 'temperature',
    label: 'Temperature',
    sortable: true,
    render: (value: string) => (
      <span className={`font-medium ${
        parseInt(value) <= 4 ? 'text-green-600' :
        parseInt(value) <= 10 ? 'text-amber-600' :
        'text-red-600'
      }`}>{value}</span>
    )
  },
  {
    key: 'hygieneScore',
    label: 'Hygiene Score',
    sortable: true,
    render: (value: number) => (
      <span className={`font-medium ${
        value >= 90 ? 'text-green-600' :
        value >= 75 ? 'text-amber-600' :
        'text-red-600'
      }`}>{value}%</span>
    )
  },
  {
    key: 'qrVerified',
    label: 'QR Status',
    sortable: true,
    render: (value: boolean) => (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value ? 'Verified' : 'Failed'}
      </span>
    )
  }
]

export default function BatchesPage() {
  const handleView = (batch: any) => {
    console.log('View batch:', batch)
    // Navigate to batch details
  }

  const handleEdit = (batch: any) => {
    console.log('Edit batch:', batch)
    // Open edit modal
  }

  const handleDelete = (batch: any) => {
    console.log('Delete batch:', batch)
    // Show delete confirmation
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Food Batches Management
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-600">Total Batches</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-amber-600">1</div>
              <div className="text-sm text-gray-600">In Transit</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">Delivered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-gray-600">Critical Issues</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card>
          <CardContent className="p-6">
            <EnterpriseTable
              data={batchesData}
              columns={columns}
              title="Active Food Batches"
              searchable={true}
              filterable={true}
              paginated={true}
              pageSize={10}
              actions={{
                view: handleView,
                edit: handleEdit,
                delete: handleDelete
              }}
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
