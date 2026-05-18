import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "../../../i18n/use-translations";
import { fetchCurrentSalary, fetchSalaryHistory, saveCurrentSalary, type SalaryUpsertPayload } from "../api/salary.api";
import type { SalaryRecord } from "../types";

export function useSalary(userId: string) {
  const { locale } = useTranslations();
  const [currentSalary, setCurrentSalary] = useState<SalaryRecord | null>(null);
  const [salaryHistory, setSalaryHistory] = useState<SalaryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const [current, history] = await Promise.all([
        fetchCurrentSalary(userId),
        fetchSalaryHistory(userId),
      ]);

      setCurrentSalary(current);
      setSalaryHistory(history);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : locale === "id" ? "Gagal memuat data gaji." : "Failed to load salary data.");
    } finally {
      setIsLoading(false);
    }
  }, [locale, userId]);

  const submit = useCallback(
    async (payload: SalaryUpsertPayload) => {
      setIsSaving(true);
      setSaveError(null);
      setSuccessMessage(null);

      try {
        const saved = await saveCurrentSalary(userId, payload);
        setCurrentSalary(saved);
        await load();
        setSuccessMessage(locale === "id" ? "Gaji pokok berhasil disimpan." : "Base salary saved successfully.");
        return saved;
      } catch (error) {
        const message = error instanceof Error ? error.message : locale === "id" ? "Gagal menyimpan gaji." : "Failed to save salary.";
        setSaveError(message);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [load, locale, userId],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    currentSalary,
    salaryHistory,
    isLoading,
    isSaving,
    loadError,
    saveError,
    successMessage,
    reload: load,
    submit,
  };
}
