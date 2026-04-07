import { cn } from "../lib/utils";

/** Supported slot layout variants. */
export type SlotVariant = "default" | "horizontal" | "fixed";

/** Props for {@link Slot}. */
export interface SlotProps {
  /** Layout variant: "default" (vertical fill), "horizontal" (row), or "fixed" (square). */
  variant?: SlotVariant;
  /** Label text displayed inside the placeholder. Defaults to "SLOT". */
  label?: string;
  /** Additional CSS classes for the outer container. */
  className?: string;
}

/**
 * Visual placeholder marking where customizable content can be inserted.
 * Used in stories and component demos to communicate composable insertion points.
 *
 * Fuchsia styling distinguishes slots from real UI at a glance.
 *
 * @see components/patterns/card.tsx for data-slot usage in production components
 */
export function Slot({
  variant = "default",
  label = "SLOT",
  className,
}: SlotProps) {
  return (
    <div
      data-slot="slot"
      className={cn(
        "flex items-center justify-center rounded-md border-2 border-dashed border-fuchsia-300 bg-fuchsia-200",
        variant === "default" && "min-h-32 w-full flex-col",
        variant === "horizontal" && "min-h-12 w-full flex-row",
        variant === "fixed" && "size-12 shrink-0",
        className,
      )}
    >
      <span className="text-caption font-mono uppercase tracking-widest text-fuchsia-700 select-none">
        {label}
      </span>
    </div>
  );
}
