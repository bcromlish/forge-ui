import type { ReactNode } from "react";
import { Badge } from "../primitives/badge";
import { cn } from "../lib/utils";

/**
 * Props for {@link TagList}.
 * Renders a list of badges with optional overflow truncation.
 */
export interface TagListProps {
  /** Items to render as badges. Empty array renders nothing. */
  items: string[];
  /** Maximum visible items before showing "+N more" overflow badge. */
  max?: number;
  /** Badge variant applied to all default-rendered badges. */
  variant?: "secondary" | "outline";
  /** Custom render function for each badge. Overrides default Badge rendering. */
  renderBadge?: (item: string) => ReactNode;
  className?: string;
}

/**
 * Reusable badge list with overflow support.
 * Shows first `max` items as badges plus a "+N more" indicator when truncated.
 * Used for skills, tags, question types, template variables, and merge fields.
 */
export function TagList({
  items,
  max,
  variant = "secondary",
  renderBadge,
  className,
}: TagListProps) {
  if (items.length === 0) return null;

  const visible = max !== undefined ? items.slice(0, max) : items;
  const overflowCount = max !== undefined ? items.length - max : 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {visible.map((item) => (
        <span key={item}>
          {renderBadge ? (
            renderBadge(item)
          ) : (
            <Badge variant={variant}>{item}</Badge>
          )}
        </span>
      ))}
      {overflowCount > 0 && (
        <Badge variant="outline">+{overflowCount} more</Badge>
      )}
    </div>
  );
}
