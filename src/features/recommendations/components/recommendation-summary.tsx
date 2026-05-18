import { motion } from "framer-motion";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { GlassCard } from "../../../components/layout/glass-card";
import { formatCurrency } from "../../../lib/format/currency";
import { formatFriendlyDate } from "../../../lib/format/date";
import { fadeInUp, staggerChildren } from "../../../lib/motion";
import { useTranslations } from "../../../i18n/use-translations";
import type { RecommendationOverview } from "../types";

type RecommendationSummaryProps = {
  overview: RecommendationOverview;
  currency: string;
};

function severityVariant(severity: string) {
  if (severity === "critical") return "danger";
  if (severity === "high" || severity === "medium") return "warning";
  return "neutral";
}

function dayTypeLabel(dayType: string, locale: string) {
  if (dayType === "weekend") return locale === "id" ? "akhir pekan" : "weekend";
  if (dayType === "holiday") return locale === "id" ? "hari libur" : "holiday";
  return locale === "id" ? "hari kerja" : "weekday";
}

function severityLabel(severity: string, locale: string, t: ReturnType<typeof useTranslations>["t"]) {
  if (severity === "critical") return t("status.danger");
  if (severity === "high" || severity === "medium") return t("status.warning");
  if (severity === "none") return t("status.stable");
  return locale === "id" ? severity : severity;
}

export function RecommendationSummary({ overview, currency }: RecommendationSummaryProps) {
  const { t, locale } = useTranslations();
  const cards = [
    {
      label: t("recommendations.card.daily"),
      value: formatCurrency(overview.dailySpendingRecommendation.adjustedDailyAmount, currency),
      detail:
        locale === "id"
          ? `${dayTypeLabel(overview.dailySpendingRecommendation.dayType, locale)} x${overview.dailySpendingRecommendation.multiplier.toFixed(2)}`
          : `${dayTypeLabel(overview.dailySpendingRecommendation.dayType, locale)} multiplier ${overview.dailySpendingRecommendation.multiplier.toFixed(2)}x`,
    },
    {
      label: t("recommendations.card.savings"),
      value: formatCurrency(overview.savingsRecommendation.targetAmount, currency),
      detail:
        locale === "id"
          ? `${overview.savingsRecommendation.targetPercent}% dari pendapatan bersih setelah biaya rutin`
          : `${overview.savingsRecommendation.targetPercent}% of net income after recurring costs`,
    },
    {
      label: t("recommendations.card.balance"),
      value: formatCurrency(overview.snapshot.remainingBalanceBeforeSavings, currency),
      detail: locale === "id" ? "Sebelum alokasi tabungan" : "Before savings allocation",
    },
    {
      label: t("recommendations.card.overspend"),
      value: formatCurrency(Math.abs(overview.overspendingDetection.varianceAmount), currency),
      detail: overview.overspendingDetection.isOverspending
        ? locale === "id"
          ? "Melebihi pola yang diharapkan"
          : "Above expected pace"
        : locale === "id"
          ? "Masih dalam batas yang wajar"
          : "Within expected pace",
    },
  ];

  return (
    <motion.div variants={fadeInUp}>
      <GlassCard className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{t("recommendations.summary.title")}</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {t("recommendations.summary.description")} {formatFriendlyDate(overview.snapshot.selectedDate, locale)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">{t("recommendations.summary.title")} {overview.engineVersion}</Badge>
            <Badge variant={severityVariant(overview.overspendingDetection.severity)}>
              {severityLabel(overview.overspendingDetection.severity, locale, t)}
            </Badge>
          </div>
        </div>

        <motion.div variants={staggerChildren} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <motion.div key={card.label} variants={fadeInUp}>
              <Card className="h-full space-y-2">
                <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                  {card.label}
                </div>
                <div className="text-2xl font-semibold tracking-tight">{card.value}</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">{card.detail}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
