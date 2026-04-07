import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/** Props for {@link MetadataItem}. */
export interface MetadataItemProps {
  /** Icon element displayed before the value. Sized automatically based on `size`. */
  icon?: ReactNode;
  /** The metadata value to display (text, element, or fragment). */
  value: ReactNode;
  /** When provided, renders as an anchor tag linking to this URL. */
  href?: string;
  /** Icon dimensions: "sm" = 12px, "md" (default) = 16px. */
  size?: "sm" | "md";
  className?: string;
}

/** Size-specific icon classes. */
const ICON_SIZE: Record<NonNullable<MetadataItemProps["size"]>, string> = {
  sm: "[&_svg]:h-3 [&_svg]:w-3",
  md: "[&_svg]:h-4 [&_svg]:w-4",
};

/**
 * Icon + value pair for metadata display (email, phone, location, dates, etc.).
 * Renders as `<a>` when `href` is provided, `<span>` otherwise.
 */
export function MetadataItem({
  icon,
  value,
  href,
  size = "md",
  className,
}: MetadataItemProps) {
  const Comp = href ? "a" : "span";

  return (
    <Comp
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex items-center gap-1 text-caption text-muted-foreground",
        icon && ICON_SIZE[size],
        href && "hover:text-foreground hover:underline",
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{value}</span>
    </Comp>
  );
}
