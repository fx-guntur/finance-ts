import { AppError } from "../../shared/errors/app-error";
import { recommendationEngineConfig } from "../../shared/constants/recommendation.constants";
import { RecommendationsRepository } from "./recommendations.repository";
import type {
  DailySpendingRecommendation,
  OverspendingDetection,
  RecommendationAlert,
  RecommendationOverview,
  RecommendationSnapshot,
  SavingsRecommendation,
  SpendingBehaviorAnalysis,
  SpendingCategoryBreakdown,
} from "./recommendations.types";

function parseDate(value?: string) {
  if (!value) {
    return new Date();
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new AppError("VALIDATION_ERROR", "Invalid date value", 400);
  }

  return date;
}

function parseLocalDate(value: Date | string) {
  if (value instanceof Date) {
    return value;
  }

  return new Date(`${value}T00:00:00`);
}

function toDateKey(date: Date | string) {
  const normalized = parseLocalDate(date);
  return [
    normalized.getFullYear(),
    String(normalized.getMonth() + 1).padStart(2, "0"),
    String(normalized.getDate()).padStart(2, "0"),
  ].join("-");
}

function isWeekend(date: Date | string) {
  const normalized = parseLocalDate(date);
  const day = normalized.getDay();
  return day === 0 || day === 6;
}

function parseHolidayDates(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(item)) {
        throw new AppError("VALIDATION_ERROR", "holidayDates must contain YYYY-MM-DD values", 400);
      }

      return item;
    });
}

