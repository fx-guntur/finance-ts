import { primaryNavigation, secondaryNavigation } from "../../lib/navigation";
import { cn } from "../../lib/cn";
import { Badge } from "../ui/badge";
import { useLocale } from "../../providers/locale-provider";

type SidebarProps = {
  className?: string;
  mobileOpen?: boolean;
  onClose?: () => void;
};

function NavGroup({
  titleKey,
  items,
  currentPath,
}: {
  titleKey: "sidebar.primary" | "sidebar.secondary";
  items: typeof primaryNavigation;
  currentPath: string;
}) {
  const { t } = useLocale();

  return (
    <section className="space-y-2">
      <h3 className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
        {t(titleKey)}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center justify-between rounded-2xl px-3 py-2.5 transition-colors",
              currentPath === item.href
                ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--foreground))]"
                : "hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]",
            )}
          >
            <span>
              <div className="text-sm font-medium">{t(item.labelKey)}</div>
              {item.descriptionKey ? (
                <div className="text-xs text-[hsl(var(--muted-foreground))]">{t(item.descriptionKey)}</div>
              ) : null}
            </span>
            <span className="text-xs text-[hsl(var(--muted-foreground))] opacity-0 transition-opacity group-hover:opacity-100">
              /
            </span>
          </a>
        ))}
      </nav>
    </section>
  );
}

function SidebarContent({ currentPath }: { currentPath: string }) {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="primary">{t("sidebar.financeDashboard")}</Badge>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{t("sidebar.brandName")}</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{t("sidebar.brandTagline")}</p>
        </div>
      </div>

      <NavGroup titleKey="sidebar.primary" items={primaryNavigation} currentPath={currentPath} />
      <NavGroup titleKey="sidebar.secondary" items={secondaryNavigation} currentPath={currentPath} />
    </div>
  );
}

export function Sidebar({ className, mobileOpen = false, onClose }: SidebarProps) {
  const { t } = useLocale();
  const currentPath = typeof window === "undefined" ? "/" : window.location.pathname;

  return (
    <>
      <aside
        className={cn(
          "glass-panel hidden h-[calc(100vh-2rem)] w-72 flex-col justify-between rounded-[var(--radius-xl)] p-4 lg:flex",
          className,
        )}
      >
        <SidebarContent currentPath={currentPath} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label={t("top.closeMenu")}
            className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="glass-panel absolute left-4 top-4 z-50 flex h-[calc(100vh-2rem)] w-[min(18rem,calc(100vw-2rem))] flex-col justify-between rounded-[var(--radius-xl)] p-4 shadow-2xl">
            <SidebarContent currentPath={currentPath} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
