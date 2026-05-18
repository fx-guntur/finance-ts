import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))]/80 px-4 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/25",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
