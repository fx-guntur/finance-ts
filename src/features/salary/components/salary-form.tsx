import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { FormField } from "../../../components/forms/form-field";
import { fadeInUp } from "../../../lib/motion";
import { currencies } from "../../../lib/constants/currencies";
import { useTranslations } from "../../../i18n/use-translations";
import type { SalaryFormErrors, SalaryFormValues } from "../types";

type SalaryFormProps = {
  values: SalaryFormValues;
  errors: SalaryFormErrors;
  isSaving: boolean;
  onChange: (next: SalaryFormValues) => void;
  onSubmit: () => void;
};

export function SalaryForm({ values, errors, isSaving, onChange, onSubmit }: SalaryFormProps) {
  const { t, locale } = useTranslations();

  return (
    <motion.form
      variants={fadeInUp}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label={t("salary.monthly")} description={t("salary.section.form.description")} error={errors.monthlySalary}>
          <Input
            inputMode="decimal"
            placeholder={locale === "id" ? "2.800.000" : "2500"}
            value={values.monthlySalary}
            onChange={(event) => onChange({ ...values, monthlySalary: event.target.value })}
          />
        </FormField>

        <FormField label={t("salary.currency")} description={t("salary.section.form.description")} error={errors.currency}>
          <Select value={values.currency} onChange={(event) => onChange({ ...values, currency: event.target.value })}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency === "IDR" ? "IDR (Rp)" : currency}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label={t("salary.paydayDay")} description={t("salary.section.form.description")} error={errors.paydayDay}>
          <Input
            type="number"
            min={1}
            max={31}
            inputMode="numeric"
            value={values.paydayDay}
            onChange={(event) => onChange({ ...values, paydayDay: event.target.value })}
          />
        </FormField>

        <FormField label={t("salary.effectiveFrom")} description={t("salary.section.form.description")} error={errors.effectiveFrom}>
          <Input
            type="date"
            value={values.effectiveFrom}
            onChange={(event) => onChange({ ...values, effectiveFrom: event.target.value })}
          />
        </FormField>
      </div>

      <FormField label={t("salary.effectiveTo")} description={t("salary.section.form.description")} error={errors.effectiveTo}>
        <Input
          type="date"
          value={values.effectiveTo}
          onChange={(event) => onChange({ ...values, effectiveTo: event.target.value })}
        />
      </FormField>

      <label className="flex items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-4 py-3">
        <Checkbox
          checked={values.isActive}
          onChange={(event) => onChange({ ...values, isActive: event.target.checked })}
        />
        <span>
          <span className="block text-sm font-medium">{t("salary.activeToggle")}</span>
          <span className="block text-xs text-[hsl(var(--muted-foreground))]">{t("salary.activeToggle.desc")}</span>
        </span>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[hsl(var(--muted-foreground))]">{t("monthly.form.empty")}</div>
        <Button type="submit" size="lg" disabled={isSaving}>
          {isSaving ? t("common.loading") : t("salary.save")}
        </Button>
      </div>
    </motion.form>
  );
}
