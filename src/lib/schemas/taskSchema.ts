import { z } from "zod";

// Placeholder schema for the Kalvium assignment template.
// If/when a Task model + API routes are added, this can be expanded and reused.
export const taskSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .optional(),
  completed: z.boolean().optional().default(false),
});

export type TaskInput = z.infer<typeof taskSchema>;
