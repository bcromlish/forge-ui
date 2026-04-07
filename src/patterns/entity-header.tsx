import type { ReactNode } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../primitives/avatar";
import { cn } from "../lib/utils";
import { getInitials } from "./format-utils";

/**
 * Props for {@link EntityHeader}.
 *
 * Exactly one of `icon` or `avatar` should be provided for the leading visual.
 * When both are supplied, `avatar` takes precedence.
 */
export interface EntityHeaderProps {
  /** Icon element rendered in a styled container when no avatar is provided. */
  icon?: ReactNode;
  /** Avatar config: renders an Avatar with image (if src given) and initials fallback. */
  avatar?: { name: string; src?: string };
  /** Primary heading text. */
  title: string;
  /** Secondary text displayed below the title, truncated to a single line. */
  description?: string;
  /** Badge or status indicator rendered inline after the title. */
  badge?: ReactNode;
  /** Additional CSS classes for the outer wrapper. */
  className?: string;
}

/**
 * Card header pattern combining avatar/icon + title + description + badge.
 * Used across entity card compositions (candidates, positions, offers, etc.)
 * to provide a consistent header layout.
 */
export function EntityHeader({
  icon,
  avatar,
  title,
  description,
  badge,
  className,
}: EntityHeaderProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <LeadingVisual icon={icon} avatar={avatar} />

      <div className="block-blurb min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-title-3 truncate">{title}</h3>
          {badge}
        </div>

        {description && (
          <p className="text-body text-muted-foreground truncate">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Renders the avatar or icon visual. Avatar takes precedence over icon.
 * Returns null when neither is provided (title-only mode).
 */
function LeadingVisual({
  icon,
  avatar,
}: Pick<EntityHeaderProps, "icon" | "avatar">) {
  if (avatar) {
    return (
      <Avatar size="sm" className="shrink-0">
        {avatar.src && <AvatarImage src={avatar.src} alt={avatar.name} />}
        <AvatarFallback name={avatar.name}>{getInitials(avatar.name)}</AvatarFallback>
      </Avatar>
    );
  }

  if (icon) {
    return (
      <div className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full [&_svg]:size-4">
        {icon}
      </div>
    );
  }

  return null;
}
