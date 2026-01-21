import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().uuid("Invalid productId"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be a positive number"),
});

export const createOrderSchema = z.object({
  userId: z.string().uuid("Invalid userId"),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  deliveryDate: z
    .string()
    .datetime("deliveryDate must be an ISO datetime")
    .optional(),
  notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
