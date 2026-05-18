import { z } from "zod";

export const forecastParamsSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export const forecastQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be a YYYY-MM-DD date")
    .optional(),
  horizonDays: z.coerce.number().int().min(1).max(90).optional(),
});

export type ForecastParamsInput = z.infer<typeof forecastParamsSchema>;
export type ForecastQueryInput = z.infer<typeof forecastQuerySchema>;
