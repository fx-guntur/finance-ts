import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { useTranslations } from "../../../i18n/use-translations";

type ForecastMlPanelProps = {
  mlSignals: string[];
};

export function ForecastMlPanel({ mlSignals }: ForecastMlPanelProps) {
  const { t, locale } = useTranslations();
  return (
    <Card className="space-y-4">
      <h3 className="text-base font-semibold">{t("forecast.ml")}</h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        {locale === "id"
          ? "Sinyal deterministik dari perkiraan disiapkan untuk pengembangan model cerdas di masa depan."
          : "Deterministic forecast signals are normalized for future machine learning augmentation."}
      </p>
      <div className="flex flex-wrap gap-2">
        {mlSignals.map((signal) => (
          <Badge key={signal} variant="neutral">
            {signal}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
