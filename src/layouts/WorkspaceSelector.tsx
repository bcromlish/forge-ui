/**
 * Workspace selector dropdown -- switches between workspace contexts.
 * Workspaces are displayed in 5 logical groups (Hiring, Intelligence,
 * Automation, People Operations, Administration) with section headers.
 *
 * Reads workspace access from membership (isOwner + workspaces array).
 * Account Owners see all 13 workspaces. Non-owners see their granted
 * workspaces in their saved order. Legacy memberships (no workspaces
 * field) fall back to showing all workspaces for backward compatibility.
 *
 * @see components/layouts/OrgSwitcher.tsx for the pattern this follows
 * @see lib/domain/workspaces.ts for getGroupedWorkspaces
 * @see types/workspaces.ts for WorkspaceId, WorkspaceConfig, WorkspaceGroupId
 */
"use client";

import { createElement, useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChevronsUpDown, Check, Briefcase, Settings2 } from "lucide-react";
// TODO: Replace with prop-based API
// import type { WorkspaceId, WorkspaceConfig } from "@/features/organizations/types/workspaces";
// TODO: Replace with prop-based API
// import { WORKSPACE_GROUPS } from "@/features/organizations/domain/workspaces";
import { WORKSPACE_ICON_MAP } from "./workspace-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../primitives/sidebar";

/** Props for {@link WorkspaceSelector}. */
export interface WorkspaceSelectorProps {
  /** Currently active workspace identifier. */
  activeWorkspaceId: WorkspaceId;
  /** Workspaces the user can access, pre-filtered by membership. */
  accessibleWorkspaces: WorkspaceConfig[];
  /** Fires when user selects a different workspace. */
  onWorkspaceChange: (workspaceId: WorkspaceId) => void;
}

/**
 * Renders a Lucide icon by name using createElement to avoid the
 * "Cannot create components during render" lint violation.
 * Falls back to Briefcase for unknown icon names.
 */
function renderIcon(iconName: string, className: string) {
  const icon = WORKSPACE_ICON_MAP[iconName] ?? Briefcase;
  return createElement(icon, { className });
}

/**
 * Workspace selector dropdown for the sidebar.
 * Single-workspace users see a static label (no dropdown).
 * Multi-workspace users see a grouped dropdown with section headers.
 */
export function WorkspaceSelector({
  activeWorkspaceId,
  accessibleWorkspaces,
  onWorkspaceChange,
}: WorkspaceSelectorProps) {
  const t = useTranslations("navigation.workspaces");
  const tGroups = useTranslations("navigation.workspaces.groups");
  const activeWorkspace = accessibleWorkspaces.find((ws) => ws.id === activeWorkspaceId);

  // Fallback: if activeWorkspaceId doesn't match any accessible workspace,
  // use the first accessible workspace
  const displayWorkspace = activeWorkspace ?? accessibleWorkspaces[0];

  // Group accessible workspaces by their group, preserving group display order
  const groupedWorkspaces = useMemo(() => {
    const groups: { groupId: string; label: string; workspaces: WorkspaceConfig[] }[] = [];
    for (const group of WORKSPACE_GROUPS) {
      const workspaces = accessibleWorkspaces.filter((ws) => ws.group === group.id);
      if (workspaces.length > 0) {
        groups.push({ groupId: group.id, label: group.label, workspaces });
      }
    }
    return groups;
  }, [accessibleWorkspaces]);

  // No accessible workspaces -- should not happen in practice
  if (!displayWorkspace) {
    return null;
  }

  // Single workspace -- static label, no dropdown
  if (accessibleWorkspaces.length <= 1) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
              {renderIcon(displayWorkspace.iconName, "size-4")}
            </div>
            {/* workspace.label is a translation key resolved at render */}
            <span className="font-semibold truncate">
              {t(displayWorkspace.label as Parameters<typeof t>[0])}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Multiple workspaces -- grouped dropdown with section headers
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                {renderIcon(displayWorkspace.iconName, "size-4")}
              </div>
              <span className="font-semibold truncate flex-1">
                {t(displayWorkspace.label as Parameters<typeof t>[0])}
              </span>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[--radix-dropdown-menu-trigger-width] max-h-96 overflow-y-auto"
          >
            {groupedWorkspaces.map((group, groupIndex) => (
              <DropdownMenuGroup key={group.groupId}>
                {groupIndex > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel className="text-caption text-muted-foreground uppercase tracking-wider">
                  {tGroups(group.label as Parameters<typeof tGroups>[0])}
                </DropdownMenuLabel>
                {group.workspaces.map((ws) => (
                  <DropdownMenuItem
                    key={ws.id}
                    onClick={() => onWorkspaceChange(ws.id)}
                  >
                    {renderIcon(ws.iconName, "size-4")}
                    <span className="flex-1 truncate">
                      {t(ws.label as Parameters<typeof t>[0])}
                    </span>
                    {ws.id === activeWorkspaceId && (
                      <Check className="ml-auto size-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/workspaces">
                <Settings2 className="size-4" />
                <span>{t("manage" as Parameters<typeof t>[0])}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
