/**
 * Shared constants and utilities for the MembersTable components.
 * Extracted to keep MembersTable under the 300-line limit.
 *
 * @see components/settings/MembersTable.tsx
 * @see components/settings/MembersTableSkeleton.tsx
 */
// TODO: Replace with prop-based API
// import type { MembershipRole, MembershipStatus } from "@/features/organizations/types/memberships";

/** Role badge color mapping -- distinct colors per role for visual scanning. */
export const ROLE_COLORS: Record<MembershipRole, string> = {
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  hiring_manager: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  interviewer: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  viewer: "bg-stone-100 text-stone-600 dark:bg-stone-800/30 dark:text-stone-400",
};

/** Status badge styling. */
export const STATUS_STYLES: Record<MembershipStatus, string> = {
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  pending_invite: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

/** Role key mapping for translation lookup. */
export type RoleKey = "admin" | "hiringManager" | "interviewer" | "viewer";
export const ROLE_KEYS: Record<MembershipRole, RoleKey> = {
  admin: "admin",
  hiring_manager: "hiringManager",
  interviewer: "interviewer",
  viewer: "viewer",
};

/** Status key mapping for translation lookup. */
export type StatusKey = "active" | "pending" | "suspended";
export const STATUS_KEYS: Record<MembershipStatus, StatusKey> = {
  active: "active",
  pending_invite: "pending",
  suspended: "suspended",
};

/** Get initials from a name for avatar fallback. */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Enriched member row returned from the listByOrganization query. */
export interface EnrichedMember {
  _id: string;
  userId: string;
  role: MembershipRole;
  status: MembershipStatus;
  joinedAt: number;
  userName: string;
  userEmail: string;
  userAvatarUrl?: string;
  isOwner?: boolean;
  workspaces?: string[];
}
