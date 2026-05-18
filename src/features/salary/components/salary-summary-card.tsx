import { Badge } from "../../../components/ui/badge";
import { GlassCard } from "../../../components/layout/glass-card";
import { SectionHeader } from "../../../components/layout/section-header";
import { formatCurrency } from "../../../lib/format/currency";
import { useTranslations } from "../../../i18n/use-translations";
import type { SalaryRecord } from "../types";

type SalarySummaryCardProps = {
  salary: SalaryRecord | null;
  historyCount: number;
};

export function SalarySummaryCard({ salary, historyCount }: SalarySummaryCardProps) {
  const { t, locale } = useTranslations();
  return (
    <GlassCard className="space-y-4">
      <SectionHeader title={t("salary.section.summary")} description={t("salary.section.summary.description")} />
      {salary ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">{t("salary.monthly")}</div>
              <div className="mt-1 text-3xl font-semibold tracking-tight">
                {formatCurrency(salary.monthlySalary, salary.currency, locale === "id" ? "id-ID" : "en-US")}
              </div>
            </div>
            <Badge variant={salary.isActive ? "success" : "neutral"}>
              {salary.isActive ? t("salary.active") : t("salary.inactive")}
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                {t("salary.payday")}
              </div>
              <div className="mt-1 text-sm font-medium">Day {salary.paydayDay} of each month</div>
            </div>
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                {t("salary.history")}
              </div>
              <div className="mt-1 text-sm font-medium">{locale === "id" ? `${historyCount} catatan` : `${historyCount} record(s)`}</div>
            </div>
          </div>

          <div className="text-sm text-[hsl(var(--muted-foreground))]">
            {t("salary.effectiveFrom")} {new Date(salary.effectiveFrom).toLocaleDateString(locale === "id" ? "id-ID" : "en-US")}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] px-4 py-8 text-sm text-[hsl(var(--muted-foreground))]">
          {t("salary.noData")}
        </div>
      )}
    </GlassCard>
  );
}
