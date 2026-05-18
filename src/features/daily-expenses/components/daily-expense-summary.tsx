import { motion } from "framer-motion";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { formatCurrency } from "../../../lib/format/currency";
import { formatFriendlyDate } from "../../../lib/format/date";
import { fadeInUp } from "../../../lib/motion";
import { useTranslations } from "../../../i18n/use-translations";
import type { DailyExpenseSummary } from "../types";

type DailyExpenseSummaryProps = {
  summary: DailyExpenseSummary;
  currency: string;
};

export function DailyExpenseSummaryCard({ summary, currency }: DailyExpenseSummaryProps) {
  const { t, locale } = useTranslations();
  const metrics = [
    { label: t("daily.summary.total"), value: formatCurrency(summary.totalAmount, currency), detail: null },
    { label: t("daily.summary.entries"), value: String(summary.entryCount), detail: null },
    { label: t("daily.summary.average"), value: formatCurrency(summary.averageAmount, currency), detail: null },
    {
      label: t("daily.summary.topCategory"),
      value: summary.highestCategoryName ?? (locale === "id" ? "Tidak ada" : "None"),
      detail: summary.highestCategoryName ? formatCurrency(summary.highestCategoryAmount, currency) : null,
    },
  ];

  return (
    <motion.div variants={fadeInUp}>
      <Card className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{t("daily.summary.title")}</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {t("daily.summary.description")} {formatFriendlyDate(summary.selectedDate, locale)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">{locale === "id" ? "Belanja langsung" : "Real-time spending"}</Badge>
            <Badge variant="neutral">{locale === "id" ? "Riwayat" : "History"} {summary.recentHistoryCount}</Badge>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4 backdrop-blur-md"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{metric.label}</div>
              <div className="mt-2 text-xl font-semibold">{metric.value}</div>
              {metric.detail ? <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{metric.detail}</div> : null}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
