import type { CategoryFormValues, MonthlyExpenseFormValues } from "./types";

export function createInitialMonthlyExpenseFormValues(categoryId = ""): MonthlyExpenseFormValues {
  return {
    categoryId,
    title: "",
    amount: "",
    dueDay: "1",
    isMandatory: true,
    billingCycle: "monthly",
    notes: "",
    isActive: true,
  };
}

export function createInitialCategoryFormValues(): CategoryFormValues {
  return {
    name: "",
    type: "fixed_expense",
    color: "",
    iconKey: "",
    sortOrder: "0",
    isSystem: false,
    isActive: true,
  };
}

export function validateMonthlyExpenseForm(values: MonthlyExpenseFormValues) {
  const errors: Partial<Record<keyof MonthlyExpenseFormValues, string>> = {};
  const amount = Number(values.amount);
  const dueDay = Number(values.dueDay);

  if (!values.categoryId) errors.categoryId = "Category is required.";
  if (!values.title || values.title.trim().length < 2) errors.title = "Title is required.";
  if (!values.amount || Number.isNaN(amount) || amount <= 0) errors.amount = "Amount must be greater than zero.";
  if (!values.dueDay || Number.isNaN(dueDay) || dueDay < 1 || dueDay > 31) {
    errors.dueDay = "Due day must be between 1 and 31.";
  }

  return errors;
}

export function validateCategoryForm(values: CategoryFormValues) {
  const errors: Partial<Record<keyof CategoryFormValues, string>> = {};

  if (!values.name || values.name.trim().length < 2) errors.name = "Category name is required.";
  if (!values.type || values.type.trim().length < 2) errors.type = "Category type is required.";

  return errors;
}
