'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  QrCode, 
  Calendar, 
  MapPin, 
  User, 
  ArrowLeft,
  Download,
  Edit,
  Trash2,
  Plus,
  Clock
} from 'lucide-react';

interface Batch {
  id: string;
  batchNumber: string;
  product: {
    id: string;
    name: string;
    category: string;
    supplier: {
      id: string;
      name: string;
      email: string;
    }
  };
  supplierId: string;
  manufacturingDate: string;
  expiryDate: string;
  storageConditions?: string;
  quantity: number;
  unit: string;
  currentLocation?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'RECALLED' | 'DISPOSED';
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
  movements: Array<{
    id: string;
    fromLocation?: string;
    toLocation: string;
    quantity: number;
    unit: string;
    movementType: string;
    notes?: string;
    createdAt: string;
  }>;
}

export default function BatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchBatch(params.id as string);
    }
  }, [params.id]);

  const fetchBatch = async (batchId: string) => {
    try {
      const response = await fetch(`/api/batches/${batchId}`);
      if (response.ok) {
        const data = await response.json();
        setBatch(data);
      }
    } catch (error) {
      console.error('Error fetching batch:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'EXPIRED':
        return <Badge variant="destructive">Expired</Badge>;
      case 'RECALLED':
        return <Badge variant="critical">Recalled</Badge>;
      case 'DISPOSED':
        return <Badge variant="secondary">Disposed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMovementTypeBadge = (type: string) => {
    switch (type) {
      case 'RECEIVED':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Received</Badge>;
      case 'TRANSFERRED':
        return <Badge variant="outline">Transferred</Badge>;
      case 'USED':
        return <Badge variant="secondary">Used</Badge>;
      case 'DISPOSED':
        return <Badge variant="destructive">Disposed</Badge>;
      case 'RECALLED':
        return <Badge variant="critical">Recalled</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const downloadQRCode = () => {
    if (batch?.qrCodeUrl) {
      const link = document.createElement('a');
      link.href = batch.qrCodeUrl;
      link.download = `${batch.batchNumber}-qrcode.png`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Batch Not Found</h2>
          <p className="text-gray-600 mb-4">The batch you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Batch {batch.batchNumber}</h1>
              <p className="text-gray-600">{batch.product.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(batch.status)}
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Product Name</p>
                    <p className="text-lg font-semibold">{batch.product.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="text-lg font-semibold">{batch.product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Quantity</p>
                    <p className="text-lg font-semibold">{batch.quantity} {batch.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current Location</p>
                    <p className="text-lg font-semibold">{batch.currentLocation || 'N/A'}</p>
                  </div>
                </div>
                
                {batch.storageConditions && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Storage Conditions</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                      {batch.storageConditions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Movement History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Movement History
                  </span>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Movement
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {batch.movements.length > 0 ? (
                  <div className="space-y-3">
                    {batch.movements.map((movement) => (
                      <div key={movement.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          {getMovementTypeBadge(movement.movementType)}
                          <div>
                            <p className="font-medium">
                              {movement.fromLocation ? `${movement.fromLocation} → ${movement.toLocation}` : `→ ${movement.toLocation}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {movement.quantity} {movement.unit} • {new Date(movement.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {movement.notes && (
                          <p className="text-sm text-gray-600 max-w-xs">{movement.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No movements recorded yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Supplier Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Supplier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="font-semibold">{batch.product.supplier.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="font-semibold">{batch.product.supplier.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Date Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Manufacturing Date</p>
                  <p className="font-semibold">{new Date(batch.manufacturingDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Expiry Date</p>
                  <p className="font-semibold">{new Date(batch.expiryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="font-semibold">{new Date(batch.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                {batch.qrCodeUrl ? (
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <img 
                        src={batch.qrCodeUrl} 
                        alt={`QR Code for ${batch.batchNumber}`}
                        className="w-32 h-32 border rounded-md"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={downloadQRCode}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setShowQR(!showQR)}
                      >
                        {showQR ? 'Hide' : 'Show'} Details
                      </Button>
                    </div>
                    {showQR && (
                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <p>QR contains batch information for tracking</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">QR Code not generated</p>
                    <Button size="sm" className="mt-2">
                      Generate QR Code
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
