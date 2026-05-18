import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";

type DashboardShellProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardShell({ children, className }: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className={cn("min-h-screen px-4 py-4 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto flex max-w-[1600px] gap-4 lg:gap-6">
        <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <TopNavbar onMenuClick={() => setMobileSidebarOpen(true)} />
          <main className="min-w-0 flex-1 pb-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
