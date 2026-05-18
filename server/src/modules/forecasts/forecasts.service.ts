import { AppError } from "../../shared/errors/app-error";
import { forecastEngineConfig } from "../../shared/constants/forecast.constants";
import {
  addDays,
  average,
  clamp,
  getDaysInMonth,
  isWeekend,
  parseDateKey,
  round,
  sum,
  toDateKey,
} from "../../shared/utils/financial-calculations";
import { ForecastsRepository } from "./forecasts.repository";
import type {
  ForecastImpactAnalysis,
  ForecastOverview,
  ForecastScenario,
  ForecastScenarioName,
  ForecastSavingsProjection,
  ForecastSummary,
} from "./forecasts.types";

function parseDate(value?: string) {
  if (!value) {
    return new Date();
  }

  const date = parseDateKey(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError("VALIDATION_ERROR", "Invalid date value", 400);
  }

  return date;
}

function getScenarioDefinitions() {
  return [
    { name: "conservative" as const, label: "Conservative", multiplier: forecastEngineConfig.conservativeMultiplier },
    { name: "balanced" as const, label: "Balanced", multiplier: forecastEngineConfig.balancedMultiplier },
    { name: "stretch" as const, label: "Stretch", multiplier: forecastEngineConfig.stretchMultiplier },
  ];
}

function calculateRiskLevel(endingBalance: number, recurringAmount: number) {
  if (endingBalance <= 0) {
    return "critical" as const;
  }

  if (endingBalance < recurringAmount * 0.25) {
    return "high" as const;
  }

  if (endingBalance < recurringAmount * 0.5) {
    return "moderate" as const;
  }

  return "low" as const;
}

function buildPath(
  startDate: Date,
  horizonDays: number,
  initialBalance: number,
  projectedDailyBudget: number,
  multiplier: number,
  weekendShare: number,
) {
  const path = [];
  let balance = initialBalance;
  let cumulativeSpend = 0;
  let cumulativeSavings = 0;

  for (let index = 1; index <= horizonDays; index += 1) {
    const currentDate = addDays(startDate, index);
    const dayAdjustment = isWeekend(currentDate) ? 1 + weekendShare : 1;
    const projectedSpend = projectedDailyBudget * multiplier * dayAdjustment;
    const projectedSavings = Math.max(0, projectedDailyBudget - projectedSpend) * 0.25;
    cumulativeSpend += projectedSpend;
    cumulativeSavings += projectedSavings;
    balance -= projectedSpend;

    path.push({
      date: toDateKey(currentDate),
      projectedBalance: round(balance),
      projectedSpend: round(cumulativeSpend),
      projectedSavings: round(cumulativeSavings),
      projectedDailyBudget: round(projectedDailyBudget),
    });
  }

  return path;
}

function buildScenario(
  name: ForecastScenarioName,
  label: string,
  multiplier: number,
  selectedDate: Date,
  horizonDays: number,
  projectedDailyBudget: number,
  startingBalance: number,
  recurringAmount: number,
  weekendShare: number,
): ForecastScenario {
  const path = buildPath(selectedDate, horizonDays, startingBalance, projectedDailyBudget, multiplier, weekendShare);
  const projectedEndingBalance = path[path.length - 1]?.projectedBalance ?? startingBalance;
  const projectedTotalSpend = path[path.length - 1]?.projectedSpend ?? 0;
  const projectedTotalSavings = path[path.length - 1]?.projectedSavings ?? 0;

  return {
    name,
    label,
    multiplier,
    projectedEndingBalance,
    projectedTotalSpend,
    projectedTotalSavings,
    projectedAverageDailyBudget: projectedDailyBudget,
    riskLevel: calculateRiskLevel(projectedEndingBalance, recurringAmount),
    rationale: [
      `Scenario multiplier: ${multiplier.toFixed(2)}x`,
      `Forecast horizon: ${horizonDays} day(s)`,
      `Weekend spend ratio: ${weekendShare.toFixed(2)}`,
    ],
    path,
  };
}

export class ForecastsService {
  constructor(private readonly repository = new ForecastsRepository()) {}

