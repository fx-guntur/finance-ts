import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  description?: string;
  guide?: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, description, guide, error, children }: FormFieldProps) {
  return (
    <label className="block space-y-2">
      <div className="space-y-1">
        <div className="text-sm font-medium">{label}</div>
        {description ? <div className="text-xs text-[hsl(var(--muted-foreground))]">{description}</div> : null}
      </div>
      {children}
      {guide ? (
        <details className="group">
          <summary
            aria-label={`Show help for ${label}`}
            className="list-none inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/40 text-xs font-semibold text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] [&::-webkit-details-marker]:hidden"
          >
            ?
          </summary>
          <div className="mt-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-3 py-2 text-xs leading-5 text-[hsl(var(--muted-foreground))]">
            {guide}
          </div>
        </details>
      ) : null}
      {error ? <div className="text-xs text-rose-500">{error}</div> : null}
    </label>
  );
}
