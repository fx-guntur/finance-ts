import type { ChangeEvent, FormEvent } from "react";
import { Button } from "../../../components/ui/button";
import { FormField } from "../../../components/forms/form-field";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { useTranslations } from "../../../i18n/use-translations";
import type { CategoryRecord } from "../../categories/types";
import type { DailyExpenseFormValues } from "../types";

type DailyExpenseFormProps = {
  categories: CategoryRecord[];
  values: DailyExpenseFormValues;
  errors: Partial<Record<keyof DailyExpenseFormValues, string>>;
  isSaving: boolean;
  submitLabel: string;
  onChange: (values: DailyExpenseFormValues) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function DailyExpenseForm({
  categories,
  values,
  errors,
  isSaving,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: DailyExpenseFormProps) {
  const { t, locale } = useTranslations();
  function handleFieldChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    onChange({ ...values, [name]: value });
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="space-y-4" onSubmit={handleFormSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label={t("daily.form.category")} description={locale === "id" ? "Pilih kategori untuk belanja ini." : "Choose the category for this expense."} error={errors.categoryId}>
          <Select name="categoryId" value={values.categoryId} onChange={handleFieldChange}>
            <option value="">{t("daily.form.selectCategory")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label={t("daily.form.date")} description={t("daily.form.previousDate")} error={errors.spentAt}>
          <Input name="spentAt" type="date" value={values.spentAt} onChange={handleFieldChange} />
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label={t("daily.form.amount")} error={errors.amount}>
          <Input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder={locale === "id" ? "50.000" : "0.00"}
            value={values.amount}
            onChange={handleFieldChange}
          />
        </FormField>

        <FormField label={t("daily.form.merchant")} description={locale === "id" ? "Nama toko atau penyedia opsional." : "Optional vendor or merchant name."}>
          <Input name="merchantName" type="text" placeholder={locale === "id" ? "Kafe, minimarket, atau tempat lain" : "Coffee shop, grocery store, and so on"} value={values.merchantName} onChange={handleFieldChange} />
        </FormField>
      </div>

      <FormField label={t("daily.form.note")} description={locale === "id" ? "Catatan opsional untuk konteks belanja." : "Optional note for spending context."}>
        <Textarea name="note" rows={4} placeholder={locale === "id" ? "Pengeluaran ini untuk apa?" : "What was this expense for?"} value={values.note} onChange={handleFieldChange} />
      </FormField>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          {t("daily.form.cancel")}
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? t("common.saving") : submitLabel}
        </Button>
      </div>
    </form>
  );
}
