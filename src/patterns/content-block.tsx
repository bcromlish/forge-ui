import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/** Supported content block variants. */
export type ContentBlockVariant =
  | "hero"
  | "showcase"
  | "feature"
  | "page-header"
  | "section"
  | "intro"
  | "blurb"
  | "list-item"
  | "field"
  | "stat";

/** Internal config mapping for each variant. */
interface VariantConfig {
  blockClass: string;
  headingClass: string;
  subtextClass: string;
  headingAs: "h1" | "h2" | "h3" | "span";
}

/** Maps each variant to its CSS block class, type classes, and heading element. */
const VARIANT_CONFIG: Record<ContentBlockVariant, VariantConfig> = {
  hero: {
    blockClass: "block-hero",
    headingClass: "text-display-1",
    subtextClass: "text-subtitle-1 text-muted-foreground",
    headingAs: "h1",
  },
  showcase: {
    blockClass: "block-showcase",
    headingClass: "text-display-2",
    subtextClass: "text-subtitle-1 text-muted-foreground",
    headingAs: "h2",
  },
  feature: {
    blockClass: "block-feature",
    headingClass: "text-display-3",
    subtextClass: "text-body text-muted-foreground",
    headingAs: "h3",
  },
  "page-header": {
    blockClass: "block-page-header",
    headingClass: "text-title-1",
    subtextClass: "text-body text-muted-foreground",
    headingAs: "h1",
  },
  section: {
    blockClass: "block-section",
    headingClass: "text-title-2",
    subtextClass: "text-body text-muted-foreground",
    headingAs: "h2",
  },
  intro: {
    blockClass: "block-intro",
    headingClass: "text-title-2",
    subtextClass: "text-subtitle-2 text-muted-foreground",
    headingAs: "h2",
  },
  blurb: {
    blockClass: "block-blurb",
    headingClass: "text-title-3",
    subtextClass: "text-body text-muted-foreground",
    headingAs: "h3",
  },
  "list-item": {
    blockClass: "block-list-item",
    headingClass: "text-body-bold",
    subtextClass: "text-caption text-muted-foreground",
    headingAs: "span",
  },
  field: {
    blockClass: "block-field",
    headingClass: "text-caption-bold text-muted-foreground",
    subtextClass: "text-body",
    headingAs: "span",
  },
  stat: {
    blockClass: "block-stat",
    headingClass: "text-title-1",
    subtextClass: "text-caption text-muted-foreground",
    headingAs: "span",
  },
};

/** Props for {@link ContentBlock}. */
export interface ContentBlockProps {
  /** Which content block variant to render. */
  variant: ContentBlockVariant;
  /** Primary text content. */
  heading: ReactNode;
  /** Secondary text content displayed below the heading. */
  subtext?: ReactNode;
  /** Overline label above heading — only used with the "intro" variant. */
  overline?: string;
  /** Center-align the block content. */
  centered?: boolean;
  /** Additional CSS classes for the outer wrapper. */
  className?: string;
}

/**
 * Foundational text composition combining heading + subtext with
 * variant-appropriate type classes and spacing.
 *
 * Optional convenience — developers can always use CSS utilities directly:
 * `<div className="block-blurb"><h3 className="text-title-3">...</h3></div>`
 */
export function ContentBlock({
  variant,
  heading,
  subtext,
  overline,
  centered,
  className,
}: ContentBlockProps) {
  const config = VARIANT_CONFIG[variant];
  const HeadingTag = config.headingAs;

  /* Intro variant nests overline + heading in a sub-group for 4px gap */
  if (variant === "intro" && overline) {
    return (
      <div className={cn(config.blockClass, centered && "block-center", className)}>
        <div className="flex flex-col gap-1">
          <span className="text-signal-1">{overline}</span>
          <HeadingTag className={config.headingClass}>{heading}</HeadingTag>
        </div>
        {subtext && <p className={config.subtextClass}>{subtext}</p>}
      </div>
    );
  }

  return (
    <div className={cn(config.blockClass, centered && "block-center", className)}>
      <HeadingTag className={config.headingClass}>{heading}</HeadingTag>
      {subtext && <p className={config.subtextClass}>{subtext}</p>}
    </div>
  );
}
