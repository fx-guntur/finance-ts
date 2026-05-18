import { motion } from "framer-motion";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Checkbox } from "../../../components/ui/checkbox";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { FormField } from "../../../components/forms/form-field";
import { fadeInUp } from "../../../lib/motion";
import { useTranslations } from "../../../i18n/use-translations";
import type { CategoryFormValues, CategoryRecord } from "../types";

type CategoryPanelProps = {
  categories: CategoryRecord[];
  values: CategoryFormValues;
  errors: Partial<Record<keyof CategoryFormValues, string>>;
  isSaving: boolean;
  onChange: (next: CategoryFormValues) => void;
  onSubmit: () => void;
};

export function CategoryPanel({ categories, values, errors, isSaving, onChange, onSubmit }: CategoryPanelProps) {
  const { t, locale } = useTranslations();
  return (
    <Card className="space-y-4">
      <motion.div variants={fadeInUp}>
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold">{t("monthly.createCategory")}</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{t("monthly.createCategory.description")}</p>
          </div>

          <FormField
            label={t("monthly.category.name")}
            description={locale === "id" ? "Label yang mudah dibaca untuk kategori." : "Human-readable label for the reusable category."}
            guide={locale === "id" ? "Nama kategori adalah label yang Anda lihat di form dan grafik, misalnya Listrik, Makanan, Sewa, Transportasi, atau Gaji. Fungsinya untuk pengelompokan dan filter." : "Category name is the label you see in expense forms and charts, such as Utilities, Food, Rent, Transport, or Salary. It is used for grouping and filtering."}
            error={errors.name}
          >
            <Input
              placeholder={locale === "id" ? "Listrik" : "Utilities"}
              value={values.name}
              onChange={(event) => onChange({ ...values, name: event.target.value })}
            />
          </FormField>

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              label={t("monthly.category.type")}
              description={locale === "id" ? "Menentukan bagaimana kategori dipakai dalam anggaran dan analisis." : "Controls how the category is used in budgeting and analytics."}
              guide={locale === "id" ? "Biaya tetap dipakai untuk kewajiban bulanan rutin. Pengeluaran harian dipakai untuk belanja sehari-hari. Pemasukan dipakai jika Anda ingin mengelompokkan gaji atau sumber pendapatan lain." : "Fixed expense is for recurring monthly obligations. Daily expense is for day-to-day spending. Income is for inflow categories if you want to classify salary or other revenue sources."}
              error={errors.type}
            >
              <Select value={values.type} onChange={(event) => onChange({ ...values, type: event.target.value })}>
                <option value="fixed_expense">{t("monthly.category.type.fixed")}</option>
                <option value="daily_expense">{t("monthly.category.type.daily")}</option>
                <option value="income">{t("monthly.category.type.income")}</option>
              </Select>
            </FormField>
            <FormField
              label={t("monthly.category.color")}
              description={locale === "id" ? "Warna visual yang dipakai di badge dan grafik." : "Visual label used in chips and charts."}
              guide={locale === "id" ? "Warna hex hanya untuk tampilan. Fungsinya membantu kategori terlihat jelas di UI dan grafik. Warna tidak mempengaruhi perhitungan atau perilaku kategori." : "The hex color is only for presentation. It helps the category stand out in the UI and charts. It does not affect calculations, amount, or category behavior."}
            >
              <Input
                placeholder="#4f46e5"
                value={values.color}
                onChange={(event) => onChange({ ...values, color: event.target.value })}
              />
            </FormField>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              label={t("monthly.category.icon")}
              description={locale === "id" ? "Identitas ikon opsional untuk kategori." : "Optional icon identifier for the category."}
              guide={locale === "id" ? "Icon key adalah referensi UI untuk memetakan kategori ke nama ikon nanti. Sifatnya kosmetik dan tidak mengubah logika keuangan." : "Icon key is a UI reference used to map a category to an icon name later. It is cosmetic and does not change the money logic."}
            >
              <Input
                placeholder={locale === "id" ? "dompet" : "wallet"}
                value={values.iconKey}
                onChange={(event) => onChange({ ...values, iconKey: event.target.value })}
              />
            </FormField>
            <FormField
              label={t("monthly.category.sort")}
              description={locale === "id" ? "Mengatur urutan tampil kategori di daftar." : "Controls category ordering in lists."}
              guide={locale === "id" ? "Urutan hanya untuk prioritas tampilan. Angka yang lebih kecil akan tampil lebih dulu." : "Sort order is only for display priority. Lower numbers appear earlier."}
            >
              <Input
                type="number"
                min={0}
                value={values.sortOrder}
                onChange={(event) => onChange({ ...values, sortOrder: event.target.value })}
              />
            </FormField>
          </div>

        <div className="flex gap-3 text-sm">
          <label className="flex items-start gap-2">
            <Checkbox checked={values.isActive} onChange={(event) => onChange({ ...values, isActive: event.target.checked })} />
            <span>
              <span className="block font-medium">{t("monthly.category.active")}</span>
              <span className="block text-xs text-[hsl(var(--muted-foreground))]">
                {locale === "id"
                  ? "Kategori aktif akan muncul di form dan bisa dipilih saat menambah pengeluaran."
                  : "Active categories appear in forms and can be selected for new expenses."}
              </span>
            </span>
          </label>
          <label className="flex items-start gap-2">
            <Checkbox checked={values.isSystem} onChange={(event) => onChange({ ...values, isSystem: event.target.checked })} />
            <span>
              <span className="block font-medium">{t("monthly.category.system")}</span>
              <span className="block text-xs text-[hsl(var(--muted-foreground))]">
                {locale === "id"
                  ? "Kategori sistem adalah default bawaan dan biasanya tidak dihapus."
                  : "System categories are reserved defaults and usually should not be removed."}
              </span>
            </span>
          </label>
        </div>

          <Button type="button" onClick={onSubmit} disabled={isSaving || !values.name || !values.type}>
            {isSaving ? t("common.loading") : t("monthly.category.action")}
          </Button>
        </div>
      </motion.div>

      <div className="space-y-3">
        <div className="text-sm font-medium">{locale === "id" ? "Kategori tersedia" : "Available categories"}</div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category.id} variant="neutral">
              {category.name}
            </Badge>
          ))}
          {categories.length === 0 ? (
            <div className="text-sm text-[hsl(var(--muted-foreground))]">{t("monthly.noCategories")}</div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
