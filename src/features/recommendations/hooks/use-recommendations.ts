import { useCallback, useEffect, useRef, useState } from "react";
import { fetchRecommendations } from "../api/recommendations.api";
import { toDateInputValue } from "../../../lib/format/date";
import { useTranslations } from "../../../i18n/use-translations";
import type { RecommendationOverview } from "../types";

function createEmptyOverview(userId: string, selectedDate: string): RecommendationOverview {
  return {
    engineVersion: "1.0.0",
    snapshot: {
      userId,
      selectedDate,
      salaryAmount: 0,
      monthlyRecurringAmount: 0,
      dailySpentAmount: 0,
      netIncomeAfterRecurring: 0,
      remainingBalanceBeforeSavings: 0,
      isWeekend: false,
      isHoliday: false,
      holidayDates: [],
      daysInMonth: 0,
      elapsedDaysInMonth: 0,
    },
    dailySpendingRecommendation: {
      baseDailyAmount: 0,
      adjustedDailyAmount: 0,
      dayType: "weekday",
      multiplier: 0,
      safetyBufferPercent: 0,
      remainingDaysInMonth: 0,
      rationale: [],
    },
    savingsRecommendation: {
      targetPercent: 0,
      targetAmount: 0,
      netIncomeAfterRecurring: 0,
      disposableBalanceAfterSavings: 0,
      feasible: false,
      rationale: [],
    },
    overspendingDetection: {
      isOverspending: false,
      severity: "none",
      expectedSpendToDate: 0,
      actualSpendToDate: 0,
      varianceAmount: 0,
      variancePercent: 0,
      rationale: [],
    },
    spendingBehaviorAnalysis: {
      totalSpent: 0,
      averageDailySpend: 0,
      activeDaysWithSpend: 0,
      weekendSpend: 0,
      weekdaySpend: 0,
      weekendSharePercent: 0,
      topCategoryName: null,
      topCategoryAmount: 0,
      topCategorySharePercent: 0,
      trend: "insufficient-data",
      categoryBreakdown: [],
      signals: [],
    },
    alerts: [],
    aiSignals: [],
  };
}

export function useRecommendations(userId: string) {
  const { locale } = useTranslations();
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(new Date()));
  const [holidayDates, setHolidayDates] = useState("");
  const holidayDatesRef = useRef(holidayDates);
  const [overview, setOverview] = useState<RecommendationOverview>(() =>
    createEmptyOverview(userId, toDateInputValue(new Date())),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(
    async (queryDate: string, queryHolidayDates: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchRecommendations(userId, {
          date: queryDate,
          holidayDates: queryHolidayDates.trim() || undefined,
        });
        setOverview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : locale === "id" ? "Gagal memuat rekomendasi." : "Failed to load recommendations.");
        setOverview(createEmptyOverview(userId, queryDate));
      } finally {
        setIsLoading(false);
      }
    },
    [locale, userId],
  );

  useEffect(() => {
    holidayDatesRef.current = holidayDates;
  }, [holidayDates]);

  useEffect(() => {
    void reload(selectedDate, holidayDatesRef.current);
  }, [reload, selectedDate]);

  return {
    overview,
    selectedDate,
    setSelectedDate,
    holidayDates,
    setHolidayDates,
    isLoading,
    error,
    reload,
  };
}
