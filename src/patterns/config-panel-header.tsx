import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/**
 * Props for {@link ConfigPanelHeader}.
 *
 * @see ConfigPanelHeader for config panel title bars
 */
export interface ConfigPanelHeaderProps {
  /** Human-readable label (e.g. block type name). */
  label: string;
  /** Icon element displayed before the label. */
  icon: ReactNode;
  /** Additional CSS classes for the outer wrapper. */
  className?: string;
}

/**
 * Panel header for config sidebars — shows an icon and label.
 * DialKit-inspired compact title bar with subtle background.
 */
export function ConfigPanelHeader({
  label,
  icon,
  className,
}: ConfigPanelHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b bg-muted/50 px-3 py-3",
        className,
      )}
    >
      <span className="text-muted-foreground [&>svg]:size-4">{icon}</span>
      <span className="text-body-bold">{label}</span>
    </div>
  );
}
