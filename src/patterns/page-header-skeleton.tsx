import { cn } from "../lib/utils";
import { Skeleton } from "../primitives/skeleton";

/** Props for {@link PageHeaderSkeleton}. */
interface PageHeaderSkeletonProps {
  className?: string;
}

/**
 * Loading placeholder for a page header (title + action buttons).
 * Matches the common layout used across list and detail pages.
 */
export function PageHeaderSkeleton({ className }: PageHeaderSkeletonProps) {
  return (
    <div className={cn("flex justify-between items-center", className)}>
      <Skeleton className="h-8 w-48" />
      <div className="flex gap-3">
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}
