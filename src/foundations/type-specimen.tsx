import { cn } from "../lib/utils";

/**
 * Props for {@link TypeSpecimen}.
 * Renders a type sample with computed font metrics displayed below.
 */
export interface TypeSpecimenProps {
  /** Semantic type utility class, e.g. "text-title-2". */
  utilityClass: string;
  /** Font size value, e.g. "20px". */
  fontSize: string;
  /** Font weight value, e.g. "700". */
  fontWeight: string;
  /** Line height value, e.g. "1.3". */
  lineHeight: string;
  /** Letter spacing value, e.g. "-0.02em". */
  letterSpacing?: string;
  /** Text transform value, e.g. "uppercase". */
  textTransform?: string;
  /** Custom sample text. Defaults to the utility class name. */
  sample?: string;
  className?: string;
}

/**
 * Type specimen for typography documentation.
 * Renders sample text with the given utility class applied, plus
 * a row of font metrics (size, weight, line-height, letter-spacing)
 * in monospace below for quick reference.
 *
 * @see app/styles/typography.css for semantic type utility definitions
 */
export function TypeSpecimen({
  utilityClass,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textTransform,
  sample,
  className,
}: TypeSpecimenProps) {
  const displayText = sample ?? utilityClass;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-b border-border pb-4",
        className
      )}
    >
      {/* Specimen text rendered with the actual utility class */}
      <div className={cn(utilityClass, "text-foreground")}>{displayText}</div>

      {/* Metrics row */}
      <div className="flex flex-wrap gap-4">
        <MetricLabel label="class" value={utilityClass} />
        <MetricLabel label="size" value={fontSize} />
        <MetricLabel label="weight" value={fontWeight} />
        <MetricLabel label="line-height" value={lineHeight} />
        {letterSpacing && (
          <MetricLabel label="tracking" value={letterSpacing} />
        )}
        {textTransform && (
          <MetricLabel label="transform" value={textTransform} />
        )}
      </div>
    </div>
  );
}

/**
 * A single metric label + value pair shown in monospace below a type specimen.
 * Internal helper -- not exported.
 */
function MetricLabel({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-caption text-muted-foreground">
      <span className="font-mono">{label}:</span>{" "}
      <code className="font-mono text-foreground">{value}</code>
    </span>
  );
}
