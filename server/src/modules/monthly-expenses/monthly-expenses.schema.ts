import { z } from "zod";

export const monthlyExpenseParamsSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export const monthlyExpenseIdParamsSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  expenseId: z.string().min(1, "expenseId is required"),
});

export const monthlyExpenseUpsertSchema = z.object({
  categoryId: z.string().min(1, "categoryId is required"),
  title: z.string().min(2, "title is required"),
  amount: z.coerce.number().positive("amount must be greater than zero"),
  dueDay: z.coerce.number().int().min(1).max(31),
  isMandatory: z.coerce.boolean().default(true),
  billingCycle: z.string().min(1).default("monthly"),
  notes: z.string().optional().nullable(),
  isActive: z.coerce.boolean().default(true),
});

export type MonthlyExpenseParamsInput = z.infer<typeof monthlyExpenseParamsSchema>;
export type MonthlyExpenseIdParamsInput = z.infer<typeof monthlyExpenseIdParamsSchema>;
export type MonthlyExpenseUpsertInputShape = z.infer<typeof monthlyExpenseUpsertSchema>;
