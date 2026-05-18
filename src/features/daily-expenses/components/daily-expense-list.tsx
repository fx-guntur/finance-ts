import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { EmptyState } from "../../../components/feedback/empty-state";
import { LoadingState } from "../../../components/feedback/loading-state";
import { fadeInUp, staggerChildren } from "../../../lib/motion";
import { formatCurrency } from "../../../lib/format/currency";
import { formatFriendlyDate } from "../../../lib/format/date";
import { useTranslations } from "../../../i18n/use-translations";
import type { DailyExpenseRecord } from "../types";

type DailyExpenseListProps = {
  title: string;
  description: string;
  expenses: DailyExpenseRecord[];
  currency: string;
  isLoading: boolean;
  showDate?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  onEdit?: (expense: DailyExpenseRecord) => void;
};

export function DailyExpenseList({
  title,
  description,
  expenses,
  currency,
  isLoading,
  showDate = false,
  emptyTitle,
  emptyDescription,
  onEdit,
}: DailyExpenseListProps) {
  const { t, locale } = useTranslations();
  return (
    <motion.div variants={fadeInUp}>
      <Card className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
        </div>

        {isLoading ? (
          <LoadingState label={locale === "id" ? "Memuat daftar pengeluaran..." : "Loading spending list..."} />
        ) : expenses.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : null}

        {expenses.length > 0 ? (
          <motion.div variants={staggerChildren} className="space-y-3">
            {expenses.map((expense) => (
              <motion.article
                key={expense.id}
                variants={fadeInUp}
                className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/70 p-4 backdrop-blur-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="text-base font-semibold">{expense.merchantName || expense.category.name}</div>
                    <div className="text-sm text-[hsl(var(--muted-foreground))]">
                      {expense.category.name}
                      {showDate ? ` - ${formatFriendlyDate(expense.spentAt, locale)}` : ""}
                    </div>
                    {expense.note ? <div className="text-sm text-[hsl(var(--muted-foreground))]">{expense.note}</div> : null}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-semibold">{formatCurrency(expense.amount, currency)}</div>
                    </div>
                    {onEdit ? (
                      <Button variant="secondary" size="sm" onClick={() => onEdit(expense)}>
                        {t("common.edit")}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : null}
      </Card>
    </motion.div>
  );
}
