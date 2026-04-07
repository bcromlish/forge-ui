/**
 * Display components for the Palette Storybook stories.
 * Tailwind-docs-inspired grid layout with click-to-copy swatches.
 * Storybook-only helpers -- not used in application UI.
 *
 * @see components/foundations/Palette.stories.tsx for story definitions
 * @see components/foundations/palette-data.ts for palette data
 */
import { useState, useCallback } from "react";
import type { PaletteShade, PaletteDefinition } from "./palette-data";
import { SHADE_STEPS } from "./palette-data";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Determines whether swatch label text should be light or dark for readability. */
function contrastColor(oklchValue: string): string {
  const match = oklchValue.match(/oklch\(([0-9.]+)/);
  if (!match?.[1]) return "#000";
  return parseFloat(match[1]) > 0.6 ? "#000" : "#fff";
}

/** Copies text to clipboard. Returns true on success. */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*  CopiedToast                                                                */
/* -------------------------------------------------------------------------- */

/** Floating toast shown after a successful copy action. */
function CopiedToast({ value }: { value: string }) {
  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2
        animate-in fade-in slide-in-from-bottom-2 rounded-lg border border-border
        bg-popover px-4 py-2 shadow-lg"
    >
      <p className="text-body font-medium text-popover-foreground">
        Copied{" "}
        <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-caption">
          {value}
        </code>
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  PaletteSwatch                                                              */
/* -------------------------------------------------------------------------- */

/** Props for {@link PaletteSwatch}. */
interface PaletteSwatchProps {
  shade: PaletteShade;
  isFirst: boolean;
  isLast: boolean;
  onCopy: (value: string) => void;
}

/**
 * Individual color swatch cell in the palette grid.
 * Click copies oklch value; shift+click copies hex.
 */
function PaletteSwatch({ shade, isFirst, isLast, onCopy }: PaletteSwatchProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const value = e.shiftKey ? shade.hex : shade.value;
      void copyToClipboard(value).then((ok) => {
        if (ok) onCopy(value);
      });
    },
    [shade.hex, shade.value, onCopy],
  );

  const fg = contrastColor(shade.value);

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Click: copy oklch | Shift+click: copy hex\n${shade.value}`}
      className="group relative flex min-w-0 flex-1 cursor-pointer flex-col items-center
        justify-end border-0 pb-2 pt-8 transition-transform hover:scale-105
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      style={{
        backgroundColor: shade.value,
        borderRadius: isFirst
          ? "8px 0 0 8px"
          : isLast
            ? "0 8px 8px 0"
            : undefined,
      }}
    >
      <span
        className="text-caption font-semibold leading-none"
        style={{ color: fg }}
      >
        {shade.step}
      </span>
      <span
        className="mt-0.5 hidden text-caption font-mono leading-none opacity-70
          group-hover:block"
        style={{ color: fg }}
      >
        {shade.value
          .replace("oklch(", "")
          .replace(")", "")
          .split(" ")
          .slice(0, 2)
          .join(" ")}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  PaletteRow                                                                 */
/* -------------------------------------------------------------------------- */

/** Renders a single palette as a labeled row of shade swatches. */
export function PaletteRow({
  palette,
  label,
  onCopy,
}: {
  palette: PaletteDefinition;
  label?: string;
  onCopy: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-24 shrink-0 text-right text-body font-semibold text-foreground">
        {palette.name}
        {label && (
          <span className="block text-caption font-normal text-muted-foreground">{label}</span>
        )}
      </span>
      <div className="flex min-w-0 flex-1">
        {palette.shades.map((shade, i) => (
          <PaletteSwatch
            key={shade.step}
            shade={shade}
            isFirst={i === 0}
            isLast={i === palette.shades.length - 1}
            onCopy={onCopy}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  VariantComparisonRow                                                       */
/* -------------------------------------------------------------------------- */

/** Shows faded -> washed -> base rows for one palette to compare chroma variants. */
export function VariantComparisonRow({
  base,
  washed,
  faded,
  onCopy,
}: {
  base: PaletteDefinition;
  washed: PaletteDefinition;
  faded: PaletteDefinition;
  onCopy: (value: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <PaletteRow palette={faded} label="faded" onCopy={onCopy} />
      <PaletteRow palette={washed} label="washed" onCopy={onCopy} />
      <PaletteRow palette={base} onCopy={onCopy} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  StepHeaders                                                                */
/* -------------------------------------------------------------------------- */

/** Column header row showing shade step numbers (50, 100, 200, ..., 950). */
export function StepHeaders() {
  return (
    <div className="flex items-center gap-4">
      <span className="w-24 shrink-0" />
      <div className="flex min-w-0 flex-1">
        {SHADE_STEPS.map((step) => (
          <span
            key={step}
            className="min-w-0 flex-1 text-center text-caption font-medium text-muted-foreground"
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  useCopyToast                                                               */
/* -------------------------------------------------------------------------- */

/** Hook managing copy-toast state with auto-dismiss. */
export function useCopyToast() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleCopy = useCallback((value: string) => {
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 1500);
  }, []);

  return { copiedValue, handleCopy } as const;
}

/* -------------------------------------------------------------------------- */
/*  CopyHint + Toast re-export                                                 */
/* -------------------------------------------------------------------------- */

/** Hint text explaining click-to-copy interaction. */
export function CopyHint() {
  return (
    <p className="mt-4 text-center text-caption text-muted-foreground">
      Click to copy oklch value. Shift+click to copy hex.
    </p>
  );
}

/** Re-export toast for use in stories. */
export { CopiedToast };
