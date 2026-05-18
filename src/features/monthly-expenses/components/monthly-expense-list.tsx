import { motion } from "framer-motion";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { EmptyState } from "../../../components/feedback/empty-state";
import { LoadingState } from "../../../components/feedback/loading-state";
import { fadeInUp, staggerChildren } from "../../../lib/motion";
import { formatCurrency } from "../../../lib/format/currency";
import { useTranslations } from "../../../i18n/use-translations";
import type { MonthlyExpenseRecord } from "../types";

type MonthlyExpenseListProps = {
  expenses: MonthlyExpenseRecord[];
  currency: string;
  isLoading?: boolean;
  onEdit: (expense: MonthlyExpenseRecord) => void;
  onDelete: (expenseId: string) => void;
};

export function MonthlyExpenseList({ expenses, currency, isLoading = false, onEdit, onDelete }: MonthlyExpenseListProps) {
  const { t, locale } = useTranslations();
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{t("monthly.section.list")}</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{t("monthly.section.list.description")}</p>
        </div>
      </div>

      {isLoading ? (
        <LoadingState label={locale === "id" ? "Memuat daftar pengeluaran rutin..." : "Loading recurring expense list..."} />
      ) : expenses.length === 0 ? (
        <EmptyState
          title={t("monthly.noExpenses")}
          description={t("monthly.noExpenses.description")}
        />
      ) : (
        <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-3">
          {expenses.map((expense) => (
            <motion.div key={expense.id} variants={fadeInUp}>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/25 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium">{expense.title}</h4>
                      <Badge variant={expense.isActive ? "success" : "neutral"}>
                        {expense.isActive ? t("status.active") : t("status.inactive")}
                      </Badge>
                      {expense.isMandatory ? <Badge variant="warning">{t("monthly.summary.mandatory")}</Badge> : null}
                    </div>
                    <div className="text-sm text-[hsl(var(--muted-foreground))]">
                      {expense.category.name} - {locale === "id" ? "Jatuh tempo" : "Due day"} {expense.dueDay} - {locale === "id" ? "Berikutnya" : "Next"} {new Date(expense.nextDueDate).toLocaleDateString(locale === "id" ? "id-ID" : "en-US")}
                    </div>
                    {expense.notes ? (
                      <div className="text-sm text-[hsl(var(--muted-foreground))]">{expense.notes}</div>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <div className="text-left sm:text-right">
                      <div className="text-lg font-semibold">{formatCurrency(expense.amount, currency)}</div>
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">
                        {expense.daysUntilDue} {locale === "id" ? "hari lagi" : "day(s) until due"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => onEdit(expense)}>
                        {t("common.edit")}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(expense.id)}>
                        {t("common.delete")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </Card>
  );
}
