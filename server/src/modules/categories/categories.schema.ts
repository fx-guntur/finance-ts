import { z } from "zod";

export const categoryParamsSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(2, "Category name is required"),
  type: z.string().min(2, "Category type is required"),
  color: z.string().optional().nullable(),
  iconKey: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isSystem: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
});

export type CategoryParamsInput = z.infer<typeof categoryParamsSchema>;
export type CategoryCreateInputShape = z.infer<typeof categoryCreateSchema>;
