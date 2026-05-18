import { useCallback, useEffect, useState } from "react";
import { createCategory, fetchCategories, type CategoryCreatePayload } from "../api/categories.api";
import {
  createMonthlyExpense,
  deleteMonthlyExpense,
  fetchMonthlyExpensesOverview,
  updateMonthlyExpense,
  type MonthlyExpenseUpsertPayload,
} from "../api/monthly-expenses.api";
import { useTranslations } from "../../../i18n/use-translations";
import type { CategoryRecord, MonthlyExpensesOverview } from "../types";

export function useMonthlyExpenses(userId: string) {
  const { locale } = useTranslations();
  const [overview, setOverview] = useState<MonthlyExpensesOverview>({
    expenses: [],
    categories: [],
    summary: {
      totalMonthlyAmount: 0,
      activeCount: 0,
      mandatoryCount: 0,
      nextDueAmount: 0,
      nextDueTitle: null,
      nextDueDate: null,
      nextDueDays: null,
      highestCategoryName: null,
      highestCategoryAmount: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await fetchMonthlyExpensesOverview(userId);
      setOverview(data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : locale === "id" ? "Gagal memuat pengeluaran bulanan." : "Failed to load monthly expenses.");
    } finally {
      setIsLoading(false);
    }
  }, [locale, userId]);

  const saveExpense = useCallback(
    async (expenseId: string | null, payload: MonthlyExpenseUpsertPayload) => {
      setIsSaving(true);
      setSaveError(null);
      setSuccessMessage(null);

      try {
        if (expenseId) {
          await updateMonthlyExpense(userId, expenseId, payload);
        } else {
          await createMonthlyExpense(userId, payload);
        }

        await reload();
        setSuccessMessage(expenseId ? (locale === "id" ? "Pengeluaran berhasil diperbarui." : "Expense updated successfully.") : (locale === "id" ? "Pengeluaran berhasil ditambahkan." : "Expense added successfully."));
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : locale === "id" ? "Gagal menyimpan pengeluaran." : "Failed to save expense.");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [locale, reload, userId],
  );

  const removeExpense = useCallback(
    async (expenseId: string) => {
      setIsSaving(true);
      setSaveError(null);
      setSuccessMessage(null);

      try {
        await deleteMonthlyExpense(userId, expenseId);
        await reload();
        setSuccessMessage(locale === "id" ? "Pengeluaran berhasil dihapus." : "Expense deleted successfully.");
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : locale === "id" ? "Gagal menghapus pengeluaran." : "Failed to delete expense.");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [locale, reload, userId],
  );

  const addCategory = useCallback(
    async (payload: CategoryCreatePayload) => {
      setIsSaving(true);
      setSaveError(null);
      setSuccessMessage(null);

      try {
        const category = await createCategory(userId, payload);
        await reload();
        setSuccessMessage(locale === "id" ? `Kategori "${category.name}" berhasil dibuat.` : `Category "${category.name}" created successfully.`);
        return category;
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : locale === "id" ? "Gagal membuat kategori." : "Failed to create category.");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [locale, reload, userId],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    overview,
    categories: overview.categories as CategoryRecord[],
    isLoading,
    isSaving,
    loadError,
    saveError,
    successMessage,
    reload,
    saveExpense,
    removeExpense,
    addCategory,
  };
}
