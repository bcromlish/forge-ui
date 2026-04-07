/**
 * Lucide icon name to component mapping for workspace navigation.
 * Resolves portable `iconName` strings from WorkspaceConfig to
 * actual Lucide React components at the UI layer.
 *
 * Includes icons for all 13 workspaces and their nav items.
 * Add entries here when new workspaces or nav items are added.
 *
 * @see lib/domain/workspaces.ts for WORKSPACES definitions
 * @see types/workspaces.ts for NavItem.iconName
 */
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Database,
  FileCheck,
  FileSignature,
  FileText,
  LayoutDashboard,
  LayoutPanelLeft,
  Mail,
  Megaphone,
  MessageSquare,
  PieChart,
  Settings,
  Shield,
  ShieldCheck,
  UserCog,
  Users,
  Workflow,
} from "lucide-react";

/** Maps iconName strings from workspace configs to Lucide components. */
export const WORKSPACE_ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Database,
  FileCheck,
  FileSignature,
  FileText,
  LayoutDashboard,
  LayoutPanelLeft,
  Mail,
  Megaphone,
  MessageSquare,
  PieChart,
  Settings,
  Shield,
  ShieldCheck,
  UserCog,
  Users,
  Workflow,
};
