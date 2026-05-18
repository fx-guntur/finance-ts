import { AppError } from "../../shared/errors/app-error";
import { CategoriesRepository } from "../categories/categories.repository";
import { DailyExpensesRepository } from "./daily-expenses.repository";
import type {
  DailyExpenseRecord,
  DailyExpenseSummary,
  DailyExpenseUpsertInput,
  DailyExpensesOverview,
} from "./daily-expenses.types";

function parseDate(value?: string) {
  if (!value) {
    return new Date();
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new AppError("VALIDATION_ERROR", "Invalid date value", 400);
  }

  return date;
}

function toDateKey(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join(
    "-",
  );
}

function buildSummary(expenses: DailyExpenseRecord[], historyCount: number, selectedDate: string): DailyExpenseSummary {
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);
  const categoryTotals = new Map<string, number>();

  for (const expense of expenses) {
    categoryTotals.set(expense.category.name, (categoryTotals.get(expense.category.name) ?? 0) + expense.amount);
  }

  const highestCategoryEntry = Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1])[0] ?? null;

  return {
    selectedDate,
    totalAmount,
    entryCount: expenses.length,
    averageAmount: expenses.length > 0 ? totalAmount / expenses.length : 0,
    highestCategoryName: highestCategoryEntry ? highestCategoryEntry[0] : null,
    highestCategoryAmount: highestCategoryEntry ? highestCategoryEntry[1] : 0,
    recentHistoryCount: historyCount,
  };
}

export class DailyExpensesService {
  constructor(
    private readonly repository = new DailyExpensesRepository(),
    private readonly categoriesRepository = new CategoriesRepository(),
  ) {}

  async getOverview(userId: string, selectedDateInput?: string): Promise<DailyExpensesOverview> {
    const selectedDate = parseDate(selectedDateInput);
    const [expenses, history, categories] = await Promise.all([
      this.repository.findByDate(userId, selectedDate),
      this.repository.findHistoryByUserId(userId),
      this.categoriesRepository.findByUserId(userId),
    ]);

    const selectedDateString = selectedDateInput ?? toDateKey(selectedDate);

    return {
      selectedDate: selectedDateString,
      expenses,
      history,
      categories,
      summary: buildSummary(expenses, history.length, selectedDateString),
    };
  }

  async createExpense(input: DailyExpenseUpsertInput): Promise<DailyExpenseRecord> {
    const categories = await this.categoriesRepository.findByUserId(input.userId);
    if (!categories.some((item) => item.id === input.categoryId)) {
      throw new AppError("VALIDATION_ERROR", "Category does not belong to this user", 400);
    }

    return this.repository.create(input);
  }

  async updateExpense(expenseId: string, userId: string, input: DailyExpenseUpsertInput) {
    const categories = await this.categoriesRepository.findByUserId(userId);
    if (!categories.some((item) => item.id === input.categoryId)) {
      throw new AppError("VALIDATION_ERROR", "Category does not belong to this user", 400);
    }

    const updated = await this.repository.update(expenseId, userId, input);
    if (!updated) {
      throw new AppError("NOT_FOUND", "Daily expense not found", 404);
    }

    return updated;
  }
}
