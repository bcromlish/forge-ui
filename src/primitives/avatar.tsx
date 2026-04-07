"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"

import { cn } from "../lib/utils"

/** Avatar size tokens: xs=24, sm=32, md=40 (default), lg=48, xl=64. */
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "default"

/** Avatar shape: circle (default) or square (rounded-lg). */
type AvatarShape = "circle" | "square"

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-16",
  default: "size-8",
}

/** Resolve "default" alias to "sm" for data-attribute consistency. */
function resolveSize(size: AvatarSize): Exclude<AvatarSize, "default"> {
  return size === "default" ? "sm" : size
}

/**
 * Root avatar container with 5-size scale and circle/square shape.
 * `"default"` size alias resolves to `"sm"` (32px) for backward compat.
 */
function Avatar({
  className,
  size = "md",
  shape = "circle",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  /** Size token. `"default"` accepted as backward-compat alias for `"sm"`. */
  size?: AvatarSize
  /** Shape variant. Square uses `rounded-lg` corners. */
  shape?: AvatarShape
}) {
  const resolved = resolveSize(size)
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={resolved}
      data-shape={shape}
      className={cn(
        "group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none",
        "data-[shape=square]:rounded-lg",
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    />
  )
}

/** Avatar image -- fills the root container. */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

/**
 * 8-color palette for deterministic avatar backgrounds.
 * Each entry: [lightBg, lightText, darkBg, darkText]. All WCAG AA 7:1+.
 */
const AVATAR_COLORS = [
  { light: "bg-sky-100 text-sky-800", dark: "dark:bg-sky-900 dark:text-sky-200" },
  { light: "bg-emerald-100 text-emerald-800", dark: "dark:bg-emerald-900 dark:text-emerald-200" },
  { light: "bg-violet-100 text-violet-800", dark: "dark:bg-violet-900 dark:text-violet-200" },
  { light: "bg-rose-100 text-rose-800", dark: "dark:bg-rose-900 dark:text-rose-200" },
  { light: "bg-amber-100 text-amber-800", dark: "dark:bg-amber-900 dark:text-amber-200" },
  { light: "bg-teal-100 text-teal-800", dark: "dark:bg-teal-900 dark:text-teal-200" },
  { light: "bg-indigo-100 text-indigo-800", dark: "dark:bg-indigo-900 dark:text-indigo-200" },
  { light: "bg-pink-100 text-pink-800", dark: "dark:bg-pink-900 dark:text-pink-200" },
] as const

/** djb2-style hash of a string, returns index into AVATAR_COLORS. */
function hashName(name: string): number {
  let hash = 5381
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 33) ^ name.charCodeAt(i)
  }
  return Math.abs(hash) % AVATAR_COLORS.length
}

/** Returns deterministic Tailwind color classes for a name string. */
function getAvatarColor(name: string): string {
  const idx = hashName(name)
  const entry = AVATAR_COLORS[idx] ?? AVATAR_COLORS[0]
  return `${entry.light} ${entry.dark}`
}

const FALLBACK_TEXT_SIZE: Record<Exclude<AvatarSize, "default">, string> = {
  xs: "text-xs",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
}

/**
 * Initials fallback with optional deterministic color rotation.
 * Pass `name` for a colored background; omit for default gray.
 */
function AvatarFallback({
  className,
  name,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  /** User name for deterministic color selection. Omit for default gray. */
  name?: string
}) {
  const colorClasses = name
    ? getAvatarColor(name)
    : "bg-muted text-muted-foreground"

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full",
        "group-data-[shape=square]/avatar:rounded-lg",
        colorClasses,
        /* Text scaling per parent avatar size */
        FALLBACK_TEXT_SIZE.md,
        "group-data-[size=xs]/avatar:text-xs",
        "group-data-[size=sm]/avatar:text-xs",
        "group-data-[size=lg]/avatar:text-base",
        "group-data-[size=xl]/avatar:text-lg",
        className
      )}
      {...props}
    />
  )
}

const STATUS_COLOR: Record<string, string> = {
  online: "bg-success-bg-emphasis",
  away: "bg-warning-bg-emphasis",
  offline: "bg-muted-foreground/50",
}

/**
 * Presence status dot overlaid on an Avatar.
 * Scales automatically via parent `data-size` attribute.
 */
function AvatarStatus({
  status,
  className,
  ...props
}: { status: "online" | "away" | "offline" } & React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-status"
      className={cn(
        "ring-background absolute right-0 bottom-0 z-10 rounded-full",
        STATUS_COLOR[status],
        /* Default (md) */
        "size-2.5 ring-2",
        /* Size scaling */
        "group-data-[size=xs]/avatar:size-1.5 group-data-[size=xs]/avatar:ring-1",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:ring-[1.5px]",
        "group-data-[size=lg]/avatar:size-3",
        "group-data-[size=xl]/avatar:size-3.5",
        className
      )}
      {...props}
    />
  )
}

const GROUP_SPACING: Record<Exclude<AvatarSize, "default">, string> = {
  xs: "-space-x-1",
  sm: "-space-x-1.5",
  md: "-space-x-2",
  lg: "-space-x-3",
  xl: "-space-x-3",
}

/**
 * Stacked avatar group with optional `max` overflow.
 * When `max` is set, excess children are replaced by an AvatarGroupCount.
 */
function AvatarGroup({
  className,
  children,
  max,
  size = "md",
  ...props
}: React.ComponentProps<"div"> & {
  /** Maximum visible avatars before showing overflow count. */
  max?: number
  /** Size token for spacing calculation. */
  size?: AvatarSize
}) {
  const resolved = resolveSize(size)
  const allChildren = React.Children.toArray(children)
  const shouldTruncate = max != null && allChildren.length > max
  const visible = shouldTruncate ? allChildren.slice(0, max) : allChildren
  const overflowCount = shouldTruncate
    ? allChildren.length - max
    : 0

  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:ring-2",
        GROUP_SPACING[resolved],
        className
      )}
      {...props}
    >
      {visible}
      {shouldTruncate && (
        <AvatarGroupCount>+{overflowCount}</AvatarGroupCount>
      )}
    </div>
  )
}

/**
 * Overflow count indicator for AvatarGroup.
 * Inherits size from parent group via `group-has-data` selectors.
 */
function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "bg-muted text-muted-foreground ring-background relative flex shrink-0 items-center justify-center rounded-full text-sm ring-2",
        /* Default: md (40px) */
        "size-10",
        "group-has-data-[size=xs]/avatar-group:size-6 group-has-data-[size=xs]/avatar-group:text-xs",
        "group-has-data-[size=sm]/avatar-group:size-8 group-has-data-[size=sm]/avatar-group:text-xs",
        "group-has-data-[size=lg]/avatar-group:size-12",
        "group-has-data-[size=xl]/avatar-group:size-16 group-has-data-[size=xl]/avatar-group:text-lg",
        /* Shape: square inherits from avatar children */
        "group-has-data-[shape=square]/avatar-group:rounded-lg",
        /* Icon sizing */
        "[&>svg]:size-4",
        "group-has-data-[size=xs]/avatar-group:[&>svg]:size-3",
        "group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        "group-has-data-[size=lg]/avatar-group:[&>svg]:size-5",
        "group-has-data-[size=xl]/avatar-group:[&>svg]:size-6",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarStatus,
  AvatarGroup,
  AvatarGroupCount,
  getAvatarColor,
  AVATAR_COLORS,
}

export type { AvatarSize, AvatarShape }
