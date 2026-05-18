import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useTheme } from "../../providers/theme-provider";
import { useLocale } from "../../providers/locale-provider";
import { cn } from "../../lib/cn";

type TopNavbarProps = {
  className?: string;
  onMenuClick?: () => void;
};

export function TopNavbar({ className, onMenuClick }: TopNavbarProps) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { locale, toggleLocale, t } = useLocale();

  const isDark = resolvedTheme === "dark";

  return (
    <header
      className={cn(
        "glass-panel sticky top-4 z-20 flex items-center justify-between rounded-[var(--radius-xl)] px-4 py-3",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          aria-label={t("top.openMenu")}
          onClick={onMenuClick}
        >
          <span className="flex flex-col gap-1">
            <span className="h-0.5 w-4 rounded-full bg-current" />
            <span className="h-0.5 w-4 rounded-full bg-current" />
            <span className="h-0.5 w-4 rounded-full bg-current" />
          </span>
        </Button>
        <div className="space-y-0.5">
          <div className="text-xs uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
            {t("top.overview")}
          </div>
          <div className="text-sm font-semibold">{t("top.dashboard")}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/70 p-1 shadow-sm sm:flex">
          <button
            type="button"
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              locale === "id"
                ? "bg-[hsl(var(--primary))]/15 text-[hsl(var(--foreground))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]",
            )}
            onClick={() => {
              if (locale !== "id") toggleLocale();
            }}
            aria-pressed={locale === "id"}
            aria-label={t("top.language")}
            title={t("top.language")}
          >
            {t("top.lang.id")}
          </button>
          <button
            type="button"
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              locale === "en"
                ? "bg-[hsl(var(--primary))]/15 text-[hsl(var(--foreground))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]",
            )}
            onClick={() => {
              if (locale !== "en") toggleLocale();
            }}
            aria-pressed={locale === "en"}
            aria-label={t("top.language")}
            title={t("top.language")}
          >
            {t("top.lang.en")}
          </button>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleLocale}
          className="sm:hidden"
          aria-label={t("top.language")}
        >
          {locale === "id" ? t("top.lang.id") : t("top.lang.en")}
        </Button>
        <Badge variant={isDark ? "primary" : "neutral"}>
          {theme === "system" ? `${theme} / ${resolvedTheme}` : theme}
        </Badge>
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleTheme}
          aria-label={t("top.theme")}
          title={t("top.theme")}
        >
          <i className={`fa-solid ${isDark ? "fa-sun" : "fa-moon"}`} aria-hidden="true" />
          <span className="sr-only">{t("top.theme")}</span>
        </Button>
      </div>
    </header>
  );
}
