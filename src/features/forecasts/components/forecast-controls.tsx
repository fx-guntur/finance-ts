import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { FormField } from "../../../components/forms/form-field";
import { useTranslations } from "../../../i18n/use-translations";

type ForecastControlsProps = {
  selectedDate: string;
  horizonDays: string;
  onSelectedDateChange: (value: string) => void;
  onHorizonDaysChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
};

export function ForecastControls({
  selectedDate,
  horizonDays,
  onSelectedDateChange,
  onHorizonDaysChange,
  onRefresh,
  isLoading,
}: ForecastControlsProps) {
  const { t, locale } = useTranslations();
  return (
    <Card className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <FormField
          label={t("forecast.controls.date")}
          description={t("forecast.controls.date.description")}
          guide={locale === "id" ? "Tanggal ini menjadi titik awal simulasi. Sistem memakai gaji yang tersisa, pengeluaran rutin, dan belanja berjalan untuk menghitung proyeksi." : "The forecast engine uses this date as the baseline for remaining salary, recurring expenses, and spending simulation."}
        >
          <Input type="date" value={selectedDate} onChange={(event) => onSelectedDateChange(event.target.value)} />
        </FormField>

        <FormField
          label={t("forecast.controls.horizon")}
          description={t("forecast.controls.horizon.description")}
          guide={locale === "id" ? "Rentang proyeksi menentukan seberapa jauh simulasi melihat ke depan. Nilai yang lebih besar memberi gambaran lebih panjang, tetapi bergantung pada asumsi yang lebih banyak." : "Forecast horizon controls how far ahead the simulator looks. Higher values show longer projections but depend more on assumptions."}
        >
          <Input
            type="number"
            min="1"
            max="90"
            inputMode="numeric"
            value={horizonDays}
            onChange={(event) => onHorizonDaysChange(event.target.value)}
          />
        </FormField>

        <div className="flex items-end">
          <Button className="w-full lg:w-auto lg:min-w-40" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? t("common.saving") : t("forecast.controls.refresh")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
