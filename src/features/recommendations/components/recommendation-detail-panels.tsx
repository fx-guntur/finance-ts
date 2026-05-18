import { motion } from "framer-motion";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { EmptyState } from "../../../components/feedback/empty-state";
import { formatCurrency } from "../../../lib/format/currency";
import { useTranslations } from "../../../i18n/use-translations";
import { fadeInUp, staggerChildren } from "../../../lib/motion";
import type { RecommendationOverview } from "../types";

type RecommendationDetailPanelsProps = {
  overview: RecommendationOverview;
  currency: string;
};

function alertVariant(severity: string) {
  if (severity === "critical") return "danger";
  if (severity === "warning") return "warning";
  return "primary";
}

export function RecommendationDetailPanels({ overview, currency }: RecommendationDetailPanelsProps) {
  const { t, locale } = useTranslations();
  const alerts = overview.alerts;
  const breakdown = overview.spendingBehaviorAnalysis.categoryBreakdown;

  return (
    <motion.div variants={staggerChildren} className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <motion.div variants={fadeInUp}>
        <Card className="space-y-4">
          <h3 className="text-base font-semibold">{t("recommendations.guidance.title")}</h3>

          <div className="space-y-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
            <div className="text-sm text-[hsl(var(--muted-foreground))]">{t("recommendations.guidance.dailyTitle")}</div>
            <div className="text-2xl font-semibold">
              {formatCurrency(overview.dailySpendingRecommendation.adjustedDailyAmount, currency)}
            </div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              {locale === "id"
                ? `Batas dasar ${formatCurrency(overview.dailySpendingRecommendation.baseDailyAmount, currency)} dan ${overview.dailySpendingRecommendation.remainingDaysInMonth} hari tersisa dalam bulan ini.`
                : `Base limit ${formatCurrency(overview.dailySpendingRecommendation.baseDailyAmount, currency)} and ${overview.dailySpendingRecommendation.remainingDaysInMonth} day(s) remaining in the month.`}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
            <div className="text-sm text-[hsl(var(--muted-foreground))]">{t("recommendations.guidance.savingsTitle")}</div>
            <div className="text-2xl font-semibold">
              {formatCurrency(overview.savingsRecommendation.targetAmount, currency)}
            </div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              {overview.savingsRecommendation.feasible
                ? t("recommendations.feasible")
                : t("recommendations.notFeasible")}
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp} className="space-y-4">
        <Card className="space-y-4">
          <h3 className="text-base font-semibold">{t("recommendations.alerts.title")}</h3>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.code} className="rounded-2xl border border-[hsl(var(--border))] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium">{alert.title}</div>
                    <Badge variant={alertVariant(alert.severity)}>{alert.severity}</Badge>
                  </div>
                  <div className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{alert.message}</div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title={t("recommendations.alerts.safe")} description={t("recommendations.alerts.none.description")} />
          )}
        </Card>

        <Card className="space-y-4">
          <h3 className="text-base font-semibold">{t("recommendations.behavior.title")}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{t("recommendations.behavior.topCategory")}</div>
              <div className="mt-2 text-lg font-semibold">{overview.spendingBehaviorAnalysis.topCategoryName ?? (locale === "id" ? "Tidak ada" : "None")}</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">
                {overview.spendingBehaviorAnalysis.topCategorySharePercent.toFixed(1)}% {locale === "id" ? "dari total belanja tercatat" : "of tracked spend"}
              </div>
            </div>

            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{t("recommendations.behavior.weekendShare")}</div>
              <div className="mt-2 text-lg font-semibold">
                {overview.spendingBehaviorAnalysis.weekendSharePercent.toFixed(1)}%
              </div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">{t("recommendations.behavior.weekendDetail")}</div>
            </div>
          </div>

          <div className="space-y-2">
            {breakdown.length > 0 ? (
              breakdown.map((item) => (
                <div key={item.categoryId} className="flex items-center justify-between gap-3 rounded-xl bg-[hsl(var(--muted))]/20 px-3 py-2 text-sm">
                  <span>{item.categoryName}</span>
                  <span className="text-[hsl(var(--muted-foreground))]">
                    {formatCurrency(item.amount, currency)} - {item.sharePercent.toFixed(1)}%
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] px-4 py-6 text-sm text-[hsl(var(--muted-foreground))]">
                {locale === "id" ? "Rincian kategori belum tersedia." : "No category breakdown is available yet."}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
