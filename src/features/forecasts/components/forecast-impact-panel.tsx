import { Card } from "../../../components/ui/card";
import { formatCurrency } from "../../../lib/format/currency";
import { useTranslations } from "../../../i18n/use-translations";
import type { ForecastOverview } from "../types";

type ForecastImpactPanelProps = {
  overview: ForecastOverview;
  currency: string;
};

export function ForecastImpactPanel({ overview, currency }: ForecastImpactPanelProps) {
  const { t, locale } = useTranslations();
  return (
    <Card className="space-y-4">
      <h3 className="text-base font-semibold">{t("forecast.impact.title")}</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{t("forecast.impact.currentSpendRate")}</div>
          <div className="mt-2 text-lg font-semibold">{formatCurrency(overview.impactAnalysis.currentSpendRate, currency)}</div>
        </div>
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{t("forecast.impact.projectedSpendRate")}</div>
          <div className="mt-2 text-lg font-semibold">{formatCurrency(overview.impactAnalysis.projectedSpendRate, currency)}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4 text-sm text-[hsl(var(--muted-foreground))]">
        {locale === "id" ? "Selisih" : "Difference"}: {formatCurrency(overview.impactAnalysis.differenceAmount, currency)} (
        {overview.impactAnalysis.differencePercent.toFixed(1)}%)
      </div>

      <div className="space-y-2">
        {overview.impactAnalysis.commentary.map((line) => (
          <div key={line} className="text-sm text-[hsl(var(--muted-foreground))]">
            {line}
          </div>
        ))}
      </div>
    </Card>
  );
}
