/**
 * Table component for size-related design token documentation.
 * Renders sample cells (bars, radii, lines) alongside token metadata.
 * Uses real `<table>` elements matching the ColorTokenTable pattern.
 *
 * @see components/foundations/Size.stories.tsx
 * @see app/styles/dimension.css, app/styles/shape.css, app/styles/breakpoint.css
 */

/** Visual sample type discriminated union. */
export type SizeTokenSample =
  | { type: "bar"; width: string }
  | { type: "radius"; radius: string }
  | { type: "line"; thickness: string }
  | { type: "none" };

/** Definition for a single size-related design token. */
export interface SizeTokenDef {
  /** CSS custom property or Tailwind class name. */
  token: string;
  /** Resolved output value, e.g. "16px". */
  value: string;
  /** Tailwind utility class, e.g. "4" or "rounded-md". */
  tailwind?: string;
  /** Usage description. */
  description?: string;
  /** Visual sample configuration. */
  sample: SizeTokenSample;
}

/** Props for {@link SizeTokenTable}. */
export interface SizeTokenTableProps {
  /** Section heading displayed above the table. */
  title: string;
  /** Token definitions to render as rows. */
  tokens: SizeTokenDef[];
  /** Show a muted "Planned" badge next to the title. */
  placeholder?: boolean;
}

/** Renders the visual sample cell based on sample type. */
function SampleCell({ sample }: { sample: SizeTokenSample }) {
  switch (sample.type) {
    case "bar":
      return (
        <div
          className="h-4 max-w-full rounded-sm bg-primary"
          style={{ width: sample.width }}
        />
      );
    case "radius":
      return (
        <div
          className="h-8 w-8 border-2 border-primary bg-primary/10"
          style={{ borderRadius: sample.radius }}
        />
      );
    case "line":
      return (
        <div
          className="w-16 bg-foreground"
          style={{ height: sample.thickness }}
        />
      );
    case "none":
      return <div className="h-4 w-4" />;
  }
}

/**
 * Table showing size tokens with visual samples, values, and descriptions.
 * Inspired by GitHub Primer's size primitives documentation.
 */
export function SizeTokenTable({
  title,
  tokens,
  placeholder,
}: SizeTokenTableProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h3 className="text-title-3 text-foreground">{title}</h3>
        {placeholder && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-caption text-muted-foreground">
            Planned
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-border">
              {["Sample", "CSS Variable", "Value", "Tailwind", "Description"].map(
                (h) => (
                  <th
                    key={h}
                    className="pb-2 pr-6 text-left text-caption-bold text-muted-foreground last:pr-0"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {tokens.map((t) => (
              <tr key={t.token} className="border-b border-border">
                <td className="w-24 py-3 pr-6">
                  <SampleCell sample={t.sample} />
                </td>
                <td className="py-3 pr-6">
                  <code className="whitespace-nowrap font-mono text-caption text-foreground">
                    {t.token}
                  </code>
                </td>
                <td className="py-3 pr-6 text-caption text-muted-foreground">
                  {t.value}
                </td>
                <td className="py-3 pr-6">
                  {t.tailwind && (
                    <code className="whitespace-nowrap font-mono text-caption text-muted-foreground">
                      {t.tailwind}
                    </code>
                  )}
                </td>
                <td className="py-3 text-caption text-muted-foreground">
                  {t.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
