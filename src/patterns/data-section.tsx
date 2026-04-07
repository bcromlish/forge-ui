import type { ReactNode } from "react";
import { Separator } from "../primitives/separator";
import { Badge } from "../primitives/badge";
import { cn } from "../lib/utils";

/**
 * Props for {@link DataSection}.
 *
 * @see DataSection for usage in detail panels
 */
export interface DataSectionProps {
  /** Section heading text, rendered as h4. */
  title: string;
  /** Optional item count displayed as a badge next to the title. */
  count?: number;
  /** Whether to render a Separator after the section content. Defaults to true. */
  separator?: boolean;
  /** Message shown when children are empty/null. */
  emptyMessage?: string;
  /** Section content. */
  children: ReactNode;
  /** Additional CSS classes for the outer wrapper. */
  className?: string;
}

/**
 * Titled section for detail panels. Extracts the repeated
 * `h4 + children + Separator` pattern from CandidateDetail,
 * ApplicationDetail, and other detail views.
 */
export function DataSection({
  title,
  count,
  separator = true,
  emptyMessage,
  children,
  className,
}: DataSectionProps) {
  const isEmpty = children == null || children === false;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        <h4 className="text-title-3">{title}</h4>
        {count != null && (
          <Badge variant="secondary">{count}</Badge>
        )}
      </div>

      {isEmpty && emptyMessage ? (
        <p className="text-body text-muted-foreground">{emptyMessage}</p>
      ) : (
        children
      )}

      {separator && <Separator className="mt-2" />}
    </div>
  );
}
