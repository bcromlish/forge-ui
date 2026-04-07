import { cn } from "../lib/utils";
import { PageHeaderSkeleton } from "./page-header-skeleton";
import { ListSkeleton } from "./list-skeleton";

/** Props for {@link PageListSkeleton}. */
interface PageListSkeletonProps {
  /** Number of skeleton rows. Defaults to 3. */
  count?: number;
  /** Height class for each row. Defaults to "h-32". */
  height?: string;
  className?: string;
}

/**
 * Full-page loading placeholder for list pages.
 * Composes a page header skeleton with stacked list rows.
 * Designed for use in Next.js `loading.tsx` route files.
 */
export function PageListSkeleton({
  count,
  height,
  className,
}: PageListSkeletonProps) {
  return (
    <div
      className={cn(
        "w-full max-w-6xl mx-auto flex flex-col gap-6",
        className,
      )}
    >
      <PageHeaderSkeleton />
      <ListSkeleton count={count} height={height} />
    </div>
  );
}
