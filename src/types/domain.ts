/**
 * Generic domain types for forge-ui compositions.
 * These replace VidCruiter-specific types with portable interfaces.
 */

/** Generic user type for team member filters and lists. */
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

/** Authentication method for the auth settings panel. */
export interface AuthMethod {
  id: string;
  type: "email" | "oauth";
  providerName: string;
  identifier: string;
  verified: boolean;
}

/** Membership role union. */
export type MembershipRole = "admin" | "hiring_manager" | "interviewer" | "viewer";

/** Custom field entity type. */
export type CustomFieldEntityType = string;

/** Field type for custom field definitions. */
export type FieldType =
  | "text"
  | "number"
  | "boolean"
  | "select"
  | "multiSelect"
  | "date"
  | "url"
  | "email";

/** A custom field definition. */
export interface FieldDefinition {
  fieldName: string;
  fieldType: FieldType;
  isRequired: boolean;
  description?: string;
  options?: string[];
}

/** Position status for pipeline showcase. */
export type PositionStatus = string;

/** Workspace configuration. */
export interface WorkspaceConfig {
  id: string;
  label: string;
  iconName: string;
  group: string;
  navItems: WorkspaceNavItem[];
}

/** Navigation item within a workspace. */
export interface WorkspaceNavItem {
  label: string;
  href: string;
  iconName: string;
}

/** Workspace group for the workspace selector dropdown. */
export interface WorkspaceGroup {
  id: string;
  label: string;
}
