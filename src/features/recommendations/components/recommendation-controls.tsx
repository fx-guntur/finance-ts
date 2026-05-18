import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { FormField } from "../../../components/forms/form-field";
import { useTranslations } from "../../../i18n/use-translations";

type RecommendationControlsProps = {
  selectedDate: string;
  holidayDates: string;
  onSelectedDateChange: (value: string) => void;
  onHolidayDatesChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
};

export function RecommendationControls({
  selectedDate,
  holidayDates,
  onSelectedDateChange,
  onHolidayDatesChange,
  onRefresh,
  isLoading,
}: RecommendationControlsProps) {
  const { t, locale } = useTranslations();
  return (
    <Card className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.25fr_auto] lg:items-end">
        <FormField
          label={t("recommendations.controls.date")}
          description={t("recommendations.controls.date.description")}
          guide={locale === "id" ? "Tanggal ini menentukan hari mana yang dianalisis. Hasil berubah karena akhir pekan, progres bulan, dan riwayat belanja harian ikut dipertimbangkan." : "This date tells the engine which day to analyze. The result changes because weekends, month progress, and daily spending history are all date-sensitive."}
        >
          <Input type="date" value={selectedDate} onChange={(event) => onSelectedDateChange(event.target.value)} />
        </FormField>

        <FormField
          label={t("recommendations.controls.holidays")}
          description={t("recommendations.controls.holidays.description")}
          guide={locale === "id" ? "Masukkan tanggal libur ketika aturan belanja boleh lebih longgar daripada hari biasa. Cocok untuk libur nasional atau hari khusus." : "Enter holiday dates when spending should be treated as more relaxed than a normal weekday. This is useful for public holidays or special calendar days."}
        >
          <Textarea
            rows={3}
            value={holidayDates}
            onChange={(event) => onHolidayDatesChange(event.target.value)}
            placeholder="2026-01-01, 2026-04-13"
          />
        </FormField>

        <div className="flex items-end">
          <Button className="w-full lg:w-auto lg:min-w-44" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? t("common.saving") : t("recommendations.controls.refresh")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
