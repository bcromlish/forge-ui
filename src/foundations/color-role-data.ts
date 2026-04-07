/**
 * Color role token definitions for Storybook documentation.
 * 12 Primer-style roles × 6 primitives (fg, fg-muted, bg, bg-emphasis,
 * border, border-emphasis) = 72 tokens.
 *
 * @see app/styles/color-roles.css for the canonical token-to-palette mapping
 */
import type { ColorTokenDef } from "./color-token-table";

/** Role definition: name, palette, and description for generating token rows. */
interface RoleDef {
  role: string;
  palette: string;
  description: string;
}

const ROLES: RoleDef[] = [
  { role: "success", palette: "emerald", description: "Positive messaging, successful states" },
  { role: "warning", palette: "amber", description: "Warning states, caution" },
  { role: "destructive", palette: "red", description: "Danger, errors" },
  { role: "ai", palette: "violet", description: "AI functionality" },
  { role: "templates", palette: "purple", description: "Templates" },
  { role: "automations", palette: "pink", description: "Automations" },
  { role: "applicants", palette: "indigo", description: "Applicant-related UI" },
  { role: "ratings", palette: "yellow", description: "Ratings, scores" },
  { role: "references", palette: "blue", description: "Weights, references" },
  { role: "calendar", palette: "rose", description: "Calendar features" },
  { role: "files", palette: "stone", description: "Files, embeds" },
  { role: "accent", palette: "sky", description: "Links, interactive highlights" },
];

/** Primitive suffixes and their light/dark palette stops. */
const PRIMITIVES: {
  suffix: string;
  label: string;
  light: number;
  dark: number;
  asForeground?: boolean;
}[] = [
  { suffix: "fg", label: "Foreground", light: 700, dark: 300, asForeground: true },
  { suffix: "fg-muted", label: "Muted foreground", light: 500, dark: 400, asForeground: true },
  { suffix: "bg", label: "Background", light: 50, dark: 950 },
  { suffix: "bg-emphasis", label: "Emphasis background", light: 600, dark: 500 },
  { suffix: "border", label: "Border", light: 200, dark: 800 },
  { suffix: "border-emphasis", label: "Emphasis border", light: 500, dark: 400 },
];

/** Generate ColorTokenDef[] for a single role. */
function roleTokens(role: RoleDef): ColorTokenDef[] {
  return PRIMITIVES.map((p) => ({
    token: `--${role.role}-${p.suffix}`,
    description: p.label,
    lightValue: `var(--color-${role.palette}-${p.light})`,
    darkValue: `var(--color-${role.palette}-${p.dark})`,
    lightLabel: `${role.palette}-${p.light}`,
    darkLabel: `${role.palette}-${p.dark}`,
    asForeground: p.asForeground,
  }));
}

/** All 12 color roles with their generated token definitions. */
export const COLOR_ROLES: { title: string; description: string; tokens: ColorTokenDef[] }[] =
  ROLES.map((r) => ({
    title: r.role.charAt(0).toUpperCase() + r.role.slice(1),
    description: r.description,
    tokens: roleTokens(r),
  }));
