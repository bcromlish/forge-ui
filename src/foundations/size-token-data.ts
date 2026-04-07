/**
 * Size token definitions for Storybook documentation.
 * Consolidates dimension, shape, and breakpoint tokens plus
 * placeholder sections for planned stack/control/overlay tokens.
 *
 * @see app/styles/dimension.css for dimension token definitions
 * @see app/styles/shape.css for radius and border-width definitions
 * @see app/styles/breakpoint.css for breakpoint definitions
 */
import type { SizeTokenDef } from "./size-token-table";

/* -------------------------------------------------------------------------- */
/*  Dimensions (dim-0 through dim-16)                                          */
/* -------------------------------------------------------------------------- */

/** 17 dimension scale tokens from 0px to 384px. */
export const DIMENSION_TOKENS: SizeTokenDef[] = [
  { token: "--dim-0", value: "0px", tailwind: "0", description: "None", sample: { type: "bar", width: "0px" } },
  { token: "--dim-1", value: "1px", tailwind: "px", description: "Hairline borders", sample: { type: "bar", width: "1px" } },
  { token: "--dim-2", value: "2px", tailwind: "0.5", description: "Micro adjustments", sample: { type: "bar", width: "2px" } },
  { token: "--dim-3", value: "4px", tailwind: "1", description: "Tight: icon-label gaps", sample: { type: "bar", width: "4px" } },
  { token: "--dim-4", value: "6px", tailwind: "1.5", description: "Snug: compact controls", sample: { type: "bar", width: "6px" } },
  { token: "--dim-5", value: "8px", tailwind: "2", description: "Compact: input padding", sample: { type: "bar", width: "8px" } },
  { token: "--dim-6", value: "12px", tailwind: "3", description: "Standard: card padding", sample: { type: "bar", width: "12px" } },
  { token: "--dim-7", value: "16px", tailwind: "4", description: "Base: section padding", sample: { type: "bar", width: "16px" } },
  { token: "--dim-8", value: "24px", tailwind: "6", description: "Comfortable: section gaps", sample: { type: "bar", width: "24px" } },
  { token: "--dim-9", value: "32px", tailwind: "8", description: "Spacious: page-level", sample: { type: "bar", width: "32px" } },
  { token: "--dim-10", value: "48px", tailwind: "12", description: "Roomy: row heights", sample: { type: "bar", width: "48px" } },
  { token: "--dim-11", value: "64px", tailwind: "16", description: "Wide: max spacing", sample: { type: "bar", width: "64px" } },
  { token: "--dim-12", value: "96px", tailwind: "24", description: "Panel: skeleton rows", sample: { type: "bar", width: "96px" } },
  { token: "--dim-13", value: "128px", tailwind: "32", description: "Container: fixed rows", sample: { type: "bar", width: "128px" } },
  { token: "--dim-14", value: "192px", tailwind: "48", description: "Column: panel widths", sample: { type: "bar", width: "192px" } },
  { token: "--dim-15", value: "256px", tailwind: "64", description: "Sidebar: panel widths", sample: { type: "bar", width: "256px" } },
  { token: "--dim-16", value: "384px", tailwind: "96", description: "Canvas: full layout", sample: { type: "bar", width: "384px" } },
];

/* -------------------------------------------------------------------------- */
/*  Border Radius — Primitives                                                 */
/* -------------------------------------------------------------------------- */

/** 7 allowed Tailwind radius utilities from rounded-none to rounded-full. */
export const RADIUS_TOKENS: SizeTokenDef[] = [
  { token: "rounded-none", value: "0px", tailwind: "rounded-none", description: "No rounding", sample: { type: "radius", radius: "0px" } },
  { token: "--radius-sm", value: "4px", tailwind: "rounded-sm", description: "Subtle rounding", sample: { type: "radius", radius: "4px" } },
  { token: "--radius-md", value: "8px", tailwind: "rounded-md", description: "Default rounding", sample: { type: "radius", radius: "8px" } },
  { token: "--radius-lg", value: "12px", tailwind: "rounded-lg", description: "Medium rounding", sample: { type: "radius", radius: "12px" } },
  { token: "--radius-xl", value: "16px", tailwind: "rounded-xl", description: "Large rounding", sample: { type: "radius", radius: "16px" } },
  { token: "--radius-2xl", value: "24px", tailwind: "rounded-2xl", description: "Extra large rounding", sample: { type: "radius", radius: "24px" } },
  { token: "9999px", value: "9999px", tailwind: "rounded-full", description: "Fully circular", sample: { type: "radius", radius: "9999px" } },
];

