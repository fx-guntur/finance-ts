import { env } from "../../config/env";

export const forecastEngineConfig = {
  engineVersion: "1.0.0",
  defaultHorizonDays: env.FORECAST_DEFAULT_HORIZON_DAYS,
  maxHorizonDays: env.FORECAST_MAX_HORIZON_DAYS,
  spendingTrendWindowDays: env.FORECAST_SPENDING_TREND_WINDOW_DAYS,
  conservativeMultiplier: env.FORECAST_CONSERVATIVE_MULTIPLIER,
  balancedMultiplier: env.FORECAST_BALANCED_MULTIPLIER,
  stretchMultiplier: env.FORECAST_STRETCH_MULTIPLIER,
  savingsProjectionPercent: env.FORECAST_SAVINGS_PROJECTION_PERCENT,
  mlSignalThreshold: env.FORECAST_ML_SIGNAL_THRESHOLD,
} as const;
