import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[var(--radius-xl)] p-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
