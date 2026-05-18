import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: z.string().optional(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  JWT_SECRET: z.string().min(16).optional(),
  RECOMMENDATION_SAVINGS_TARGET_PERCENT: z.coerce.number().positive().default(20),
  RECOMMENDATION_DAILY_SAFETY_BUFFER_PERCENT: z.coerce.number().min(0).max(100).default(15),
  RECOMMENDATION_WEEKEND_MULTIPLIER: z.coerce.number().positive().default(1.1),
  RECOMMENDATION_HOLIDAY_MULTIPLIER: z.coerce.number().positive().default(1.25),
  RECOMMENDATION_OVESPEND_WARNING_PERCENT: z.coerce.number().positive().default(10),
  RECOMMENDATION_BEHAVIOR_WINDOW_DAYS: z.coerce.number().int().positive().default(30),
  RECOMMENDATION_HISTORY_LIMIT: z.coerce.number().int().positive().default(30),
  FORECAST_DEFAULT_HORIZON_DAYS: z.coerce.number().int().positive().default(30),
  FORECAST_MAX_HORIZON_DAYS: z.coerce.number().int().positive().default(90),
  FORECAST_SPENDING_TREND_WINDOW_DAYS: z.coerce.number().int().positive().default(14),
  FORECAST_CONSERVATIVE_MULTIPLIER: z.coerce.number().positive().default(0.9),
  FORECAST_BALANCED_MULTIPLIER: z.coerce.number().positive().default(1),
  FORECAST_STRETCH_MULTIPLIER: z.coerce.number().positive().default(1.15),
  FORECAST_SAVINGS_PROJECTION_PERCENT: z.coerce.number().min(0).max(100).default(20),
  FORECAST_ML_SIGNAL_THRESHOLD: z.coerce.number().min(0).max(1).default(0.65),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors;
  throw new Error(`Invalid environment configuration: ${JSON.stringify(errors)}`);
}

export const env = parsed.data;
