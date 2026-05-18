import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { EmptyState } from "../../../components/feedback/empty-state";
import { LoadingState } from "../../../components/feedback/loading-state";
import { SectionHeader } from "../../../components/layout/section-header";
import { fadeInUp, staggerChildren } from "../../../lib/motion";
import { CategoryPanel } from "../components/category-panel";
import { MonthlyExpenseForm } from "../components/monthly-expense-form";
import { MonthlyExpenseList } from "../components/monthly-expense-list";
import { MonthlyExpenseSummary } from "../components/monthly-expense-summary";
import { useMonthlyExpenses } from "../hooks/use-monthly-expenses";
import {
  createInitialCategoryFormValues,
  createInitialMonthlyExpenseFormValues,
  validateCategoryForm,
  validateMonthlyExpenseForm,
} from "../validation";
import type { CategoryFormValues, MonthlyExpenseFormValues, MonthlyExpenseRecord } from "../types";
import { useTranslations } from "../../../i18n/use-translations";

const DEMO_USER_ID = "demo-user";

function toExpensePayload(values: MonthlyExpenseFormValues) {
  return {
    categoryId: values.categoryId,
    title: values.title,
    amount: Number(values.amount),
    dueDay: Number(values.dueDay),
    isMandatory: values.isMandatory,
    billingCycle: values.billingCycle,
    notes: values.notes || null,
    isActive: values.isActive,
  };
}

function toCategoryPayload(values: CategoryFormValues) {
  return {
    name: values.name,
    type: values.type,
    color: values.color || null,
    iconKey: values.iconKey || null,
    sortOrder: Number(values.sortOrder),
    isSystem: values.isSystem,
    isActive: values.isActive,
  };
}

export function MonthlyExpensesPage() {
  const { t, locale } = useTranslations();
  const { overview, isLoading, isSaving, loadError, saveError, successMessage, reload, saveExpense, removeExpense, addCategory } =
    useMonthlyExpenses(DEMO_USER_ID);
  const [expenseValues, setExpenseValues] = useState<MonthlyExpenseFormValues>(
    createInitialMonthlyExpenseFormValues(),
  );
  const [expenseErrors, setExpenseErrors] = useState<Partial<Record<keyof MonthlyExpenseFormValues, string>>>({});
  const [categoryValues, setCategoryValues] = useState<CategoryFormValues>(createInitialCategoryFormValues());
  const [categoryErrors, setCategoryErrors] = useState<Partial<Record<keyof CategoryFormValues, string>>>({});
  const [editingExpense, setEditingExpense] = useState<MonthlyExpenseRecord | null>(null);

  const categories = overview.categories;

  useEffect(() => {
    if (!expenseValues.categoryId && categories.length > 0) {
      setExpenseValues((current) => ({ ...current, categoryId: categories[0].id }));
    }
  }, [categories, expenseValues.categoryId]);

  useEffect(() => {
    if (!editingExpense) {
      return;
    }

    setExpenseValues({
      categoryId: editingExpense.categoryId,
      title: editingExpense.title,
      amount: String(editingExpense.amount),
      dueDay: String(editingExpense.dueDay),
      isMandatory: editingExpense.isMandatory,
      billingCycle: editingExpense.billingCycle,
      notes: editingExpense.notes ?? "",
      isActive: editingExpense.isActive,
    });
  }, [editingExpense]);

const currency = "IDR";

  async function handleSubmitExpense() {
    const errors = validateMonthlyExpenseForm(expenseValues);
    setExpenseErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await saveExpense(editingExpense?.id ?? null, toExpensePayload(expenseValues));
      setEditingExpense(null);
      setExpenseValues((current) => createInitialMonthlyExpenseFormValues(current.categoryId || categories[0]?.id || ""));
    } catch {
      // The hook already surfaces a saveError message for the UI.
    }
  }

  async function handleSubmitCategory() {
    const errors = validateCategoryForm(categoryValues);
    setCategoryErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const created = await addCategory(toCategoryPayload(categoryValues));
      setCategoryValues(createInitialCategoryFormValues());
      setExpenseValues((current) => ({
        ...current,
        categoryId: current.categoryId || created.id,
      }));
    } catch {
      // The hook already surfaces a saveError message for the UI.
    }
  }

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-5">
      <motion.section variants={fadeInUp}>
        <SectionHeader
          title={t("monthly.title")}
          description={t("monthly.description")}
          action={<Badge variant="primary">{t("monthly.title")}</Badge>}
        />
      </motion.section>

      {loadError ? (
        <motion.section variants={fadeInUp}>
          <EmptyState
            title={locale === "id" ? "Gagal memuat pengeluaran bulanan" : "Unable to load monthly expenses"}
            description={loadError}
            actionLabel={t("common.retry")}
            onAction={reload}
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
        {isLoading ? <LoadingState label={t("common.loading")} /> : <MonthlyExpenseSummary summary={overview.summary} currency={currency} />}
      </motion.section>

      <motion.section variants={staggerChildren} className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <motion.div variants={fadeInUp} className="space-y-4">
          <Card className="space-y-5">
            <SectionHeader
              title={editingExpense ? t("monthly.section.form.edit") : t("monthly.section.form.add")}
              description={t("monthly.section.form.description")}
              action={
                editingExpense ? (
                  <Button variant="secondary" size="sm" onClick={() => setEditingExpense(null)}>
                    {t("monthly.form.clearEdit")}
                  </Button>
                ) : null
              }
            />
            {isLoading ? (
              <LoadingState label={t("common.loading")} />
            ) : (
              <MonthlyExpenseForm
                categories={categories}
                values={expenseValues}
                errors={expenseErrors}
                isSaving={isSaving}
                submitLabel={editingExpense ? t("monthly.form.update") : t("monthly.form.save")}
                isEditing={Boolean(editingExpense)}
                onChange={(next) => {
                  setExpenseValues(next);
                  setExpenseErrors({});
                }}
                onSubmit={() => {
                  void handleSubmitExpense();
                }}
                onCancel={() => {
                  setEditingExpense(null);
                  setExpenseValues(createInitialMonthlyExpenseFormValues(categories[0]?.id || ""));
                }}
              />
            )}
          </Card>

          <MonthlyExpenseList
            expenses={overview.expenses}
            currency={currency}
            isLoading={isLoading}
            onEdit={(expense) => setEditingExpense(expense)}
            onDelete={(expenseId) => {
              void removeExpense(expenseId);
            }}
          />
        </motion.div>

        <motion.div variants={fadeInUp} className="space-y-4">
          <CategoryPanel
            categories={categories}
            values={categoryValues}
            errors={categoryErrors}
            isSaving={isSaving}
            onChange={(next) => {
              setCategoryValues(next);
              setCategoryErrors({});
            }}
            onSubmit={() => {
              void handleSubmitCategory();
            }}
          />

          <Card className="space-y-3">
            <SectionHeader
              title={t("monthly.section.rules")}
              description={t("monthly.section.rules.description")}
            />
            <div className="grid gap-3 text-sm text-[hsl(var(--muted-foreground))]">
              <div>{t("monthly.rules.line1")}</div>
              <div>{t("monthly.rules.line2")}</div>
              <div>{t("monthly.rules.line3")}</div>
            </div>
          </Card>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
