import { motion } from "framer-motion";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { formatCurrency } from "../../../lib/format/currency";
import { fadeInUp, staggerChildren } from "../../../lib/motion";
import { useTranslations } from "../../../i18n/use-translations";
import type { ForecastScenario } from "../types";

type ForecastScenarioGridProps = {
  scenarios: ForecastScenario[];
  currency: string;
};

function riskVariant(riskLevel: string) {
  if (riskLevel === "critical") return "danger";
  if (riskLevel === "high" || riskLevel === "moderate") return "warning";
  return "success";
}

function riskLabel(riskLevel: string, locale: string) {
  if (riskLevel === "critical") return locale === "id" ? "Risiko tinggi" : "High risk";
  if (riskLevel === "high" || riskLevel === "moderate") return locale === "id" ? "Waspada" : "Warning";
  return locale === "id" ? "Baik" : "Healthy";
}

export function ForecastScenarioGrid({ scenarios, currency }: ForecastScenarioGridProps) {
  const { locale } = useTranslations();
  return (
    <motion.div variants={staggerChildren} className="grid gap-4 xl:grid-cols-3">
      {scenarios.map((scenario) => (
        <motion.div key={scenario.name} variants={fadeInUp}>
          <Card className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">{scenario.label}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {locale === "id" ? "Pengali belanja" : "Spending multiplier"} {scenario.multiplier.toFixed(2)}x
                </p>
              </div>
              <Badge variant={riskVariant(scenario.riskLevel)}>{riskLabel(scenario.riskLevel, locale)}</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{locale === "id" ? "Saldo akhir" : "Ending balance"}</div>
                <div className="mt-2 text-lg font-semibold">{formatCurrency(scenario.projectedEndingBalance, currency)}</div>
              </div>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{locale === "id" ? "Total tabungan" : "Total savings"}</div>
                <div className="mt-2 text-lg font-semibold">{formatCurrency(scenario.projectedTotalSavings, currency)}</div>
              </div>
            </div>

            <div className="space-y-2">
              {scenario.rationale.map((line) => (
                <div key={line} className="text-sm text-[hsl(var(--muted-foreground))]">
                  {line}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
