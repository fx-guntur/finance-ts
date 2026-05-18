import { motion } from "framer-motion";
import { Card } from "../../../components/ui/card";
import { formatCurrency } from "../../../lib/format/currency";
import { formatFriendlyDate } from "../../../lib/format/date";
import { fadeInUp } from "../../../lib/motion";
import { useTranslations } from "../../../i18n/use-translations";
import type { ForecastScenario } from "../types";

type ForecastPathCardProps = {
  scenario: ForecastScenario;
  currency: string;
};

export function ForecastPathCard({ scenario, currency }: ForecastPathCardProps) {
  const { t, locale } = useTranslations();
  return (
    <motion.div variants={fadeInUp}>
      <Card className="space-y-4">
        <div>
          <h3 className="text-base font-semibold">{t("forecast.path.title")}</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {locale === "id" ? "Lintasan proyeksi untuk skenario aktif pada rentang yang dipilih." : "Projected path for the active scenario across the selected horizon."}
          </p>
        </div>

        <div className="space-y-3">
          {scenario.path.map((point) => (
            <div key={point.date} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium">{formatFriendlyDate(point.date)}</div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                  {formatCurrency(point.projectedDailyBudget, currency)} / {locale === "id" ? "hari" : "day"}
                </div>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-3 text-sm">
                <div>{t("forecast.path.balance")}: {formatCurrency(point.projectedBalance, currency)}</div>
                <div>{t("forecast.path.spend")}: {formatCurrency(point.projectedSpend, currency)}</div>
                <div>{t("forecast.path.savings")}: {formatCurrency(point.projectedSavings, currency)}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
