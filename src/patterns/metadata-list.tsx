import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/** Props for {@link MetadataList}. */
export interface MetadataListProps {
  /** Layout direction: horizontal wraps items inline, vertical stacks them. */
  orientation?: "horizontal" | "vertical";
  children: ReactNode;
  className?: string;
}

/**
 * Container component for MetadataItem instances.
 * Provides consistent spacing and layout in horizontal (default) or vertical orientation.
 */
export function MetadataList({
  orientation = "horizontal",
  children,
  className,
}: MetadataListProps) {
  return (
    <div
      className={cn(
        orientation === "horizontal"
          ? "flex flex-wrap gap-x-4 gap-y-1"
          : "flex flex-col gap-1",
        className
      )}
    >
      {children}
    </div>
  );
}
