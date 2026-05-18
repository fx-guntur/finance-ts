import { z } from "zod";

export const recommendationParamsSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export const recommendationQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be a YYYY-MM-DD date")
    .optional(),
  holidayDates: z.string().optional(),
});

export type RecommendationParamsInput = z.infer<typeof recommendationParamsSchema>;
export type RecommendationQueryInput = z.infer<typeof recommendationQuerySchema>;
