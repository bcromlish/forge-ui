/**
 * Workspace selector dropdown -- switches between workspace contexts.
 * All data provided via props -- no internal data fetching.
 */
"use client";

import { createElement, useMemo } from "react";
import Link from "next/link";
import { ChevronsUpDown, Check, Briefcase, Settings2 } from "lucide-react";
import type { WorkspaceConfig, WorkspaceGroup } from "../types/domain";
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
  activeWorkspaceId: string;
  /** Workspaces the user can access, pre-filtered by membership. */
  accessibleWorkspaces: WorkspaceConfig[];
  /** Workspace groups for the dropdown sections. */
  workspaceGroups?: WorkspaceGroup[];
  /** Fires when user selects a different workspace. */
  onWorkspaceChange: (workspaceId: string) => void;
  /** Optional label resolver for workspace labels. */
  resolveLabel?: (key: string) => string;
  /** Optional label resolver for group labels. */
  resolveGroupLabel?: (key: string) => string;
  /** Label for the "Manage Workspaces" link. */
  manageLabel?: string;
}

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
  workspaceGroups = [],
  onWorkspaceChange,
  resolveLabel = (k) => k,
  resolveGroupLabel = (k) => k,
  manageLabel = "Manage Workspaces",
}: WorkspaceSelectorProps) {
  const activeWorkspace = accessibleWorkspaces.find((ws) => ws.id === activeWorkspaceId);
  const displayWorkspace = activeWorkspace ?? accessibleWorkspaces[0];

  // Group accessible workspaces by their group
  const groupedWorkspaces = useMemo(() => {
    if (workspaceGroups.length === 0) return [];
    const groups: { groupId: string; label: string; workspaces: WorkspaceConfig[] }[] = [];
    for (const group of workspaceGroups) {
      const workspaces = accessibleWorkspaces.filter((ws) => ws.group === group.id);
      if (workspaces.length > 0) {
        groups.push({ groupId: group.id, label: group.label, workspaces });
      }
    }
    return groups;
  }, [accessibleWorkspaces, workspaceGroups]);

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
            <span className="font-semibold truncate">
              {resolveLabel(displayWorkspace.label)}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Multiple workspaces -- grouped dropdown
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
                {resolveLabel(displayWorkspace.label)}
              </span>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[--radix-dropdown-menu-trigger-width] max-h-96 overflow-y-auto"
          >
            {groupedWorkspaces.length > 0 ? (
              groupedWorkspaces.map((group, groupIndex) => (
                <DropdownMenuGroup key={group.groupId}>
                  {groupIndex > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuLabel className="text-caption text-muted-foreground uppercase tracking-wider">
                    {resolveGroupLabel(group.label)}
                  </DropdownMenuLabel>
                  {group.workspaces.map((ws) => (
                    <DropdownMenuItem
                      key={ws.id}
                      onClick={() => onWorkspaceChange(ws.id)}
                    >
                      {renderIcon(ws.iconName, "size-4")}
                      <span className="flex-1 truncate">
                        {resolveLabel(ws.label)}
                      </span>
                      {ws.id === activeWorkspaceId && (
                        <Check className="ml-auto size-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              ))
            ) : (
              accessibleWorkspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.id}
                  onClick={() => onWorkspaceChange(ws.id)}
                >
                  {renderIcon(ws.iconName, "size-4")}
                  <span className="flex-1 truncate">
                    {resolveLabel(ws.label)}
                  </span>
                  {ws.id === activeWorkspaceId && (
                    <Check className="ml-auto size-4" />
                  )}
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/workspaces">
                <Settings2 className="size-4" />
                <span>{manageLabel}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
