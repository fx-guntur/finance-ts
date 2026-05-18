import { z } from "zod";

export const dailyExpenseParamsSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export const dailyExpenseIdParamsSchema = dailyExpenseParamsSchema.extend({
  expenseId: z.string().min(1, "expenseId is required"),
});

export const dailyExpenseQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be a YYYY-MM-DD date")
    .optional(),
});

export const dailyExpenseUpsertSchema = z.object({
  categoryId: z.string().min(1, "categoryId is required"),
  amount: z.coerce.number().positive("amount must be greater than zero"),
  spentAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "spentAt must be a YYYY-MM-DD date"),
  merchantName: z.string().max(120).optional().nullable().or(z.literal("")),
  note: z.string().max(500).optional().nullable().or(z.literal("")),
});

export type DailyExpenseParamsInput = z.infer<typeof dailyExpenseParamsSchema>;
export type DailyExpenseIdParamsInput = z.infer<typeof dailyExpenseIdParamsSchema>;
export type DailyExpenseQueryInput = z.infer<typeof dailyExpenseQuerySchema>;
export type DailyExpenseUpsertInputShape = z.infer<typeof dailyExpenseUpsertSchema>;