/* -------------------------------------------------------------------------- */
/*  Border Radius — Semantic Aliases                                           */
/* -------------------------------------------------------------------------- */

/** Semantic shape aliases map purpose to radius values. */
export const SEMANTIC_RADIUS_TOKENS: SizeTokenDef[] = [
  { token: "--shape-form-input", value: "8px", tailwind: "rounded-md", description: "Inputs, selects, textareas", sample: { type: "radius", radius: "8px" } },
  { token: "--shape-card", value: "12px", tailwind: "rounded-lg", description: "Cards, sheets, toasts", sample: { type: "radius", radius: "12px" } },
  { token: "--shape-popover", value: "12px", tailwind: "rounded-lg", description: "Dialogs, modals, popovers", sample: { type: "radius", radius: "12px" } },
  { token: "--shape-photo-sm", value: "8px", tailwind: "rounded-md", description: "Thumbnails, small images", sample: { type: "radius", radius: "8px" } },
  { token: "--shape-photo-lg", value: "16px", tailwind: "rounded-xl", description: "Hero images, large photos", sample: { type: "radius", radius: "16px" } },
  { token: "--shape-pill", value: "9999px", tailwind: "rounded-full", description: "Badges, avatars, tags", sample: { type: "radius", radius: "9999px" } },
];

/* -------------------------------------------------------------------------- */
/*  Border Width                                                               */
/* -------------------------------------------------------------------------- */

/** 3 allowed border thickness tokens. */
export const BORDER_WIDTH_TOKENS: SizeTokenDef[] = [
  { token: "--border-thin", value: "0.5px", tailwind: "(custom)", description: "Hairline separators (HiDPI only)", sample: { type: "line", thickness: "0.5px" } },
  { token: "--border-medium", value: "1px", tailwind: "border", description: "All structural borders", sample: { type: "line", thickness: "1px" } },
  { token: "--border-thick", value: "2px", tailwind: "border-2", description: "Active indicators, emphasis", sample: { type: "line", thickness: "2px" } },
];

/* -------------------------------------------------------------------------- */
/*  Breakpoints                                                                */
/* -------------------------------------------------------------------------- */

/** Maximum breakpoint value (4xl) used as 100% reference for proportional bars. */
const MAX_BP = 1920;
const MAX_BAR_PX = 480;

/** Compute a proportional bar width capped to a max display width. */
function bpBar(px: number): string {
  return `${Math.round((px / MAX_BP) * MAX_BAR_PX)}px`;
}

/** 8 responsive breakpoint tokens. */
export const BREAKPOINT_TOKENS: SizeTokenDef[] = [
  { token: "--breakpoint-xs", value: "320px", tailwind: "xs:", description: "Small phones (iPhone SE)", sample: { type: "bar", width: bpBar(320) } },
  { token: "--breakpoint-sm", value: "512px", tailwind: "sm:", description: "Large phones / small tablets", sample: { type: "bar", width: bpBar(512) } },
  { token: "--breakpoint-md", value: "768px", tailwind: "md:", description: "Tablets (iPad Mini portrait)", sample: { type: "bar", width: bpBar(768) } },
  { token: "--breakpoint-lg", value: "1024px", tailwind: "lg:", description: "Small laptops / tablets landscape", sample: { type: "bar", width: bpBar(1024) } },
  { token: "--breakpoint-xl", value: "1280px", tailwind: "xl:", description: "Standard laptops", sample: { type: "bar", width: bpBar(1280) } },
  { token: "--breakpoint-2xl", value: "1440px", tailwind: "2xl:", description: "Large laptops / small desktops", sample: { type: "bar", width: bpBar(1440) } },
  { token: "--breakpoint-3xl", value: "1680px", tailwind: "3xl:", description: "Desktop monitors", sample: { type: "bar", width: bpBar(1680) } },
  { token: "--breakpoint-4xl", value: "1920px", tailwind: "4xl:", description: "Large / ultra-wide displays", sample: { type: "bar", width: bpBar(1920) } },
];

/* -------------------------------------------------------------------------- */
/*  Layout Zones (reused from Breakpoints story)                               */
/* -------------------------------------------------------------------------- */

