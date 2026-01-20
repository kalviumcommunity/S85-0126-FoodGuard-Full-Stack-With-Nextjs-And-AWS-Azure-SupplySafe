import { prisma } from "@/lib/prisma";

export async function createOrderTransaction(
  userId: string,
  productId: string,
  quantity: number,
  price: number
) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount: price * quantity,
        orderNumber: `ORD-${Date.now()}`,
        orderItems: {
          create: {
            productId,
            quantity,
            price,
          },
        },
      },
    });

    return order;
  });
}
