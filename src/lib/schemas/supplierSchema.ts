import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  userId: z.string().uuid("Invalid userId"),
  phone: z
    .string()
    .min(7, "Phone must be at least 7 characters long")
    .optional(),
  address: z
    .string()
    .min(3, "Address must be at least 3 characters long")
    .optional(),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .optional(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
