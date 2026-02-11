import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import QRCode from "qrcode";

const createBatchSchema = z.object({
  productId: z.string(),
  supplierId: z.string(),
  manufacturingDate: z.string(),
  expiryDate: z.string(),
  storageConditions: z.string().optional(),
  quantity: z.number().positive(),
  unit: z.string(),
  currentLocation: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const supplierId = searchParams.get("supplierId");
    const productId = searchParams.get("productId");

    const where: any = {};
    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;
    if (productId) where.productId = productId;

    const [batches, total] = await Promise.all([
      prisma.batch.findMany({
        where,
        include: {
          product: {
            include: {
              supplier: true,
            },
          },
          movements: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.batch.count({ where }),
    ]);

    return NextResponse.json({
      batches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createBatchSchema.parse(body);

    // Generate unique batch number
    const batchCount = await prisma.batch.count();
    const batchNumber = `B${String(batchCount + 1).padStart(4, "0")}`;

    // Generate QR Code
    const qrData = JSON.stringify({
      batchNumber,
      productId: validatedData.productId,
      supplierId: validatedData.supplierId,
      manufacturingDate: validatedData.manufacturingDate,
      expiryDate: validatedData.expiryDate,
    });

    const qrCodeUrl = await QRCode.toDataURL(qrData);

    const batch = await prisma.batch.create({
      data: {
        batchNumber,
        productId: validatedData.productId,
        supplierId: validatedData.supplierId,
        manufacturingDate: new Date(validatedData.manufacturingDate),
        expiryDate: new Date(validatedData.expiryDate),
        storageConditions: validatedData.storageConditions,
        quantity: validatedData.quantity,
        unit: validatedData.unit,
        currentLocation: validatedData.currentLocation || "Warehouse",
        qrCodeUrl,
      },
      include: {
        product: {
          include: {
            supplier: true,
          },
        },
      },
    });

    // Create initial movement record
    await prisma.batchMovement.create({
      data: {
        batchId: batch.id,
        toLocation: batch.currentLocation,
        quantity: batch.quantity,
        unit: batch.unit,
        movementType: "RECEIVED",
        notes: "Batch created and received",
      },
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error("Error creating batch:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create batch" },
      { status: 500 }
    );
  }
}
