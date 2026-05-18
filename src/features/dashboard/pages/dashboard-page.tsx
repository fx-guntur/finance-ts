import { motion } from "framer-motion";
import { useMemo } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { EmptyState } from "../../../components/feedback/empty-state";
import { LoadingState } from "../../../components/feedback/loading-state";
import { GlassCard } from "../../../components/layout/glass-card";
import { SectionHeader } from "../../../components/layout/section-header";
import { formatCurrency } from "../../../lib/format/currency";
import { fadeInUp, staggerChildren } from "../../../lib/motion";
import { useDailyExpenses } from "../../daily-expenses/hooks/use-daily-expenses";
import { useMonthlyExpenses } from "../../monthly-expenses/hooks/use-monthly-expenses";
import { useSalary } from "../../salary/hooks/use-salary";
import { useTranslations } from "../../../i18n/use-translations";

const DEMO_USER_ID = "demo-user";

function getDaysLeftInMonth(date: Date) {
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return Math.max(1, endOfMonth.getDate() - date.getDate() + 1);
}

export function DashboardPage() {
  const { t, locale } = useTranslations();
  const salary = useSalary(DEMO_USER_ID);
  const monthlyExpenses = useMonthlyExpenses(DEMO_USER_ID);
  const dailyExpenses = useDailyExpenses(DEMO_USER_ID);

  const summary = useMemo(() => {
    const salaryAmount = salary.currentSalary?.monthlySalary ?? 0;
    const recurringAmount = monthlyExpenses.overview.summary.totalMonthlyAmount ?? 0;
    const dailySpentAmount = dailyExpenses.overview.summary.totalAmount ?? 0;
    const remainingBalance = salaryAmount - recurringAmount - dailySpentAmount;
    const daysLeftInMonth = getDaysLeftInMonth(new Date());
    const estimatedDailyBudget = remainingBalance > 0 ? remainingBalance / daysLeftInMonth : 0;

    return {
      salaryAmount,
      recurringAmount,
      dailySpentAmount,
      remainingBalance,
      estimatedDailyBudget,
      activeRecurringCount: monthlyExpenses.overview.summary.activeCount,
    };
  }, [
    dailyExpenses.overview.summary.totalAmount,
    monthlyExpenses.overview.summary.activeCount,
    monthlyExpenses.overview.summary.totalMonthlyAmount,
    salary.currentSalary?.monthlySalary,
  ]);

  const currency = salary.currentSalary?.currency ?? "IDR";

  const metrics = [
    {
      label: t("dashboard.metric.salary"),
      value: formatCurrency(summary.salaryAmount, currency, locale === "id" ? "id-ID" : "en-US"),
      tone: "primary" as const,
      note: salary.currentSalary ? `${t("salary.payday")} ${salary.currentSalary.paydayDay}` : t("salary.noData"),
      progress: 100,
    },
    {
      label: t("dashboard.metric.expenses"),
      value: formatCurrency(summary.recurringAmount, currency, locale === "id" ? "id-ID" : "en-US"),
      tone: "neutral" as const,
      note: `${summary.activeRecurringCount} ${locale === "id" ? "item aktif" : "active item(s)"}`,
      progress: summary.salaryAmount > 0 ? Math.min(100, (summary.recurringAmount / summary.salaryAmount) * 100) : 0,
    },
    {
      label: t("dashboard.metric.dailyLimit"),
      value: formatCurrency(summary.estimatedDailyBudget, currency, locale === "id" ? "id-ID" : "en-US"),
      tone: "success" as const,
      note: t("dashboard.metric.dailyLimit.note"),
      progress: summary.salaryAmount > 0 ? Math.min(100, (summary.estimatedDailyBudget / summary.salaryAmount) * 100) : 0,
    },
    {
      label: t("dashboard.metric.forecast"),
      value: formatCurrency(summary.remainingBalance, currency, locale === "id" ? "id-ID" : "en-US"),
      tone: "warning" as const,
      note: `${formatCurrency(summary.dailySpentAmount, currency, locale === "id" ? "id-ID" : "en-US")} ${locale === "id" ? "tercatat hari ini" : "spent today"}`,
      progress: summary.salaryAmount > 0 ? Math.min(100, (summary.remainingBalance / summary.salaryAmount) * 100) : 0,
    },
  ];

  const isLoading = salary.isLoading || monthlyExpenses.isLoading || dailyExpenses.isLoading;
  const loadError = salary.loadError ?? monthlyExpenses.loadError ?? dailyExpenses.loadError;

  function handleNewEntry() {
    window.location.assign("/salary");
  }

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-5">
      <motion.section variants={fadeInUp}>
        <SectionHeader
          title={t("dashboard.title")}
          description={t("dashboard.description")}
          action={<Button onClick={handleNewEntry}>{t("common.addEntry")}</Button>}
        />
      </motion.section>

      {loadError ? (
        <motion.section variants={fadeInUp}>
          <EmptyState title={locale === "id" ? "Gagal memuat ringkasan" : "Unable to load dashboard data"} description={loadError} actionLabel={t("common.retry")} onAction={() => {
            void salary.reload();
            void monthlyExpenses.reload();
            void dailyExpenses.reload();
          }} />
        </motion.section>
      ) : null}

      <motion.section variants={staggerChildren} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <motion.div key={metric.label} variants={fadeInUp}>
            <GlassCard className="min-h-[152px] space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">{metric.label}</div>
                  <div className="text-2xl font-semibold tracking-tight">{metric.value}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">{metric.note}</div>
                </div>
                <Badge variant={metric.tone}>{metric.tone}</Badge>
              </div>

              <div className="space-y-2">
                <div className="h-1.5 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                  <div
                    className="h-full rounded-full bg-[hsl(var(--primary))]/70"
                    style={{ width: `${Math.max(8, Math.min(100, metric.progress))}%` }}
                  />
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                  {metric.label}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.section>

      <motion.section variants={staggerChildren} className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <motion.div variants={fadeInUp}>
          <Card className="space-y-4">
            <SectionHeader title={t("dashboard.preview.title")} description={t("dashboard.preview.description")} />
            {isLoading ? (
              <LoadingState label={t("common.loading")} />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{t("dashboard.metric.forecast")}</div>
                  <div className="mt-2 text-2xl font-semibold">{formatCurrency(summary.remainingBalance, currency, locale === "id" ? "id-ID" : "en-US")}</div>
                </div>
                <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{locale === "id" ? "Belanja hari ini" : "Daily spent today"}</div>
                  <div className="mt-2 text-2xl font-semibold">{formatCurrency(summary.dailySpentAmount, currency, locale === "id" ? "id-ID" : "en-US")}</div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <EmptyState
            title={t("dashboard.ready.title")}
            description={t("dashboard.ready.description")}
            actionLabel={t("dashboard.openArchitecture")}
          />
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
