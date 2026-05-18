import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useTranslations } from "../../i18n/use-translations";

type LoadingStateProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
  children?: ReactNode;
};

export function LoadingState({ label = "Loading...", children, className, ...props }: LoadingStateProps) {
  const { t } = useTranslations();
  return (
    <div className={cn("animate-pulse rounded-[var(--radius-xl)] border border-[hsl(var(--border))] p-5", className)} {...props}>
      <div className="h-4 w-28 rounded-full bg-[hsl(var(--muted))]" />
      <div className="mt-4 h-24 rounded-2xl bg-[hsl(var(--muted))] opacity-60" />
      <div className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">{label === "Loading..." ? t("common.loading") : label || t("common.loading")}</div>
      {children}
    </div>
  );
}
