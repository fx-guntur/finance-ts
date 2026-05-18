import { z } from "zod";

export const salaryParamsSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export const salaryUpsertSchema = z.object({
  monthlySalary: z.coerce.number().positive("monthlySalary must be greater than zero"),
  currency: z.literal("IDR"),
  paydayDay: z.coerce.number().int().min(1).max(31),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "effectiveFrom must be a YYYY-MM-DD date"),
  effectiveTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "effectiveTo must be a YYYY-MM-DD date")
    .optional()
    .or(z.literal("")),
  isActive: z.coerce.boolean().default(true),
});

export type SalaryParamsInput = z.infer<typeof salaryParamsSchema>;
export type SalaryUpsertInputShape = z.infer<typeof salaryUpsertSchema>;
