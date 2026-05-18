import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[var(--radius-xl)] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
