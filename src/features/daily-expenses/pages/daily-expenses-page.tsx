import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { EmptyState } from "../../../components/feedback/empty-state";
import { LoadingState } from "../../../components/feedback/loading-state";
import { SectionHeader } from "../../../components/layout/section-header";
import { Modal } from "../../../components/ui/modal";
import { Input } from "../../../components/ui/input";
import { fadeInUp, staggerChildren } from "../../../lib/motion";
import { formatFriendlyDate } from "../../../lib/format/date";
import { useTranslations } from "../../../i18n/use-translations";
import { DailyExpenseForm } from "../components/daily-expense-form";
import { DailyExpenseList } from "../components/daily-expense-list";
import { DailyExpenseSummaryCard } from "../components/daily-expense-summary";
import { useDailyExpenses } from "../hooks/use-daily-expenses";
import {
  createInitialDailyExpenseFormValues,
  validateDailyExpenseForm,
} from "../validation";
import type { DailyExpenseFormValues, DailyExpenseRecord } from "../types";

const DEMO_USER_ID = "demo-user";
const CURRENCY = "IDR";

function toExpensePayload(values: DailyExpenseFormValues) {
  return {
    categoryId: values.categoryId,
    amount: Number(values.amount),
    spentAt: values.spentAt,
    merchantName: values.merchantName.trim() || null,
    note: values.note.trim() || null,
  };
}

export function DailyExpensesPage() {
  const { t, locale } = useTranslations();
  const {
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
  } = useDailyExpenses(DEMO_USER_ID);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<DailyExpenseRecord | null>(null);
  const [expenseValues, setExpenseValues] = useState<DailyExpenseFormValues>(
    createInitialDailyExpenseFormValues(),
  );
  const [expenseErrors, setExpenseErrors] = useState<Partial<Record<keyof DailyExpenseFormValues, string>>>({});

  const categories = overview.categories;
  const defaultCategoryId = useMemo(() => categories[0]?.id ?? "", [categories]);

  useEffect(() => {
    if (!editorOpen || editingExpense) {
      return;
    }

    setExpenseValues((current) => ({
      ...current,
      categoryId: current.categoryId || defaultCategoryId,
      spentAt: current.spentAt || selectedDate,
    }));
  }, [defaultCategoryId, editingExpense, editorOpen, selectedDate]);

  function openCreateModal() {
    setEditingExpense(null);
    setExpenseErrors({});
    setExpenseValues(createInitialDailyExpenseFormValues(defaultCategoryId, selectedDate));
    setEditorOpen(true);
  }

  function openEditModal(expense: DailyExpenseRecord) {
    setEditingExpense(expense);
    setExpenseErrors({});
    setExpenseValues({
      categoryId: expense.categoryId,
      amount: String(expense.amount),
      spentAt: expense.spentAt.slice(0, 10),
      merchantName: expense.merchantName ?? "",
      note: expense.note ?? "",
    });
    setEditorOpen(true);
  }

  function closeEditor() {
    setEditorOpen(false);
    setEditingExpense(null);
    setExpenseErrors({});
  }

  async function handleSubmitExpense() {
    const errors = validateDailyExpenseForm(expenseValues);
    setExpenseErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await saveExpense(editingExpense?.id ?? null, toExpensePayload(expenseValues));
      closeEditor();
      setExpenseValues(createInitialDailyExpenseFormValues(defaultCategoryId, selectedDate));
    } catch {
      // The hook already surfaces a saveError message for the UI.
    }
  }

  const historyPreview = overview.history.filter((expense) => expense.spentAt.slice(0, 10) !== selectedDate);

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-5">
      <motion.section variants={fadeInUp}>
        <SectionHeader
          title={t("daily.title")}
          description={t("daily.description")}
          action={<Badge variant="primary">{t("nav.dailyExpenses")}</Badge>}
        />
      </motion.section>

      <motion.section variants={fadeInUp}>
        <Card className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium">{t("daily.selectedDate")}</div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {t("daily.selectedDate.description")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
              <Button onClick={openCreateModal}>{t("daily.addExpense")}</Button>
            </div>
          </div>
        </Card>
      </motion.section>

      {loadError ? (
        <motion.section variants={fadeInUp}>
          <EmptyState
            title={locale === "id" ? "Gagal memuat catatan harian" : "Unable to load daily expenses"}
            description={loadError}
            actionLabel={t("common.retry")}
            onAction={() => {
              void reload(selectedDate);
            }}
          />
        </motion.section>
      ) : null}

      {successMessage ? (
        <motion.section variants={fadeInUp}>
          <Card className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            {successMessage}
          </Card>
        </motion.section>
      ) : null}

      {saveError ? (
        <motion.section variants={fadeInUp}>
          <Card className="border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300">
            {saveError}
          </Card>
        </motion.section>
      ) : null}

      <motion.section variants={staggerChildren} className="space-y-4">
        {isLoading ? (
          <LoadingState label={locale === "id" ? "Memuat ringkasan harian..." : "Loading daily spending overview..."} />
        ) : (
          <DailyExpenseSummaryCard summary={overview.summary} currency={CURRENCY} />
        )}
      </motion.section>

      <motion.section variants={staggerChildren} className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DailyExpenseList
          title={t("daily.list.selected")}
          description={`${locale === "id" ? "Entri tercatat untuk" : "Entries logged for"} ${formatFriendlyDate(selectedDate, locale)}`}
          expenses={overview.expenses}
          currency={CURRENCY}
          isLoading={isLoading}
          emptyTitle={t("daily.list.noDate")}
          emptyDescription={locale === "id" ? "Tambahkan pengeluaran baru untuk mulai mencatat belanja pada hari terpilih." : "Add a new expense to begin tracking spending for the selected day."}
          onEdit={openEditModal}
        />

        <DailyExpenseList
          title={t("daily.list.history")}
          description={locale === "id" ? "Aktivitas belanja terbaru di tanggal sebelumnya." : "Recent spending activity across previous dates."}
          expenses={historyPreview}
          currency={CURRENCY}
          isLoading={isLoading}
          showDate
          emptyTitle={t("daily.list.noHistory")}
          emptyDescription={locale === "id" ? "Setelah pengeluaran dicatat, aktivitas terbaru akan muncul di sini." : "Once expenses are recorded, recent activity will appear here."}
          onEdit={openEditModal}
        />
      </motion.section>

      <Modal
        open={editorOpen}
        title={editingExpense ? t("daily.form.update") : t("daily.form.save")}
        description={locale === "id" ? "Catat nominal, tanggal, dan kategori melalui modal yang ringkas." : "Capture the expense amount, date, and category in a compact modal workflow."}
        onClose={closeEditor}
      >
        <DailyExpenseForm
          categories={categories}
          values={expenseValues}
          errors={expenseErrors}
          isSaving={isSaving}
          submitLabel={editingExpense ? t("daily.form.update") : t("daily.form.save")}
          onChange={(next) => {
            setExpenseValues(next);
            setExpenseErrors({});
          }}
          onSubmit={() => {
            void handleSubmitExpense();
          }}
          onCancel={closeEditor}
        />
      </Modal>
    </motion.div>
  );
}
