import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "primary";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  children: ReactNode;
};

const badgeClasses: Record<BadgeVariant, string> = {
  neutral: "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]",
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  danger: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  primary: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
};

export function Badge({ variant = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        badgeClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
