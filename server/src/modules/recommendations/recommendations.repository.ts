import { SalariesRepository } from "../salaries/salaries.repository";
import { MonthlyExpensesRepository } from "../monthly-expenses/monthly-expenses.repository";
import { DailyExpensesRepository } from "../daily-expenses/daily-expenses.repository";
import { endOfDay } from "../../shared/utils/financial-calculations";

export class RecommendationsRepository {
  constructor(
    private readonly salariesRepository = new SalariesRepository(),
    private readonly monthlyExpensesRepository = new MonthlyExpensesRepository(),
    private readonly dailyExpensesRepository = new DailyExpensesRepository(),
  ) {}

  async loadFinancialInputs(userId: string, selectedDate: Date) {
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

    const [currentSalary, monthlyExpenses, dailyExpensesToDate] = await Promise.all([
      this.salariesRepository.findCurrentByUserId(userId),
      this.monthlyExpensesRepository.findByUserId(userId),
      this.dailyExpensesRepository.findBetweenDates(userId, startOfMonth, endOfDay(selectedDate)),
    ]);

    return {
      currentSalary,
      monthlyExpenses,
      dailyExpensesToDate,
    };
  }
}
