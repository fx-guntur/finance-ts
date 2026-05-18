import { DashboardShell } from "../../components/layout/dashboard-shell";
import { RouteView } from "../routes/route-view";

export function AppShell() {
  return (
    <DashboardShell>
      <RouteView />
    </DashboardShell>
  );
}
