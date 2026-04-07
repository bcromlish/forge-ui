/**
 * Semantic color token definitions for Storybook documentation.
 * Values sourced from globals.css (:root + .dark), using raw palette
 * CSS variables so swatches render independently of the active theme.
 *
 * @see app/globals.css for the canonical token-to-palette mapping
 */
import type { ColorTokenDef } from "./color-token-table";

/** Shorthand builder: converts palette refs to CSS var() values. */
function def(
  token: string,
  description: string,
  light: string,
  dark: string,
  asForeground?: boolean,
): ColorTokenDef {
  const val = (ref: string) =>
    ref.startsWith("oklch(") ? ref : `var(--color-${ref})`;
  const lbl = (ref: string) => {
    if (ref === "oklch(1 0 0 / 10%)") return "white / 10%";
    if (ref === "oklch(1 0 0 / 15%)") return "white / 15%";
    return ref;
  };
  return {
    token: `--${token}`,
    description,
    lightValue: val(light),
    darkValue: val(dark),
    lightLabel: lbl(light),
    darkLabel: lbl(dark),
    asForeground,
  };
}

/** Surface color tokens. */
export const SURFACE_TOKENS: ColorTokenDef[] = [
  def("background", "Page background", "sand-50", "zinc-950"),
  def("card", "Card surface", "white", "zinc-900"),
  def("popover", "Popover surface", "white", "zinc-900"),
  def("muted", "Muted background", "sand-100", "sand-800"),
  def("accent", "Accent background", "sand-100", "sand-800"),
  def("secondary", "Secondary background", "sand-100", "sand-800"),
];

/** Text color tokens. */
export const TEXT_TOKENS: ColorTokenDef[] = [
  def("foreground", "Primary text", "stone-950", "zinc-50", true),
  def("card-foreground", "Card text", "stone-950", "zinc-50", true),
  def("popover-foreground", "Popover text", "stone-950", "zinc-50", true),
  def("muted-foreground", "Muted text", "stone-600", "stone-300", true),
  def("accent-foreground", "Accent text", "sand-900", "sand-50", true),
  def("secondary-foreground", "Secondary text", "sand-900", "sand-50", true),
];

/** Action-related tokens (primary, destructive). */
export const ACTION_TOKENS: ColorTokenDef[] = [
  def("primary", "Primary actions", "stone-900", "zinc-200"),
  def("primary-foreground", "Primary action text", "stone-50", "zinc-900", true),
  def("destructive", "Destructive actions", "red-600", "red-400"),
  def("destructive-foreground", "Destructive text", "stone-50", "zinc-50", true),
];

/** Border and form input tokens. */
export const BORDER_TOKENS: ColorTokenDef[] = [
  def("border", "Default border", "stone-200", "oklch(1 0 0 / 10%)"),
  def("input", "Input border", "stone-200", "oklch(1 0 0 / 15%)"),
  def("ring", "Focus ring", "sky-700", "sky-400"),
];

/** Pipeline status indicator tokens. */
export const STATUS_TOKENS: ColorTokenDef[] = [
  def("status-draft", "Draft state", "stone-500", "zinc-400"),
  def("status-active", "Active state", "green-600-washed", "green-600-washed"),
  def("status-paused", "Paused state", "yellow-500-washed", "yellow-500-washed"),
  def("status-closed", "Closed state", "red-600-washed", "red-600-washed"),
  def("status-archived", "Archived state", "stone-400", "zinc-500"),
];

/** Chart series color tokens for Recharts visualizations. */
export const CHART_TOKENS: ColorTokenDef[] = [
  def("chart-1", "Series 1", "orange-600", "blue-700"),
  def("chart-2", "Series 2", "teal-600", "emerald-500"),
  def("chart-3", "Series 3", "cyan-900", "amber-500"),
  def("chart-4", "Series 4", "amber-400", "purple-500"),
  def("chart-5", "Series 5", "amber-500", "rose-500"),
];

/** Sidebar-specific tokens. */
export const SIDEBAR_TOKENS: ColorTokenDef[] = [
  def("sidebar", "Sidebar background", "sand-50", "zinc-900"),
  def("sidebar-foreground", "Sidebar text", "sand-950", "zinc-50", true),
  def("sidebar-primary", "Sidebar primary", "sand-900", "zinc-200"),
  def("sidebar-primary-foreground", "Sidebar primary text", "sand-50", "zinc-900", true),
  def("sidebar-accent", "Sidebar accent", "sand-200", "zinc-800"),
  def("sidebar-accent-foreground", "Sidebar accent text", "sand-900", "zinc-50", true),
  def("sidebar-border", "Sidebar border", "sand-300", "oklch(1 0 0 / 10%)"),
  def("sidebar-ring", "Sidebar focus ring", "sand-400", "zinc-500"),
];
