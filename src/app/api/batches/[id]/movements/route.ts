import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createMovementSchema = z.object({
  fromLocation: z.string().optional(),
  toLocation: z.string(),
  quantity: z.number().positive(),
  unit: z.string(),
  movementType: z.enum(['RECEIVED', 'TRANSFERRED', 'USED', 'DISPOSED', 'RECALLED']),
  notes: z.string().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movements = await prisma.batchMovement.findMany({
      where: { batchId: id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(movements);
  } catch (error) {
    console.error('Error fetching movements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movements' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = createMovementSchema.parse(body);

    // Verify batch exists
    const batch = await prisma.batch.findUnique({
      where: { id }
    });

    if (!batch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      );
    }

    // Create movement record
    const movement = await prisma.batchMovement.create({
      data: {
        batchId: id,
        ...validatedData
      }
    });

    // Update batch current location and quantity if needed
    const updateData: any = {};
    if (validatedData.toLocation) {
      updateData.currentLocation = validatedData.toLocation;
    }
    
    // Update quantity for USED, DISPOSED movements
    if (validatedData.movementType === 'USED' || validatedData.movementType === 'DISPOSED') {
      updateData.quantity = batch.quantity - validatedData.quantity;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.batch.update({
        where: { id },
        data: updateData
      });
    }

    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    console.error('Error creating movement:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create movement' },
      { status: 500 }
    );
  }
}