  async getOverview(userId: string, input: { date?: string; horizonDays?: number }): Promise<ForecastOverview> {
    const selectedDate = parseDate(input.date);
    const horizonDays = clamp(input.horizonDays ?? forecastEngineConfig.defaultHorizonDays, 1, forecastEngineConfig.maxHorizonDays);
    const { currentSalary, monthlyExpenses, dailyExpenses } = await this.repository.loadForecastInputs(userId, selectedDate);

    const salaryAmount = currentSalary?.monthlySalary ?? 0;
    const recurringAmount = sum(monthlyExpenses.filter((item) => item.isActive).map((item) => item.amount));
    const currentSpentAmount = sum(dailyExpenses.map((item) => item.amount));
    const remainingBalance = salaryAmount - recurringAmount - currentSpentAmount;
    const daysInMonth = getDaysInMonth(selectedDate);
    const elapsedDays = clamp(selectedDate.getDate(), 1, daysInMonth);
    const remainingDays = Math.max(1, daysInMonth - elapsedDays + 1);
    const averageDailySpend = average(dailyExpenses.map((item) => item.amount));
    const estimatedDailyBudget = remainingBalance > 0 ? remainingBalance / remainingDays : 0;
    const weekendSpend = sum(
      dailyExpenses.filter((item) => isWeekend(item.spentAt)).map((item) => item.amount),
    );
    const weekendShare = currentSpentAmount > 0 ? weekendSpend / currentSpentAmount : 0;
    const trendWindow = dailyExpenses.slice(-forecastEngineConfig.spendingTrendWindowDays).map((item) => item.amount);
    const trendBaseline = average(trendWindow);
    const trendDelta = averageDailySpend - trendBaseline;

    const scenarios = getScenarioDefinitions().map((scenario) =>
      buildScenario(
        scenario.name,
        scenario.label,
        scenario.multiplier,
        selectedDate,
        horizonDays,
        estimatedDailyBudget,
        remainingBalance,
        recurringAmount,
        weekendShare,
      ),
    );

    const activeScenario = scenarios.find((scenario) => scenario.name === "balanced") ?? scenarios[0];
    const impactAnalysis: ForecastImpactAnalysis = {
      currentSpendRate: round(averageDailySpend),
      projectedSpendRate: round(activeScenario.projectedAverageDailyBudget * activeScenario.multiplier),
      differenceAmount: round(activeScenario.projectedTotalSpend - currentSpentAmount),
      differencePercent: currentSpentAmount > 0 ? round(((activeScenario.projectedTotalSpend - currentSpentAmount) / currentSpentAmount) * 100, 1) : 0,
      commentary: [
        `Average historical daily spend: ${averageDailySpend.toFixed(2)}`,
        `Trend baseline: ${trendBaseline.toFixed(2)}`,
        `Trend delta: ${trendDelta.toFixed(2)}`,
      ],
    };

    const projectedSavings = Math.max(0, salaryAmount - recurringAmount - activeScenario.projectedTotalSpend);
    const savingsProjection: ForecastSavingsProjection = {
      projectedSavings: round(projectedSavings),
      projectedSavingsRate: salaryAmount > 0 ? round((projectedSavings / salaryAmount) * 100, 1) : 0,
      projectedEndingBalance: activeScenario.projectedEndingBalance,
      savingsAtRisk: projectedSavings < salaryAmount * (forecastEngineConfig.savingsProjectionPercent / 100),
      rationale: [
        `Projected savings assume ${forecastEngineConfig.savingsProjectionPercent}% savings discipline.`,
        activeScenario.projectedEndingBalance > 0 ? "Positive ending balance remains after the horizon." : "Ending balance becomes negative within the horizon.",
      ],
    };

    const summary: ForecastSummary = {
      selectedDate: toDateKey(selectedDate),
      horizonDays,
      salaryAmount,
      recurringAmount,
      currentSpentAmount,
      remainingBalance,
      averageDailySpend: round(averageDailySpend),
      estimatedDailyBudget: round(estimatedDailyBudget),
    };

    const mlSignals = [
      `FORECAST_HORIZON_${horizonDays}`,
      `TREND_DELTA_${Math.sign(trendDelta)}`,
      `WEEKEND_SHARE_${Math.round(weekendShare * 100)}`,
      `RISK_${activeScenario.riskLevel.toUpperCase()}`,
    ];

    const normalizedTrendDeviation = averageDailySpend > 0 ? Math.abs(trendDelta) / averageDailySpend : 0;
    if (normalizedTrendDeviation >= forecastEngineConfig.mlSignalThreshold) {
      mlSignals.push("TREND_DEVIATION_HIGH");
    }

    return {
      engineVersion: forecastEngineConfig.engineVersion,
      summary,
      activeScenario,
      scenarios,
      impactAnalysis,
      savingsProjection,
      mlSignals,
    };
  }
}
