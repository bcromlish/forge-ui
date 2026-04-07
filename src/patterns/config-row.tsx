import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/**
 * Props for {@link ConfigRow}.
 *
 * @see ConfigRow for usage in config panels
 */
export interface ConfigRowProps {
  /** Field label displayed on the left (or above in fullWidth mode). */
  label: string;
  /** HTML `for` attribute linking the label to a form control. */
  htmlFor?: string;
  /** When true, label sits above and control fills full width below. */
  fullWidth?: boolean;
  /** The form control to render on the right (or below in fullWidth mode). */
  children: ReactNode;
  /** Additional CSS classes for the outer wrapper. */
  className?: string;
}

/**
 * Inline label+control row for config panels — DialKit-inspired layout.
 * Default: label left, control right. `fullWidth`: label above, control below.
 */
export function ConfigRow({
  label,
  htmlFor,
  fullWidth = false,
  children,
  className,
}: ConfigRowProps) {
  return (
    <div
      className={cn(
        fullWidth
          ? "flex flex-col gap-1"
          : "flex items-center justify-between gap-4",
        className,
      )}
    >
      <label
        htmlFor={htmlFor}
        className="text-caption text-muted-foreground shrink-0"
      >
        {label}
      </label>
      {fullWidth ? (
        <div className="w-full">{children}</div>
      ) : (
        <div className="min-w-0 flex-1">{children}</div>
      )}
    </div>
  );
}
