import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .optional(),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
  imageUrl: z.string().url("imageUrl must be a valid URL").optional(),
  inStock: z.boolean().optional().default(true),
  supplierId: z.string().uuid("Invalid supplierId"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