function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function clamp(value: number, min: number) {
  return Math.max(min, value);
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function computeTrend(lastWindow: number[], previousWindow: number[]) {
  if (lastWindow.length === 0 || previousWindow.length === 0) {
    return "insufficient-data" as const;
  }

  const lastAverage = sum(lastWindow) / lastWindow.length;
  const previousAverage = sum(previousWindow) / previousWindow.length;
  const deltaPercent = previousAverage === 0 ? 100 : ((lastAverage - previousAverage) / previousAverage) * 100;

  if (deltaPercent <= -10) {
    return "improving" as const;
  }

  if (deltaPercent >= 10) {
    return "declining" as const;
  }

  return "stable" as const;
}

function buildBreakdown(items: Array<{ categoryId: string; category: { name: string }; amount: number }>): SpendingCategoryBreakdown[] {
  const totals = new Map<string, { categoryId: string; categoryName: string; amount: number }>();

  for (const item of items) {
    const current = totals.get(item.categoryId);
    totals.set(item.categoryId, {
      categoryId: item.categoryId,
      categoryName: item.category.name,
      amount: (current?.amount ?? 0) + item.amount,
    });
  }

  const totalAmount = sum(Array.from(totals.values()).map((item) => item.amount));

  return Array.from(totals.values())
    .map((item) => ({
      ...item,
      sharePercent: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function buildAlerts(
  snapshot: RecommendationSnapshot,
  dailyRecommendation: DailySpendingRecommendation,
  overspending: OverspendingDetection,
  savingsRecommendation: SavingsRecommendation,
): RecommendationAlert[] {
  const alerts: RecommendationAlert[] = [];

  if (snapshot.isHoliday) {
    alerts.push({
      code: "HOLIDAY_ADJUSTMENT",
      severity: "info",
      title: "Holiday adjustment applied",
      message: "Today's recommendation includes the configured holiday spending multiplier.",
    });
  } else if (snapshot.isWeekend) {
    alerts.push({
      code: "WEEKEND_ADJUSTMENT",
      severity: "info",
      title: "Weekend adjustment applied",
      message: "Today's recommendation includes the configured weekend spending multiplier.",
    });
  }

  if (overspending.isOverspending) {
    alerts.push({
      code: "OVERSPEND_DETECTED",
      severity: overspending.severity === "critical" ? "critical" : "warning",
      title: "Overspending detected",
      message: `Spending is ${overspending.variancePercent.toFixed(1)}% above the expected pace.`,
    });
  }

  if (!savingsRecommendation.feasible) {
    alerts.push({
      code: "NEGATIVE_CASHFLOW",
      severity: "critical",
      title: "Savings target not feasible",
      message: "Recurring commitments and spending already exceed the monthly income envelope.",
    });
  }

  if (dailyRecommendation.adjustedDailyAmount <= 0) {
    alerts.push({
      code: "NO_FLEXIBLE_BUDGET",
      severity: "warning",
      title: "No flexible budget left",
      message: "The remaining balance is exhausted after recurring expenses and current spending.",
    });
  }

  return alerts;
}

export class RecommendationsService {
  constructor(private readonly repository = new RecommendationsRepository()) {}

  async getOverview(userId: string, input: { date?: string; holidayDates?: string }): Promise<RecommendationOverview> {
    const selectedDate = parseDate(input.date);
    const holidayDates = parseHolidayDates(input.holidayDates);
    const holidayDateSet = new Set(holidayDates);
    const selectedDateKey = toDateKey(selectedDate);
    const selectedDateIsHoliday = holidayDateSet.has(selectedDateKey);
    const selectedDateIsWeekend = isWeekend(selectedDate);

    const { currentSalary, monthlyExpenses, dailyExpensesToDate } = await this.repository.loadFinancialInputs(
      userId,
      selectedDate,
    );

    const daysInMonth = getDaysInMonth(selectedDate);
    const elapsedDaysInMonth = clamp(selectedDate.getDate(), 1);
    const remainingDaysInMonth = clamp(daysInMonth - selectedDate.getDate() + 1, 1);

    const salaryAmount = currentSalary?.monthlySalary ?? 0;
    const monthlyRecurringAmount = sum(monthlyExpenses.filter((item) => item.isActive).map((item) => item.amount));
    const dailySpentAmount = sum(dailyExpensesToDate.map((item) => item.amount));
    const netIncomeAfterRecurring = salaryAmount - monthlyRecurringAmount;
    const remainingBalanceBeforeSavings = netIncomeAfterRecurring - dailySpentAmount;
    const targetSavingsAmount = Math.max(0, netIncomeAfterRecurring * (recommendationEngineConfig.savingsTargetPercent / 100));
    const disposableAfterSavings = netIncomeAfterRecurring - targetSavingsAmount;

    const dayMultiplier = (selectedDateIsWeekend ? recommendationEngineConfig.weekendMultiplier : 1) *
      (selectedDateIsHoliday ? recommendationEngineConfig.holidayMultiplier : 1);
    const dayType = selectedDateIsWeekend && selectedDateIsHoliday
      ? "weekend_holiday"
      : selectedDateIsHoliday
        ? "holiday"
        : selectedDateIsWeekend
          ? "weekend"
          : "weekday";

    const baseDailyAmount = disposableAfterSavings > 0 ? disposableAfterSavings / remainingDaysInMonth : 0;
    const adjustedDailyAmount = Math.max(
      0,
      baseDailyAmount * dayMultiplier * (1 - recommendationEngineConfig.dailySafetyBufferPercent / 100),
    );

    const expectedSpendToDate = disposableAfterSavings > 0
      ? disposableAfterSavings * (elapsedDaysInMonth / daysInMonth)
      : 0;
    const varianceAmount = dailySpentAmount - expectedSpendToDate;
    const variancePercent = expectedSpendToDate > 0 ? (varianceAmount / expectedSpendToDate) * 100 : dailySpentAmount > 0 ? 100 : 0;
    const overspending: OverspendingDetection = {
      isOverspending:
        disposableAfterSavings <= 0
          ? dailySpentAmount > 0
          : variancePercent > recommendationEngineConfig.overspendWarningPercent,
      severity:
        variancePercent >= 50
          ? "critical"
          : variancePercent >= 25
            ? "high"
            : variancePercent >= recommendationEngineConfig.overspendWarningPercent
              ? "medium"
              : variancePercent > 0
                ? "low"
                : "none",
      expectedSpendToDate,
      actualSpendToDate: dailySpentAmount,
      varianceAmount,
      variancePercent,
      rationale: [
        `Expected spend to date: ${expectedSpendToDate.toFixed(2)}`,
        `Actual spend to date: ${dailySpentAmount.toFixed(2)}`,
        `Variance: ${varianceAmount.toFixed(2)}`,
      ],
    };

    const breakdown = buildBreakdown(dailyExpensesToDate);
    const totalSpent = dailySpentAmount;
    const weekendSpend = sum(
      dailyExpensesToDate
        .filter((item) => isWeekend(item.spentAt))
        .map((item) => item.amount),
    );
    const weekdaySpend = totalSpent - weekendSpend;
    const topBreakdown = breakdown[0] ?? null;
    const activeDaysWithSpend = new Set(dailyExpensesToDate.map((item) => toDateKey(item.spentAt))).size;
    const trendWindow = Math.max(
      1,
      Math.min(recommendationEngineConfig.behaviorWindowDays, recommendationEngineConfig.historyLimit, daysInMonth),
    );
    const recentWindow = dailyExpensesToDate.slice(-trendWindow).map((item) => item.amount);
    const previousWindow = dailyExpensesToDate.slice(-trendWindow * 2, -trendWindow).map((item) => item.amount);

    const spendingBehaviorAnalysis: SpendingBehaviorAnalysis = {
      totalSpent,
      averageDailySpend: activeDaysWithSpend > 0 ? totalSpent / activeDaysWithSpend : 0,
      activeDaysWithSpend,
      weekendSpend,
      weekdaySpend,
      weekendSharePercent: totalSpent > 0 ? (weekendSpend / totalSpent) * 100 : 0,
      topCategoryName: topBreakdown?.categoryName ?? null,
      topCategoryAmount: topBreakdown?.amount ?? 0,
      topCategorySharePercent: topBreakdown?.sharePercent ?? 0,
      trend: computeTrend(recentWindow, previousWindow),
      categoryBreakdown: breakdown,
      signals: [],
    };

    const signals: string[] = [];
    if (overspending.isOverspending) {
      signals.push("OVERSPEND_RISK");
    }
    if (selectedDateIsWeekend) {
      signals.push("WEEKEND_SPEND_CONTEXT");
    }
    if (selectedDateIsHoliday) {
      signals.push("HOLIDAY_SPEND_CONTEXT");
    }
    if (spendingBehaviorAnalysis.topCategorySharePercent >= 35) {
      signals.push("CATEGORY_CONCENTRATION");
      spendingBehaviorAnalysis.signals.push("CATEGORY_CONCENTRATION");
    }
    if (spendingBehaviorAnalysis.weekendSharePercent >= 30) {
      signals.push("WEEKEND_HEAVY_SPEND");
      spendingBehaviorAnalysis.signals.push("WEEKEND_HEAVY_SPEND");
    }
    if (spendingBehaviorAnalysis.trend === "declining") {
      signals.push("SPEND_ACCELERATION");
      spendingBehaviorAnalysis.signals.push("SPEND_ACCELERATION");
    }
    if (remainingBalanceBeforeSavings > 0) {
      signals.push("SAVINGS_CAPACITY_AVAILABLE");
    }

    const dailySpendingRecommendation: DailySpendingRecommendation = {
      baseDailyAmount,
      adjustedDailyAmount,
      dayType,
      multiplier: dayMultiplier,
      safetyBufferPercent: recommendationEngineConfig.dailySafetyBufferPercent,
      remainingDaysInMonth,
      rationale: [
        `Net income after recurring expenses: ${netIncomeAfterRecurring.toFixed(2)}`,
        `Flexible balance after savings target: ${disposableAfterSavings.toFixed(2)}`,
        `Remaining days in month: ${remainingDaysInMonth}`,
      ],
    };

    const savingsRecommendation: SavingsRecommendation = {
      targetPercent: recommendationEngineConfig.savingsTargetPercent,
      targetAmount: targetSavingsAmount,
      netIncomeAfterRecurring,
      disposableBalanceAfterSavings: disposableAfterSavings,
      feasible: disposableAfterSavings >= 0,
      rationale: [
        `Savings target is based on ${recommendationEngineConfig.savingsTargetPercent}% of the net monthly income after recurring costs.`,
        disposableAfterSavings >= 0 ? "Savings target is achievable with the current envelope." : "Savings target is not achievable with the current envelope.",
      ],
    };

    const snapshot: RecommendationSnapshot = {
      userId,
      selectedDate: selectedDateKey,
      salaryAmount,
      monthlyRecurringAmount,
      dailySpentAmount,
      netIncomeAfterRecurring,
      remainingBalanceBeforeSavings,
      isWeekend: selectedDateIsWeekend,
      isHoliday: selectedDateIsHoliday,
      holidayDates,
      daysInMonth,
      elapsedDaysInMonth,
    };

    const alerts = buildAlerts(snapshot, dailySpendingRecommendation, overspending, savingsRecommendation);

    return {
      engineVersion: recommendationEngineConfig.engineVersion,
      snapshot,
      dailySpendingRecommendation,
      savingsRecommendation,
      overspendingDetection: overspending,
      spendingBehaviorAnalysis,
      alerts,
      aiSignals: signals,
    };
  }
}
