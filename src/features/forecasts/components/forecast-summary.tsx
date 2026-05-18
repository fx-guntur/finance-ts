import { motion } from "framer-motion";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { GlassCard } from "../../../components/layout/glass-card";
import { formatCurrency } from "../../../lib/format/currency";
import { formatFriendlyDate } from "../../../lib/format/date";
import { fadeInUp, staggerChildren } from "../../../lib/motion";
import { useTranslations } from "../../../i18n/use-translations";
import type { ForecastOverview } from "../types";

type ForecastSummaryProps = {
  overview: ForecastOverview;
  currency: string;
};

function riskVariant(riskLevel: string) {
  if (riskLevel === "critical") return "danger";
  if (riskLevel === "high" || riskLevel === "moderate") return "warning";
  return "success";
}

function riskLabel(riskLevel: string, locale: string, t: ReturnType<typeof useTranslations>["t"]) {
  if (riskLevel === "critical") return t("status.danger");
  if (riskLevel === "high" || riskLevel === "moderate") return t("status.warning");
  if (riskLevel === "low") return t("status.success");
  return locale === "id" ? riskLevel : riskLevel;
}

export function ForecastSummary({ overview, currency }: ForecastSummaryProps) {
  const { t, locale } = useTranslations();
  const summaryCards = [
    { label: locale === "id" ? "Saldo akhir" : "Ending balance", value: formatCurrency(overview.activeScenario.projectedEndingBalance, currency) },
    { label: locale === "id" ? "Belanja proyeksi" : "Projected spend", value: formatCurrency(overview.activeScenario.projectedTotalSpend, currency) },
    { label: locale === "id" ? "Tabungan proyeksi" : "Projected savings", value: formatCurrency(overview.savingsProjection.projectedSavings, currency) },
    { label: locale === "id" ? "Budget harian" : "Daily budget", value: formatCurrency(overview.summary.estimatedDailyBudget, currency) },
  ];

  return (
    <motion.div variants={fadeInUp}>
      <GlassCard className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{t("forecast.summary.title")}</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {t("forecast.summary.description")} {formatFriendlyDate(overview.summary.selectedDate, locale)} {locale === "id" ? "selama" : "over"} {overview.summary.horizonDays} {locale === "id" ? "hari" : "day(s)"}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">{t("forecast.summary.title")} {overview.engineVersion}</Badge>
            <Badge variant={riskVariant(overview.activeScenario.riskLevel)}>
              {riskLabel(overview.activeScenario.riskLevel, locale, t)}
            </Badge>
          </div>
        </div>

        <motion.div variants={staggerChildren} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <motion.div key={card.label} variants={fadeInUp}>
              <Card className="space-y-2">
                <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{card.label}</div>
                <div className="text-2xl font-semibold tracking-tight">{card.value}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
