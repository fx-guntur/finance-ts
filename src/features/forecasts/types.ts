export type ForecastScenarioName = "conservative" | "balanced" | "stretch";

export type ForecastPoint = {
  date: string;
  projectedBalance: number;
  projectedSpend: number;
  projectedSavings: number;
  projectedDailyBudget: number;
};

export type ForecastScenario = {
  name: ForecastScenarioName;
  label: string;
  multiplier: number;
  projectedEndingBalance: number;
  projectedTotalSpend: number;
  projectedTotalSavings: number;
  projectedAverageDailyBudget: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  rationale: string[];
  path: ForecastPoint[];
};

export type ForecastImpactAnalysis = {
  currentSpendRate: number;
  projectedSpendRate: number;
  differenceAmount: number;
  differencePercent: number;
  commentary: string[];
};

export type ForecastSavingsProjection = {
  projectedSavings: number;
  projectedSavingsRate: number;
  projectedEndingBalance: number;
  savingsAtRisk: boolean;
  rationale: string[];
};

export type ForecastSummary = {
  selectedDate: string;
  horizonDays: number;
  salaryAmount: number;
  recurringAmount: number;
  currentSpentAmount: number;
  remainingBalance: number;
  averageDailySpend: number;
  estimatedDailyBudget: number;
};

export type ForecastOverview = {
  engineVersion: string;
  summary: ForecastSummary;
  activeScenario: ForecastScenario;
  scenarios: ForecastScenario[];
  impactAnalysis: ForecastImpactAnalysis;
  savingsProjection: ForecastSavingsProjection;
  mlSignals: string[];
};

export type ForecastQuery = {
  date?: string;
  horizonDays?: string;
};
