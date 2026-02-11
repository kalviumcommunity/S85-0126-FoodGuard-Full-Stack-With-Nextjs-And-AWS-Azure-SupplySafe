import { NextRequest, NextResponse } from 'next/server';

// Mock suppliers data
const mockSuppliers = [
  {
    id: '1',
    name: 'Fresh Farms Ltd',
    email: 'contact@freshfarms.com',
  },
  {
    id: '2',
    name: 'Ocean Harvest Co',
    email: 'info@oceanharvest.com',
  },
  {
    id: '3',
    name: 'Green Valley Organics',
    email: 'hello@greenvalley.com',
  },
  {
    id: '4',
    name: 'Premium Meats Inc',
    email: 'orders@premiummeats.com',
  },
  {
    id: '5',
    name: 'Golden Grains Co',
    email: 'sales@goldengrains.com',
  },
];

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Simple suppliers API called');
    
    return NextResponse.json({
      suppliers: mockSuppliers,
      total: mockSuppliers.length
    });
  } catch (error) {
    console.error('❌ Error in simple suppliers API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    );
  }
}
