import { AppError } from "../../shared/errors/app-error";
import { CategoriesRepository } from "../categories/categories.repository";
import { MonthlyExpensesRepository } from "./monthly-expenses.repository";
import type {
  MonthlyExpenseRecord,
  MonthlyExpenseSummary,
  MonthlyExpenseUpsertInput,
  MonthlyExpensesOverview,
} from "./monthly-expenses.types";

function buildSummary(expenses: MonthlyExpenseRecord[]): MonthlyExpenseSummary {
  const activeExpenses = expenses.filter((item) => item.isActive);
  const totalMonthlyAmount = activeExpenses.reduce((sum, item) => sum + item.amount, 0);
  const mandatoryCount = activeExpenses.filter((item) => item.isMandatory).length;
  const categoryTotals = new Map<string, number>();

  for (const expense of activeExpenses) {
    categoryTotals.set(expense.category.name, (categoryTotals.get(expense.category.name) ?? 0) + expense.amount);
  }

  const highestCategoryEntry = Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1])[0] ?? null;
  const nextDue = [...activeExpenses]
    .map((expense) => ({
      expense,
      nextDueDate: new Date(expense.nextDueDate),
    }))
    .sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime())[0];

  return {
    totalMonthlyAmount,
    activeCount: activeExpenses.length,
    mandatoryCount,
    nextDueAmount: nextDue ? nextDue.expense.amount : 0,
    nextDueTitle: nextDue ? nextDue.expense.title : null,
    nextDueDate: nextDue ? nextDue.nextDueDate.toISOString() : null,
    nextDueDays: nextDue ? nextDue.expense.daysUntilDue : null,
    highestCategoryName: highestCategoryEntry ? highestCategoryEntry[0] : null,
    highestCategoryAmount: highestCategoryEntry ? highestCategoryEntry[1] : 0,
  };
}

export class MonthlyExpensesService {
  constructor(
    private readonly repository = new MonthlyExpensesRepository(),
    private readonly categoriesRepository = new CategoriesRepository(),
  ) {}

  async getOverview(userId: string): Promise<MonthlyExpensesOverview> {
    const [expenses, categories] = await Promise.all([
      this.repository.findByUserId(userId),
      this.categoriesRepository.findByUserId(userId),
    ]);

    return {
      expenses,
      categories,
      summary: buildSummary(expenses),
    };
  }

  async createExpense(input: MonthlyExpenseUpsertInput): Promise<MonthlyExpenseRecord> {
    const category = await this.categoriesRepository.findByUserId(input.userId);
    if (!category.some((item) => item.id === input.categoryId)) {
      throw new AppError("VALIDATION_ERROR", "Category does not belong to this user", 400);
    }

    return this.repository.create(input);
  }

  async updateExpense(expenseId: string, userId: string, input: MonthlyExpenseUpsertInput) {
    const category = await this.categoriesRepository.findByUserId(userId);
    if (!category.some((item) => item.id === input.categoryId)) {
      throw new AppError("VALIDATION_ERROR", "Category does not belong to this user", 400);
    }

    const updated = await this.repository.update(expenseId, userId, input);
    if (!updated) {
      throw new AppError("NOT_FOUND", "Monthly expense not found", 404);
    }
    return updated;
  }

  async deleteExpense(expenseId: string, userId: string) {
    const deleted = await this.repository.softDelete(expenseId, userId);
    if (!deleted) {
      throw new AppError("NOT_FOUND", "Monthly expense not found", 404);
    }

    return { deleted: true };
  }
}
