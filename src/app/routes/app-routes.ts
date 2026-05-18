import type { TranslationKey } from "../../i18n/messages";

export type AppRouteConfig = {
  path: string;
  labelKey: TranslationKey;
  section: "primary" | "secondary";
  descriptionKey?: TranslationKey;
};

export const appRoutes: AppRouteConfig[] = [
  { path: "/", labelKey: "nav.dashboard", section: "primary", descriptionKey: "nav.dashboard.description" },
  { path: "/salary", labelKey: "nav.salary", section: "primary", descriptionKey: "nav.salary.description" },
  { path: "/expenses", labelKey: "nav.monthlyExpenses", section: "primary", descriptionKey: "nav.monthlyExpenses.description" },
  { path: "/daily-expenses", labelKey: "nav.dailyExpenses", section: "primary", descriptionKey: "nav.dailyExpenses.description" },
  { path: "/recommendations", labelKey: "nav.recommendations", section: "primary", descriptionKey: "nav.recommendations.description" },
  { path: "/forecasts", labelKey: "nav.forecasts", section: "primary", descriptionKey: "nav.forecasts.description" },
  { path: "/analytics", labelKey: "nav.analytics", section: "primary", descriptionKey: "nav.analytics.description" },
  { path: "/holidays", labelKey: "nav.holidays", section: "secondary", descriptionKey: "nav.holidays.description" },
  { path: "/settings", labelKey: "nav.settings", section: "secondary", descriptionKey: "nav.settings.description" },
];
