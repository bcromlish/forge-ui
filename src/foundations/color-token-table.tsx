/**
 * Table component for semantic color token documentation.
 * Renders side-by-side light/dark swatches using raw palette CSS variables
 * so colors display correctly regardless of the active Storybook theme.
 *
 * @see components/foundations/Semantic.stories.tsx
 * @see app/globals.css for semantic token definitions
 */

/** Definition for a single semantic color token with light/dark values. */
export interface ColorTokenDef {
  /** CSS custom property name, e.g. "--background". */
  token: string;
  /** Short usage description. */
  description: string;
  /** CSS value for light mode (palette var or raw oklch). */
  lightValue: string;
  /** CSS value for dark mode (palette var or raw oklch). */
  darkValue: string;
  /** Display label for light value, e.g. "sand-50". */
  lightLabel: string;
  /** Display label for dark value, e.g. "stone-950". */
  darkLabel: string;
  /** Render as text color ("Aa") instead of filled swatch. */
  asForeground?: boolean;
}

/** Props for {@link ColorTokenTable}. */
export interface ColorTokenTableProps {
  /** Section heading displayed above the table. */
  title: string;
  /** Token definitions to render as rows. */
  tokens: ColorTokenDef[];
}

/** Single swatch + label for one theme column. */
function SwatchCell({
  value,
  label,
  asForeground,
  dark,
}: {
  value: string;
  label: string;
  asForeground?: boolean;
  dark: boolean;
}) {
  const contextBg = dark ? "var(--color-stone-950)" : "var(--color-white)";

  return (
    <div className="flex items-center gap-2">
      {asForeground ? (
        <div
          className="flex h-8 w-12 shrink-0 items-center justify-center rounded-sm border border-black/5"
          style={{ backgroundColor: contextBg }}
        >
          <span
            className="text-caption-bold leading-none"
            style={{ color: value }}
          >
            Aa
          </span>
        </div>
      ) : (
        <div
          className="h-8 w-12 shrink-0 rounded-sm border border-black/10"
          style={{ backgroundColor: value }}
        />
      )}
      <code className="whitespace-nowrap font-mono text-caption text-muted-foreground">
        {label}
      </code>
    </div>
  );
}

/**
 * Table showing semantic color tokens with side-by-side light/dark swatches.
 * Inspired by GitHub Primer's color primitives documentation.
 */
export function ColorTokenTable({ title, tokens }: ColorTokenTableProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-title-3 text-foreground">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-border">
              {["Token", "Description", "Light", "Dark"].map((h) => (
                <th
                  key={h}
                  className="pb-2 pr-6 text-left text-caption-bold text-muted-foreground last:pr-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tokens.map((t) => (
              <tr key={t.token} className="border-b border-border">
                <td className="py-3 pr-6">
                  <code className="font-mono text-caption text-foreground">
                    {t.token}
                  </code>
                </td>
                <td className="py-3 pr-6 text-caption text-muted-foreground">
                  {t.description}
                </td>
                <td className="py-3 pr-6">
                  <SwatchCell
                    value={t.lightValue}
                    label={t.lightLabel}
                    asForeground={t.asForeground}
                    dark={false}
                  />
                </td>
                <td className="py-3">
                  <SwatchCell
                    value={t.darkValue}
                    label={t.darkLabel}
                    asForeground={t.asForeground}
                    dark={true}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
