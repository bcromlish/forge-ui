"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../primitives/tooltip";

/** Props for {@link ToolbarTooltip}. */
interface ToolbarTooltipProps {
  label: string;
  shortcut?: string;
  children: React.ReactNode;
}

/**
 * Wraps a toolbar button with a tooltip showing the action name
 * and optional keyboard shortcut (e.g. "Bold ⌘B").
 */
export function ToolbarTooltip({
  label,
  shortcut,
  children,
}: ToolbarTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={6}>
          {label}
          {shortcut && (
            <kbd className="ml-1.5 text-caption opacity-60">{shortcut}</kbd>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
