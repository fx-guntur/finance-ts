import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-[hsl(var(--border))] bg-[hsl(var(--surface))]",
        "text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]/25",
        className,
      )}
      {...props}
    />
  );
}
