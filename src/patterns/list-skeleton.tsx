import { cn } from "../lib/utils";
import { Skeleton } from "../primitives/skeleton";

/** Props for {@link ListSkeleton}. */
interface ListSkeletonProps {
  /** Number of skeleton rows to render. Defaults to 3. */
  count?: number;
  /** Height class for each skeleton row. Defaults to "h-32". */
  height?: string;
  className?: string;
}

/**
 * Loading placeholder for list pages. Renders stacked skeleton rows.
 * Replaces repeated Skeleton blocks across list pages.
 */
export function ListSkeleton({
  count = 3,
  height = "h-32",
  className,
}: ListSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={cn(height, "w-full rounded-lg")} />
      ))}
    </div>
  );
}
