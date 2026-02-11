import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateBatchSchema = z.object({
  storageConditions: z.string().optional(),
  currentLocation: z.string().optional(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'RECALLED', 'DISPOSED']).optional(),
  quantity: z.number().positive().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            supplier: true
          }
        },
        movements: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!batch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(batch);
  } catch (error) {
    console.error('Error fetching batch:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batch' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateBatchSchema.parse(body);

    const batch = await prisma.batch.update({
      where: { id },
      data: validatedData,
      include: {
        product: {
          include: {
            supplier: true
          }
        }
      }
    });

    return NextResponse.json(batch);
  } catch (error) {
    console.error('Error updating batch:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update batch' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.batch.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    return NextResponse.json(
      { error: 'Failed to delete batch' },
      { status: 500 }
    );
  }
}
