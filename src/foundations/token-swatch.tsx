import { cn } from "../lib/utils";

/**
 * Props for {@link TokenSwatch}.
 * Renders a color swatch square with label and optional description.
 */
export interface TokenSwatchProps {
  /** CSS custom property name, e.g. "--background". */
  token: string;
  /** Display name shown below the swatch. */
  label: string;
  /** Optional usage note shown below the label. */
  description?: string;
  /** When true, renders as text color on a neutral background instead of a filled square. */
  asForeground?: boolean;
  className?: string;
}

/**
 * Color swatch for design token documentation.
 * Renders a square filled with a CSS variable color, plus label and description.
 * Supports `asForeground` mode to preview text colors on a neutral background.
 *
 * @see app/globals.css for color token definitions
 */
export function TokenSwatch({
  token,
  label,
  description,
  asForeground = false,
  className,
}: TokenSwatchProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className={cn(
          "h-16 w-16 rounded-md border border-border",
          asForeground && "flex items-center justify-center bg-muted"
        )}
        style={
          asForeground
            ? { color: `var(${token})` }
            : { backgroundColor: `var(${token})` }
        }
      >
        {asForeground && (
          <span className="text-body-bold" style={{ color: `var(${token})` }}>
            Aa
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-caption-bold text-foreground">{label}</span>
        {description && (
          <span className="text-caption text-muted-foreground">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}
