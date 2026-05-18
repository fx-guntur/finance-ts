import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { FormField } from "../../../components/forms/form-field";
import { fadeInUp } from "../../../lib/motion";
import { useTranslations } from "../../../i18n/use-translations";
import type { CategoryRecord, MonthlyExpenseFormValues } from "../types";

type MonthlyExpenseFormProps = {
  categories: CategoryRecord[];
  values: MonthlyExpenseFormValues;
  errors: Partial<Record<keyof MonthlyExpenseFormValues, string>>;
  isSaving: boolean;
  submitLabel: string;
  onChange: (next: MonthlyExpenseFormValues) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isEditing?: boolean;
};

export function MonthlyExpenseForm({
  categories,
  values,
  errors,
  isSaving,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
  isEditing = false,
}: MonthlyExpenseFormProps) {
  const { t, locale } = useTranslations();
  return (
    <motion.form
      variants={fadeInUp}
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label={t("monthly.form.category")}
          description={locale === "id" ? "Pilih kelompok untuk pengeluaran rutin ini." : "Choose the group for this recurring expense."}
          guide={locale === "id" ? "Kategori membantu mengelompokkan biaya rutin, menampilkan total bulanan, dan memudahkan analisis. Kategori berbeda dari nominal; kategori menjawab 'pengeluaran ini termasuk apa', sedangkan nominal menjawab 'berapa besar biayanya'." : "Categories help group recurring costs, show monthly totals, and make analysis easier. A category is different from the amount; the category answers 'what kind of expense is this' while the amount answers 'how much is it'."}
          error={errors.categoryId}
        >
          <Select
            value={values.categoryId}
            onChange={(event) => onChange({ ...values, categoryId: event.target.value })}
          >
            <option value="">{t("monthly.form.selectCategory")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label={t("monthly.form.title")}
          description={locale === "id" ? "Nama yang mudah dikenali untuk tagihan ini." : "A clear name for this recurring bill."}
          guide={locale === "id" ? "Judul adalah nama yang Anda baca di daftar, misalnya Sewa, Internet, Asuransi, atau Subscription. Judul memudahkan pencarian dan review." : "Title is the readable name you see in the list, such as Rent, Internet, Insurance, or Subscription. It makes browsing and review easier."}
          error={errors.title}
        >
          <Input
            placeholder={locale === "id" ? "Sewa, Langganan, Listrik" : "Rent, Subscription, Utilities"}
            value={values.title}
            onChange={(event) => onChange({ ...values, title: event.target.value })}
          />
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label={t("monthly.form.amount")}
          description={locale === "id" ? "Nominal bulanan untuk kewajiban rutin ini." : "The monthly amount for this recurring obligation."}
          guide={locale === "id" ? "Nominal adalah besarnya uang yang harus dibayar setiap bulan. Angka ini berbeda dari kategori dan dipakai langsung dalam total bulanan, sisa anggaran, dan rekomendasi." : "The amount is the money you pay each month. It is separate from the category and is used directly in monthly totals, remaining budget, and recommendations."}
          error={errors.amount}
        >
          <Input
            inputMode="decimal"
            placeholder={locale === "id" ? "1.250.000" : "1250"}
            value={values.amount}
            onChange={(event) => onChange({ ...values, amount: event.target.value })}
          />
        </FormField>

        <FormField
          label={t("monthly.form.dueDay")}
          description={locale === "id" ? "Tanggal dalam sebulan saat tagihan dibayar." : "The day of the month when the bill is due."}
          guide={locale === "id" ? "Tanggal jatuh tempo dipakai untuk menentukan kapan tagihan berikutnya muncul, kapan pengingat dikirim, dan bagaimana jadwal bulanan disusun." : "The due day is used to calculate the next due date, payment reminders, and monthly scheduling."}
          error={errors.dueDay}
        >
          <Input
            type="number"
            min={1}
            max={31}
            inputMode="numeric"
            value={values.dueDay}
            onChange={(event) => onChange({ ...values, dueDay: event.target.value })}
          />
        </FormField>
      </div>

      <FormField
        label={t("monthly.form.notes")}
        description={locale === "id" ? "Konteks tambahan opsional." : "Optional extra context."}
        guide={locale === "id" ? "Catatan dapat berisi nomor kontrak, detail perpanjangan, nama penyedia, atau pengingat. Catatan tidak memengaruhi perhitungan." : "Use notes for contract numbers, renewal details, provider names, or reminders. Notes do not affect calculations."}
      >
        <Textarea
          value={values.notes}
          onChange={(event) => onChange({ ...values, notes: event.target.value })}
          placeholder={locale === "id" ? "Tambahkan pengingat, detail kontrak, atau konteks pembayaran." : "Add reminders, contract details, or payment context."}
        />
      </FormField>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-4 py-3">
          <Checkbox
            checked={values.isMandatory}
            onChange={(event) => onChange({ ...values, isMandatory: event.target.checked })}
          />
          <span>
            <span className="block text-sm font-medium">{locale === "id" ? "Biaya wajib" : "Mandatory expense"}</span>
            <span className="block text-xs text-[hsl(var(--muted-foreground))]">
              {locale === "id"
                ? "Tandai untuk tagihan penting yang tidak bisa dihapus dari perhitungan."
                : "Mark this for essential bills that should be treated as non-optional."}
            </span>
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-4 py-3">
          <Checkbox
            checked={values.isActive}
            onChange={(event) => onChange({ ...values, isActive: event.target.checked })}
          />
          <span>
            <span className="block text-sm font-medium">{locale === "id" ? "Item aktif" : "Active recurring item"}</span>
            <span className="block text-xs text-[hsl(var(--muted-foreground))]">
              {locale === "id"
                ? "Item aktif ikut dihitung dalam total dan logika jatuh tempo. Item nonaktif tetap tersimpan di riwayat."
                : "Active items are counted in totals and due-date logic. Inactive items stay in history only."}
            </span>
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[hsl(var(--muted-foreground))]">
          {isEditing
            ? locale === "id"
              ? "Sedang mengubah pengeluaran rutin yang sudah ada."
              : "Editing an existing recurring expense."
            : locale === "id"
              ? "Pengeluaran baru akan masuk ke total bulanan."
              : "New recurring expense will be added to the monthly total."}
        </div>
        <div className="flex gap-2">
          {isEditing && onCancel ? (
            <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
              {t("monthly.form.cancel")}
            </Button>
          ) : null}
          <Button type="submit" size="lg" disabled={isSaving || categories.length === 0}>
            {isSaving ? t("common.saving") : submitLabel}
          </Button>
        </div>
      </div>
    </motion.form>
  );
}
