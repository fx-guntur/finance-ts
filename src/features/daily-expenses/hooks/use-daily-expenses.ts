import { useCallback, useEffect, useState } from "react";
import {
  createDailyExpense,
  fetchDailyExpensesOverview,
  updateDailyExpense,
  type DailyExpenseUpsertPayload,
} from "../api/daily-expenses.api";
import { toDateInputValue } from "../../../lib/format/date";
import { useTranslations } from "../../../i18n/use-translations";
import type { DailyExpensesOverview } from "../types";

function createInitialOverview(selectedDate: string): DailyExpensesOverview {
  return {
    selectedDate,
    expenses: [],
    history: [],
    categories: [],
    summary: {
      selectedDate,
      totalAmount: 0,
      entryCount: 0,
      averageAmount: 0,
      highestCategoryName: null,
      highestCategoryAmount: 0,
      recentHistoryCount: 0,
    },
  };
}

export function useDailyExpenses(userId: string) {
  const { locale } = useTranslations();
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(new Date()));
  const [overview, setOverview] = useState<DailyExpensesOverview>(() => createInitialOverview(selectedDate));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const reload = useCallback(
    async (date = selectedDate) => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const data = await fetchDailyExpensesOverview(userId, date);
        setOverview(data);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : locale === "id" ? "Gagal memuat pengeluaran harian." : "Failed to load daily expenses.");
        setOverview(createInitialOverview(date));
      } finally {
        setIsLoading(false);
      }
    },
    [locale, selectedDate, userId],
  );

  const saveExpense = useCallback(
    async (expenseId: string | null, payload: DailyExpenseUpsertPayload) => {
      setIsSaving(true);
      setSaveError(null);
      setSuccessMessage(null);

      try {
        if (expenseId) {
          await updateDailyExpense(userId, expenseId, payload);
        } else {
          await createDailyExpense(userId, payload);
        }

        await reload(selectedDate);
        setSuccessMessage(expenseId ? (locale === "id" ? "Pengeluaran berhasil diperbarui." : "Expense updated successfully.") : (locale === "id" ? "Pengeluaran berhasil ditambahkan." : "Expense added successfully."));
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : locale === "id" ? "Gagal menyimpan pengeluaran." : "Failed to save expense.");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [locale, reload, selectedDate, userId],
  );

  useEffect(() => {
    void reload(selectedDate);
  }, [reload, selectedDate]);

  return {
    overview,
    selectedDate,
    setSelectedDate,
    isLoading,
    isSaving,
    loadError,
    saveError,
    successMessage,
    reload,
    saveExpense,
  };
}
