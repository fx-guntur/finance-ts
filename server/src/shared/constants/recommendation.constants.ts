import { env } from "../../config/env";

export const recommendationEngineConfig = {
  engineVersion: "1.0.0",
  savingsTargetPercent: env.RECOMMENDATION_SAVINGS_TARGET_PERCENT,
  dailySafetyBufferPercent: env.RECOMMENDATION_DAILY_SAFETY_BUFFER_PERCENT,
  weekendMultiplier: env.RECOMMENDATION_WEEKEND_MULTIPLIER,
  holidayMultiplier: env.RECOMMENDATION_HOLIDAY_MULTIPLIER,
  overspendWarningPercent: env.RECOMMENDATION_OVESPEND_WARNING_PERCENT,
  behaviorWindowDays: env.RECOMMENDATION_BEHAVIOR_WINDOW_DAYS,
  historyLimit: env.RECOMMENDATION_HISTORY_LIMIT,
} as const;
