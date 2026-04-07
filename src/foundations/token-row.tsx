import { cn } from "../lib/utils";

/**
 * Props for {@link TokenRow}.
 * Renders a horizontal row documenting a single design token with a visual bar.
 */
export interface TokenRowProps {
  /** Token name, e.g. "--dim-7". */
  token: string;
  /** Resolved value, e.g. "16px". */
  value: string;
  /** Corresponding Tailwind utility class, e.g. "p-4". */
  tailwindClass?: string;
  /** Usage intent description, e.g. "Base: section padding". */
  intent?: string;
  /** CSS value for the visual bar width, e.g. "64px". */
  barWidth?: string;
  /** CSS value for bar border-radius to demonstrate shape tokens. */
  barRadius?: string;
  className?: string;
}

/**
 * Scale row for design token documentation.
 * Displays a visual bar alongside the token name, resolved value,
 * Tailwind class, and usage intent in a horizontal layout.
 *
 * @see app/styles/dimension.css for dimension token definitions
 * @see app/styles/shape.css for shape token definitions
 */
export function TokenRow({
  token,
  value,
  tailwindClass,
  intent,
  barWidth,
  barRadius,
  className,
}: TokenRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border-b border-border py-2",
        className
      )}
    >
      {/* Visual bar */}
      <div className="w-24 shrink-0">
        {barWidth && (
          <div
            className="h-4 rounded-sm bg-primary"
            style={{
              width: barWidth,
              ...(barRadius ? { borderRadius: barRadius } : {}),
            }}
          />
        )}
      </div>

      {/* Token name in monospace */}
      <code className="w-32 shrink-0 text-caption font-mono text-foreground">
        {token}
      </code>

      {/* Resolved value */}
      <span className="w-16 shrink-0 text-caption text-muted-foreground">
        {value}
      </span>

      {/* Tailwind class */}
      {tailwindClass && (
        <code className="w-24 shrink-0 text-caption font-mono text-muted-foreground">
          {tailwindClass}
        </code>
      )}

      {/* Intent description */}
      {intent && (
        <span className="text-caption text-muted-foreground">{intent}</span>
      )}
    </div>
  );
}
