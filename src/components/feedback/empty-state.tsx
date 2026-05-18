import type { ReactNode } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]">
        {icon ?? "i"}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="max-w-md text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
      </div>
      {actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </Card>
  );
}
