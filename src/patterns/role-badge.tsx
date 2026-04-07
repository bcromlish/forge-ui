import { Badge } from "../primitives/badge";
import { cn } from "../lib/utils";

/** Semantic color roles from the design token system (color-roles.css). */
export type ColorRole =
  | "success"
  | "warning"
  | "destructive"
  | "ai"
  | "templates"
  | "automations"
  | "applicants"
  | "ratings"
  | "references"
  | "calendar"
  | "files"
  | "accent";

/**
 * Maps each color role to its token-based Tailwind classes.
 * Uses the `{role}-bg`, `{role}-fg`, `{role}-border` semantic tokens
 * defined in `app/styles/color-roles.css` — no raw palette classes.
 */
const ROLE_STYLES: Record<ColorRole, string> = {
  success: "bg-success-bg text-success-fg border-success-border",
  warning: "bg-warning-bg text-warning-fg border-warning-border",
  destructive: "bg-destructive-bg text-destructive-fg border-destructive-border",
  ai: "bg-ai-bg text-ai-fg border-ai-border",
  templates: "bg-templates-bg text-templates-fg border-templates-border",
  automations: "bg-automations-bg text-automations-fg border-automations-border",
  applicants: "bg-applicants-bg text-applicants-fg border-applicants-border",
  ratings: "bg-ratings-bg text-ratings-fg border-ratings-border",
  references: "bg-references-bg text-references-fg border-references-border",
  calendar: "bg-calendar-bg text-calendar-fg border-calendar-border",
  files: "bg-files-bg text-files-fg border-files-border",
  accent: "bg-accent-bg text-accent-fg border-accent-border",
};

/** Props for {@link RoleBadge}. */
export interface RoleBadgeProps {
  /** Semantic color role from the design token system. */
  role: ColorRole;
  /** Badge content (label text or element). */
  children: React.ReactNode;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * Badge styled via semantic color role tokens.
 * Use instead of inline Tailwind color maps to keep dark mode and theming
 * routed through the design system.
 *
 * @see StatusBadge for entity lifecycle statuses (draft, active, paused, etc.)
 */
export function RoleBadge({ role, children, className }: RoleBadgeProps) {
  return (
    <Badge variant="outline" className={cn(ROLE_STYLES[role], className)}>
      {children}
    </Badge>
  );
}
