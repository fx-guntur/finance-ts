import { DashboardPage } from "../../features/dashboard/pages/dashboard-page";
import { SalaryPage } from "../../features/salary/pages/salary-page";
import { MonthlyExpensesPage } from "../../features/monthly-expenses/pages/monthly-expenses-page";
import { DailyExpensesPage } from "../../features/daily-expenses/pages/daily-expenses-page";
import { RecommendationsPage } from "../../features/recommendations/pages/recommendations-page";
import { ForecastsPage } from "../../features/forecasts/pages/forecasts-page";
import { Card } from "../../components/ui/card";
import { SectionHeader } from "../../components/layout/section-header";
import { useTranslations } from "../../i18n/use-translations";

function NotImplementedPage({ title, description }: { title: string; description: string }) {
  return (
    <Card className="space-y-4">
      <SectionHeader title={title} description={description} />
      <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] px-4 py-8 text-sm text-[hsl(var(--muted-foreground))]">
        Fitur ini akan segera tersedia.
      </div>
    </Card>
  );
}

export function RouteView() {
  const { t } = useTranslations();

  if (typeof window === "undefined") {
    return <DashboardPage />;
  }

  const pathname = window.location.pathname;

  if (pathname === "/salary") {
    return <SalaryPage />;
  }

  if (pathname === "/expenses") {
    return <MonthlyExpensesPage />;
  }

  if (pathname === "/daily-expenses") {
    return <DailyExpensesPage />;
  }

  if (pathname === "/recommendations") {
    return <RecommendationsPage />;
  }

  if (pathname === "/forecasts") {
    return <ForecastsPage />;
  }

  if (pathname === "/") {
    return <DashboardPage />;
  }

  return (
    <NotImplementedPage
      title={`${t("route.soon.title")}: ${pathname.replace("/", "").replace("-", " ") || "dashboard"}`}
      description={t("route.soon.body")}
    />
  );
}
