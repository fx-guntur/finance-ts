import { toDateInputValue } from "../../lib/format/date";
import type { DailyExpenseFormValues } from "./types";

export function createInitialDailyExpenseFormValues(
  categoryId = "",
  spentAt = toDateInputValue(new Date()),
): DailyExpenseFormValues {
  return {
    categoryId,
    amount: "",
    spentAt,
    merchantName: "",
    note: "",
  };
}

export function validateDailyExpenseForm(values: DailyExpenseFormValues) {
  const errors: Partial<Record<keyof DailyExpenseFormValues, string>> = {};
  const amount = Number(values.amount);

  if (!values.categoryId) errors.categoryId = "Category is required.";
  if (!values.spentAt) errors.spentAt = "Expense date is required.";
  if (!values.amount || Number.isNaN(amount) || amount <= 0) {
    errors.amount = "Amount must be greater than zero.";
  }

  return errors;
}
