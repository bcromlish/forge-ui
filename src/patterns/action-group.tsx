import type { ReactNode } from "react";
import { Button } from "../primitives/button";
import { cn } from "../lib/utils";

/**
 * A single action item within an {@link ActionGroup}.
 * Destructive actions receive `text-destructive` styling automatically.
 */
export interface ActionItem {
  key: string;
  label: string;
  icon?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

/**
 * Props for {@link ActionGroup}.
 * Renders a horizontal row of ghost buttons with consistent sizing.
 */
export interface ActionGroupProps {
  actions: ActionItem[];
  size?: "xs" | "sm";
  className?: string;
}

/**
 * Renders a row of action buttons with ghost variant and consistent styling.
 * Extracted from the repeated view/edit/delete pattern across all card compositions.
 *
 * @see ActionItem for individual action configuration
 */
export function ActionGroup({
  actions,
  size = "sm",
  className,
}: ActionGroupProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {actions.map((action) => (
        <Button
          key={action.key}
          variant="ghost"
          size={size}
          disabled={action.disabled}
          className={cn(action.destructive && "text-destructive")}
          onClick={action.onClick}
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  );
}
