import type { CategoryRecord } from "../categories/categories.types";

export type DailyExpenseRecord = {
  id: string;
  userId: string;
  categoryId: string;
  spentAt: string;
  amount: number;
  merchantName: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  category: CategoryRecord;
};

export type DailyExpenseSummary = {
  selectedDate: string;
  totalAmount: number;
  entryCount: number;
  averageAmount: number;
  highestCategoryName: string | null;
  highestCategoryAmount: number;
  recentHistoryCount: number;
};

export type DailyExpensesOverview = {
  selectedDate: string;
  expenses: DailyExpenseRecord[];
  history: DailyExpenseRecord[];
  categories: CategoryRecord[];
  summary: DailyExpenseSummary;
};

export type DailyExpenseUpsertInput = {
  userId: string;
  categoryId: string;
  amount: number;
  spentAt: Date;
  merchantName?: string | null;
  note?: string | null;
};
