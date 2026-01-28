import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Package, Eye, Download } from 'lucide-react'

const recentBatches = [
  {
    id: 'BATCH-7845',
    supplier: 'Fresh Foods Ltd',
    kitchen: 'Mumbai Central',
    status: 'in-transit',
    items: 245,
    departure: '08:00 AM',
    arrival: '04:30 PM',
    hygieneScore: 92,
    qrVerified: true
  },
  {
    id: 'BATCH-7844',
    supplier: 'Green Valley Organics',
    kitchen: 'Pune Regional',
    status: 'delivered',
    items: 180,
    departure: '06:30 AM',
    arrival: '02:15 PM',
    hygieneScore: 88,
    qrVerified: true
  },
  {
    id: 'BATCH-7843',
    supplier: 'Metro Supplies',
    kitchen: 'Nagpur Central',
    status: 'processing',
    items: 320,
    departure: '09:00 AM',
    arrival: '05:45 PM',
    hygieneScore: 76,
    qrVerified: false
  },
  {
    id: 'BATCH-7842',
    supplier: 'Premium Foods Co',
    kitchen: 'Delhi Main',
    status: 'delivered',
    items: 410,
    departure: '05:00 AM',
    arrival: '01:30 PM',
    hygieneScore: 95,
    qrVerified: true
  },
  {
    id: 'BATCH-7841',
    supplier: 'Quality Provisions',
    kitchen: 'Chennai Central',
    status: 'delayed',
    items: 195,
    departure: '07:30 AM',
    arrival: '03:00 PM',
    hygieneScore: 68,
    qrVerified: false
  }
]

export function RecentBatches() {
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
      default:
        return <Badge variant="default" className="text-xs">{status}</Badge>
    }
  }

  const getHygieneColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Batches
          </CardTitle>
          <Button variant="outline" size="sm" className="text-xs">
            <Package className="w-4 h-4 mr-2" />
            View All Batches
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch ID</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Kitchen</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Hygiene</TableHead>
              <TableHead>QR</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBatches.map((batch) => (
              <TableRow key={batch.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-sm">{batch.id}</TableCell>
                <TableCell className="text-sm text-gray-600">{batch.supplier}</TableCell>
                <TableCell className="text-sm text-gray-600">{batch.kitchen}</TableCell>
                <TableCell>{getStatusBadge(batch.status)}</TableCell>
                <TableCell className="text-sm text-gray-900">{batch.items}</TableCell>
                <TableCell>
                  <span className={`text-sm font-medium ${getHygieneColor(batch.hygieneScore)}`}>
                    {batch.hygieneScore}%
                  </span>
                </TableCell>
                <TableCell>
                  {batch.qrVerified ? (
                    <Badge variant="compliant" className="text-xs">✓ Verified</Badge>
                  ) : (
                    <Badge variant="critical" className="text-xs">✗ Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4 text-gray-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Showing 5 of 127 active batches</span>
            <Button variant="link" className="text-blue-600 p-0 text-sm">
              View All Batches →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
