import { useCallback, useEffect, useState } from "react";
import { toDateInputValue } from "../../../lib/format/date";
import { useTranslations } from "../../../i18n/use-translations";
import { fetchForecasts } from "../api/forecasts.api";
import type { ForecastOverview } from "../types";

function createEmptyOverview(userId: string, selectedDate: string): ForecastOverview {
  return {
    engineVersion: "1.0.0",
    summary: {
      selectedDate,
      horizonDays: 30,
      salaryAmount: 0,
      recurringAmount: 0,
      currentSpentAmount: 0,
      remainingBalance: 0,
      averageDailySpend: 0,
      estimatedDailyBudget: 0,
    },
    activeScenario: {
      name: "balanced",
      label: "Balanced",
      multiplier: 1,
      projectedEndingBalance: 0,
      projectedTotalSpend: 0,
      projectedTotalSavings: 0,
      projectedAverageDailyBudget: 0,
      riskLevel: "low",
      rationale: [],
      path: [],
    },
    scenarios: [],
    impactAnalysis: {
      currentSpendRate: 0,
      projectedSpendRate: 0,
      differenceAmount: 0,
      differencePercent: 0,
      commentary: [],
    },
    savingsProjection: {
      projectedSavings: 0,
      projectedSavingsRate: 0,
      projectedEndingBalance: 0,
      savingsAtRisk: false,
      rationale: [],
    },
    mlSignals: [`USER_${userId}`, `DATE_${selectedDate}`],
  };
}

export function useForecasts(userId: string) {
  const { locale } = useTranslations();
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(new Date()));
  const [horizonDays, setHorizonDays] = useState("30");
  const [overview, setOverview] = useState<ForecastOverview>(() =>
    createEmptyOverview(userId, toDateInputValue(new Date())),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(
    async (date: string, horizon: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchForecasts(userId, {
          date,
          horizonDays: horizon,
        });
        setOverview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : locale === "id" ? "Gagal memuat perkiraan." : "Failed to load forecasts.");
        setOverview(createEmptyOverview(userId, date));
      } finally {
        setIsLoading(false);
      }
    },
    [locale, userId],
  );

  useEffect(() => {
    void reload(selectedDate, horizonDays);
  }, [horizonDays, reload, selectedDate]);

  return {
    overview,
    selectedDate,
    setSelectedDate,
    horizonDays,
    setHorizonDays,
    isLoading,
    error,
    reload,
  };
}
