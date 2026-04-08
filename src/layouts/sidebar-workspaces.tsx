"use client";

import { createElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase } from "lucide-react";
import type { WorkspaceConfig } from "../types/domain";
import { WORKSPACE_ICON_MAP } from "./workspace-icons";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../primitives/sidebar";

/** Props for {@link SidebarWorkspaces}. */
interface SidebarWorkspacesProps {
  /** The active workspace config whose nav items should be rendered. */
  workspace: WorkspaceConfig;
  /** Optional label resolver. Defaults to returning the label as-is. */
  resolveLabel?: (key: string) => string;
  /** Optional item label resolver. Defaults to returning the label as-is. */
  resolveItemLabel?: (key: string) => string;
}

/**
 * Renders a Lucide icon by name using createElement.
 * Falls back to Briefcase for unknown icon names.
 */
function renderIcon(iconName: string, className: string) {
  const icon = WORKSPACE_ICON_MAP[iconName] ?? Briefcase;
  return createElement(icon, { className });
}

/**
 * Workspaces tab sidebar -- renders nav items for the active workspace.
 * Receives workspace config from parent instead of using hardcoded items.
 */
export function SidebarWorkspaces({
  workspace,
  resolveLabel = (k) => k,
  resolveItemLabel = (k) => k,
}: SidebarWorkspacesProps) {
  const pathname = usePathname();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>
          {resolveLabel(workspace.label)}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {workspace.navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/");
              const resolvedLabel = resolveItemLabel(item.label);
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={resolvedLabel}
                  >
                    <Link href={item.href}>
                      {renderIcon(item.iconName, "size-4")}
                      <span>{resolvedLabel}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