/** Layout zone definition for the guidance story. */
export interface LayoutZone {
  name: string;
  range: string;
  breakpoints: string;
  description: string;
  examples: string[];
}

/** Layout zones mapping breakpoint ranges to recommended layout patterns. */
export const LAYOUT_ZONES: LayoutZone[] = [
  {
    name: "Mobile",
    range: "xs - sm",
    breakpoints: "320px - 512px",
    description: "Single-column, stacked layouts, hamburger nav",
    examples: [
      "Full-width cards stacked vertically",
      "Collapsed navigation (hamburger menu)",
      "Single-column forms",
      "Bottom sheet overlays instead of modals",
    ],
  },
  {
    name: "Tablet",
    range: "md - lg",
    breakpoints: "768px - 1024px",
    description: "Two-column layouts, sidebar appears, expanded nav",
    examples: [
      "Sidebar navigation visible",
      "Two-column candidate list + detail",
      "Side-by-side form sections",
      "Expanded table columns",
    ],
  },
  {
    name: "Desktop",
    range: "xl - 2xl",
    breakpoints: "1280px - 1440px",
    description: "Full three-column layouts, data-dense tables",
    examples: [
      "Three-column pipeline board",
      "Full data tables with all columns",
      "Candidate profile with sidebar + timeline",
      "Dashboard with multiple widget columns",
    ],
  },
  {
    name: "Ultra-wide",
    range: "3xl - 4xl",
    breakpoints: "1680px - 1920px",
    description: "Ultra-wide optimizations, max-width containers",
    examples: [
      "Max-width content containers with side margins",
      "Extra-wide data tables with additional columns",
      "Multi-panel layouts (list + detail + activity)",
      "Side-by-side comparison views",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Placeholder sections — tokens not yet defined in CSS                       */
/* -------------------------------------------------------------------------- */

/**
 * Stack tokens: semantic gap/padding presets.
 * Placeholder — would require new CSS custom properties:
 *   --stack-condensed, --stack-normal, --stack-spacious, etc.
 */
export const STACK_TOKENS: SizeTokenDef[] = [
  { token: "--stack-condensed", value: "4px", tailwind: "1", description: "Tight stacking for dense lists", sample: { type: "none" } },
  { token: "--stack-compact", value: "8px", tailwind: "2", description: "Compact stacking for form fields", sample: { type: "none" } },
  { token: "--stack-normal", value: "16px", tailwind: "4", description: "Default stacking for sections", sample: { type: "none" } },
  { token: "--stack-relaxed", value: "24px", tailwind: "6", description: "Relaxed stacking for content blocks", sample: { type: "none" } },
  { token: "--stack-spacious", value: "32px", tailwind: "8", description: "Spacious stacking for page sections", sample: { type: "none" } },
  { token: "--stack-generous", value: "48px", tailwind: "12", description: "Generous stacking for hero areas", sample: { type: "none" } },
];

/**
 * Control size tokens: standardized heights and padding per control size.
 * Placeholder — would require new CSS custom properties:
 *   --control-small-height, --control-medium-height, --control-large-height
 */
export const CONTROL_SIZE_TOKENS: SizeTokenDef[] = [
  { token: "--control-small", value: "28px", tailwind: "7", description: "Small controls: compact buttons, badges", sample: { type: "none" } },
  { token: "--control-medium", value: "36px", tailwind: "9", description: "Default controls: buttons, inputs, selects", sample: { type: "none" } },
  { token: "--control-large", value: "44px", tailwind: "11", description: "Large controls: prominent CTAs, touch targets", sample: { type: "none" } },
];

/**
 * Overlay size tokens: standardized width presets for modals and popovers.
 * Placeholder — would require new CSS custom properties:
 *   --overlay-xsmall through --overlay-xlarge
 */
export const OVERLAY_SIZE_TOKENS: SizeTokenDef[] = [
  { token: "--overlay-xsmall", value: "256px", description: "Tooltips, mini popovers", sample: { type: "none" } },
  { token: "--overlay-small", value: "320px", description: "Confirmation dialogs, dropdowns", sample: { type: "none" } },
  { token: "--overlay-medium", value: "480px", description: "Standard modals, form dialogs", sample: { type: "none" } },
  { token: "--overlay-large", value: "640px", description: "Wide modals, detail panels", sample: { type: "none" } },
  { token: "--overlay-xlarge", value: "960px", description: "Full-feature panels, comparison views", sample: { type: "none" } },
];
