import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (!userId) {
      return sendError("User ID is required", ERROR_CODES.MISSING_FIELD, 400);
    }

    const where: Record<string, unknown> = { userId };
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                unit: true,
                imageUrl: true,
                supplier: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return sendSuccess(
      orders,
      `Successfully fetched ${orders.length} orders`,
      200
    );
  } catch (error) {
    return sendError(
      "Failed to fetch orders",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, items, deliveryDate, notes } = body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return sendError(
        "Missing required fields: userId or items array",
        ERROR_CODES.MISSING_FIELD,
        400
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return sendError("User not found", ERROR_CODES.USER_NOT_FOUND, 404);
    }

    let totalAmount = 0;
    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return sendError(
          "Each item must have productId and quantity",
          ERROR_CODES.INVALID_INPUT,
          400
        );
      }

      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        return sendError(
          "Quantity must be a positive number",
          ERROR_CODES.INVALID_QUANTITY,
          400
        );
      }

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return sendError(
          `Product with ID ${item.productId} not found`,
          ERROR_CODES.PRODUCT_NOT_FOUND,
          404
        );
      }

      if (!product.inStock) {
        return sendError(
          `Product "${product.name}" is currently out of stock`,
          ERROR_CODES.PRODUCT_OUT_OF_STOCK,
          400,
          { productId: product.id, productName: product.name }
        );
      }

      totalAmount += product.price * item.quantity;
    }

    const orderCount = await prisma.order.count();
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(3, "0")}`;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          totalAmount,
          deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
          notes,
          status: "PENDING",
        },
      });

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product!.price,
          },
        });
      }

      return await tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  unit: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });
    });

    return sendSuccess(order, "Order created successfully", 201);
  } catch (error) {
    return sendError(
      "Failed to create order",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
