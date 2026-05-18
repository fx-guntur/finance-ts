import type { CategoryRecord } from "../categories/categories.types";

export type MonthlyExpenseRecord = {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  amount: number;
  dueDay: number;
  isMandatory: boolean;
  billingCycle: string;
  notes: string | null;
  isActive: boolean;
  nextDueDate: string;
  daysUntilDue: number;
  createdAt: string;
  updatedAt: string;
  category: CategoryRecord;
};

export type MonthlyExpenseSummary = {
  totalMonthlyAmount: number;
  activeCount: number;
  mandatoryCount: number;
  nextDueAmount: number;
  nextDueTitle: string | null;
  nextDueDate: string | null;
  nextDueDays: number | null;
  highestCategoryName: string | null;
  highestCategoryAmount: number;
};

export type MonthlyExpensesOverview = {
  expenses: MonthlyExpenseRecord[];
  categories: CategoryRecord[];
  summary: MonthlyExpenseSummary;
};

export type MonthlyExpenseUpsertInput = {
  userId: string;
  categoryId: string;
  title: string;
  amount: number;
  dueDay: number;
  isMandatory: boolean;
  billingCycle: string;
  notes?: string | null;
  isActive: boolean;
};
