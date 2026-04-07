import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/** Props for {@link ListPageLayout}. */
interface ListPageLayoutProps {
  title: string;
  actions?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Page-level layout for list views: header bar + optional filter area + scrollable content.
 * Pure component — no hooks, accepts all content as props/children.
 */
export function ListPageLayout({
  title,
  actions,
  filters,
  children,
  className,
}: ListPageLayoutProps) {
  return (
    <div className={cn("max-w-6xl mx-auto flex flex-col gap-6", className)}>
      <div className="flex justify-between items-center">
        <h1 className="text-title-1">{title}</h1>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {filters && (
        <div className="flex flex-wrap gap-3 items-center">{filters}</div>
      )}
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
