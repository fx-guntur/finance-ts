export type CategoryRecord = {
  id: string;
  userId: string;
  name: string;
  type: string;
  color: string | null;
  iconKey: string | null;
  sortOrder: number;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

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

export type MonthlyExpensesSummary = {
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
  summary: MonthlyExpensesSummary;
};

export type MonthlyExpenseFormValues = {
  categoryId: string;
  title: string;
  amount: string;
  dueDay: string;
  isMandatory: boolean;
  billingCycle: string;
  notes: string;
  isActive: boolean;
};

export type CategoryFormValues = {
  name: string;
  type: string;
  color: string;
  iconKey: string;
  sortOrder: string;
  isSystem: boolean;
  isActive: boolean;
};
