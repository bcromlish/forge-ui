import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/** Props for {@link EmptyState}. */
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Empty state placeholder with icon, heading, description, and optional CTA.
 * Use when a list/table has no data to display.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center",
        className
      )}
    >
      {icon && (
        <div className="text-muted-foreground [&_svg]:size-10">{icon}</div>
      )}
      <div className="block-blurb">
        <h3 className="text-title-3">{title}</h3>
        {description && (
          <p className="text-body text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
