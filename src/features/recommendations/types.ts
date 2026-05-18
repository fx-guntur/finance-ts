export type RecommendationSeverity = "info" | "warning" | "critical";

export type RecommendationAlert = {
  code: string;
  severity: RecommendationSeverity;
  title: string;
  message: string;
};

export type SpendingCategoryBreakdown = {
  categoryId: string;
  categoryName: string;
  amount: number;
  sharePercent: number;
};

export type DailySpendingRecommendation = {
  baseDailyAmount: number;
  adjustedDailyAmount: number;
  dayType: "weekday" | "weekend" | "holiday" | "weekend_holiday";
  multiplier: number;
  safetyBufferPercent: number;
  remainingDaysInMonth: number;
  rationale: string[];
};

export type SavingsRecommendation = {
  targetPercent: number;
  targetAmount: number;
  netIncomeAfterRecurring: number;
  disposableBalanceAfterSavings: number;
  feasible: boolean;
  rationale: string[];
};

export type OverspendingDetection = {
  isOverspending: boolean;
  severity: "none" | "low" | "medium" | "high" | "critical";
  expectedSpendToDate: number;
  actualSpendToDate: number;
  varianceAmount: number;
  variancePercent: number;
  rationale: string[];
};

export type SpendingBehaviorAnalysis = {
  totalSpent: number;
  averageDailySpend: number;
  activeDaysWithSpend: number;
  weekendSpend: number;
  weekdaySpend: number;
  weekendSharePercent: number;
  topCategoryName: string | null;
  topCategoryAmount: number;
  topCategorySharePercent: number;
  trend: "improving" | "stable" | "declining" | "insufficient-data";
  categoryBreakdown: SpendingCategoryBreakdown[];
  signals: string[];
};

export type RecommendationSnapshot = {
  userId: string;
  selectedDate: string;
  salaryAmount: number;
  monthlyRecurringAmount: number;
  dailySpentAmount: number;
  netIncomeAfterRecurring: number;
  remainingBalanceBeforeSavings: number;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayDates: string[];
  daysInMonth: number;
  elapsedDaysInMonth: number;
};

export type RecommendationOverview = {
  engineVersion: string;
  snapshot: RecommendationSnapshot;
  dailySpendingRecommendation: DailySpendingRecommendation;
  savingsRecommendation: SavingsRecommendation;
  overspendingDetection: OverspendingDetection;
  spendingBehaviorAnalysis: SpendingBehaviorAnalysis;
  alerts: RecommendationAlert[];
  aiSignals: string[];
};

export type RecommendationQuery = {
  date?: string;
  holidayDates?: string;
};
