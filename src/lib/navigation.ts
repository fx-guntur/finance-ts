import type { TranslationKey } from "../i18n/messages";

export type NavigationItem = {
  labelKey: TranslationKey;
  href: string;
  descriptionKey?: TranslationKey;
};

export const primaryNavigation: NavigationItem[] = [
  { labelKey: "nav.dashboard", href: "/", descriptionKey: "nav.dashboard.description" },
  { labelKey: "nav.salary", href: "/salary", descriptionKey: "nav.salary.description" },
  { labelKey: "nav.monthlyExpenses", href: "/expenses", descriptionKey: "nav.monthlyExpenses.description" },
  { labelKey: "nav.dailyExpenses", href: "/daily-expenses", descriptionKey: "nav.dailyExpenses.description" },
  { labelKey: "nav.recommendations", href: "/recommendations", descriptionKey: "nav.recommendations.description" },
  { labelKey: "nav.forecasts", href: "/forecasts", descriptionKey: "nav.forecasts.description" },
  { labelKey: "nav.analytics", href: "/analytics", descriptionKey: "nav.analytics.description" },
];

export const secondaryNavigation: NavigationItem[] = [
  { labelKey: "nav.holidays", href: "/holidays", descriptionKey: "nav.holidays.description" },
  { labelKey: "nav.settings", href: "/settings", descriptionKey: "nav.settings.description" },
];
