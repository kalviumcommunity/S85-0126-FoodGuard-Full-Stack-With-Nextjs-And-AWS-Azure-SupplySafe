import { NextRequest, NextResponse } from 'next/server';

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Organic Tomatoes',
    category: 'Vegetables',
    unit: 'lb',
    supplier: {
      id: '1',
      name: 'Fresh Farms Ltd',
    },
  },
  {
    id: '2',
    name: 'Premium Salmon',
    category: 'Seafood',
    unit: 'lb',
    supplier: {
      id: '2',
      name: 'Ocean Harvest Co',
    },
  },
  {
    id: '3',
    name: 'Free Range Eggs',
    category: 'Dairy',
    unit: 'dozen',
    supplier: {
      id: '1',
      name: 'Fresh Farms Ltd',
    },
  },
  {
    id: '4',
    name: 'Fresh Spinach',
    category: 'Vegetables',
    unit: 'lb',
    supplier: {
      id: '1',
      name: 'Fresh Farms Ltd',
    },
  },
  {
    id: '5',
    name: 'Jumbo Shrimp',
    category: 'Seafood',
    unit: 'lb',
    supplier: {
      id: '2',
      name: 'Ocean Harvest Co',
    },
  },
  {
    id: '6',
    name: 'Whole Milk',
    category: 'Dairy',
    unit: 'gallon',
    supplier: {
      id: '3',
      name: 'Green Valley Organics',
    },
  },
  {
    id: '7',
    name: 'Chicken Breast',
    category: 'Meat',
    unit: 'lb',
    supplier: {
      id: '4',
      name: 'Premium Meats Inc',
    },
  },
  {
    id: '8',
    name: 'Basmati Rice',
    category: 'Grains',
    unit: 'kg',
    supplier: {
      id: '5',
      name: 'Golden Grains Co',
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplierId');
    
    console.log('🔍 Simple products API called');
    console.log('👤 Supplier ID filter:', supplierId);
    
    let filteredProducts = mockProducts;
    
    // Filter by supplier if specified
    if (supplierId) {
      filteredProducts = mockProducts.filter(product => product.supplier.id === supplierId);
      console.log('📦 Filtered products for supplier:', filteredProducts.length);
    } else {
      console.log('📦 All products:', filteredProducts.length);
    }
    
    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length
    });
  } catch (error) {
    console.error('❌ Error in simple products API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
