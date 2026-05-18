import { Badge } from "../../../components/ui/badge";
import { GlassCard } from "../../../components/layout/glass-card";
import { SectionHeader } from "../../../components/layout/section-header";
import { formatCurrency } from "../../../lib/format/currency";
import { useTranslations } from "../../../i18n/use-translations";
import type { MonthlyExpensesSummary } from "../types";

type MonthlyExpenseSummaryProps = {
  summary: MonthlyExpensesSummary;
  currency: string;
};

export function MonthlyExpenseSummary({ summary, currency }: MonthlyExpenseSummaryProps) {
  const { t, locale } = useTranslations();
  return (
    <GlassCard className="space-y-4">
      <SectionHeader title={t("monthly.section.summary")} description={t("monthly.section.summary.description")} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{t("monthly.summary.total")}</div>
          <div className="mt-2 text-2xl font-semibold">{formatCurrency(summary.totalMonthlyAmount, currency)}</div>
        </div>
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{t("monthly.summary.active")}</div>
          <div className="mt-2 text-2xl font-semibold">{summary.activeCount}</div>
        </div>
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{t("monthly.summary.mandatory")}</div>
          <div className="mt-2 text-2xl font-semibold">{summary.mandatoryCount}</div>
        </div>
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{t("monthly.summary.nextDue")}</div>
          <div className="mt-2 text-sm font-medium">
            {summary.nextDueTitle ?? (locale === "id" ? "Tidak ada tagihan jatuh tempo" : "No due items")}
          </div>
          <div className="text-xs text-[hsl(var(--muted-foreground))]">
            {summary.nextDueDate ? new Date(summary.nextDueDate).toLocaleDateString(locale === "id" ? "id-ID" : "en-US") : "-"}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="primary">
          {locale === "id" ? "Kategori terbesar" : "Largest category"}: {summary.highestCategoryName ?? (locale === "id" ? "Tidak ada" : "n/a")}
        </Badge>
        <Badge variant="neutral">
          {locale === "id" ? "Nominal berikutnya" : "Next amount"}: {formatCurrency(summary.nextDueAmount, currency)}
        </Badge>
      </div>
    </GlassCard>
  );
}
