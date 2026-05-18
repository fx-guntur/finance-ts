import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { EmptyState } from "../../../components/feedback/empty-state";
import { LoadingState } from "../../../components/feedback/loading-state";
import { SectionHeader } from "../../../components/layout/section-header";
import { fadeInUp, staggerChildren } from "../../../lib/motion";
import { SalaryForm } from "../components/salary-form";
import { SalarySummaryCard } from "../components/salary-summary-card";
import { createInitialSalaryFormValues, validateSalaryForm } from "../validation";
import { useSalary } from "../hooks/use-salary";
import type { SalaryFormValues } from "../types";
import type { SalaryUpsertPayload } from "../api/salary.api";
import { useTranslations } from "../../../i18n/use-translations";

const DEMO_USER_ID = "demo-user";

function toPayload(values: SalaryFormValues): SalaryUpsertPayload {
  return {
    monthlySalary: Number(values.monthlySalary),
    currency: values.currency.toUpperCase(),
    paydayDay: Number(values.paydayDay),
    effectiveFrom: values.effectiveFrom,
    effectiveTo: values.effectiveTo || undefined,
    isActive: values.isActive,
  };
}

export function SalaryPage() {
  const { t, locale } = useTranslations();
  const [values, setValues] = useState<SalaryFormValues>(createInitialSalaryFormValues());
  const [fieldErrors, setFieldErrors] = useState<ReturnType<typeof validateSalaryForm>>({});
  const { currentSalary, salaryHistory, isLoading, isSaving, loadError, saveError, successMessage, reload, submit } =
    useSalary(DEMO_USER_ID);

  useEffect(() => {
    if (!currentSalary || values.monthlySalary) {
      return;
    }

    setValues({
      monthlySalary: String(currentSalary.monthlySalary),
      currency: currentSalary.currency,
      paydayDay: String(currentSalary.paydayDay),
      effectiveFrom: currentSalary.effectiveFrom.slice(0, 10),
      effectiveTo: currentSalary.effectiveTo ? currentSalary.effectiveTo.slice(0, 10) : "",
      isActive: currentSalary.isActive,
    });
  }, [currentSalary, values.monthlySalary]);

  async function handleSubmit() {
    const errors = validateSalaryForm(values);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    await submit(toPayload(values));
  }

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-5">
      <motion.section variants={fadeInUp}>
        <SectionHeader title={t("salary.title")} description={t("salary.description")} action={<Badge variant="primary">{t("salary.title")}</Badge>} />
      </motion.section>

      {loadError ? (
        <motion.section variants={fadeInUp}>
          <EmptyState
            title={locale === "id" ? "Gagal memuat data gaji" : "Unable to load salary data"}
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

      <motion.section variants={staggerChildren} className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.div variants={fadeInUp}>
          <Card className="space-y-5">
            <SectionHeader title={t("salary.section.form")} description={t("salary.section.form.description")} />
            {isLoading ? (
              <LoadingState label={t("salary.loading")} />
            ) : (
              <SalaryForm
                values={values}
                errors={fieldErrors}
                isSaving={isSaving}
                onChange={(next) => {
                  setValues(next);
                  setFieldErrors({});
                }}
                onSubmit={() => {
                  void handleSubmit();
                }}
              />
            )}
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp} className="space-y-4">
          <SalarySummaryCard salary={currentSalary} historyCount={salaryHistory.length} />
          <Card className="space-y-3">
            <SectionHeader title={t("salary.section.notes")} description={t("salary.section.notes.description")} />
            <div className="text-sm text-[hsl(var(--muted-foreground))]">{t("salary.notes.body")}</div>
          </Card>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
