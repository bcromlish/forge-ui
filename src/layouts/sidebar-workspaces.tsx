"use client";

import { createElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Briefcase } from "lucide-react";
// TODO: Replace with prop-based API
// import type { WorkspaceConfig } from "@/features/organizations/types/workspaces";
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
 *
 * @see components/layouts/AppSidebar.tsx for workspace state management
 * @see lib/domain/workspaces.ts for workspace definitions
 */
export function SidebarWorkspaces({ workspace }: SidebarWorkspacesProps) {
  const pathname = usePathname();
  const tWorkspaces = useTranslations("navigation.workspaces");
  const tItems = useTranslations("navigation.items");

  return (
    <SidebarContent>
      <SidebarGroup>
        {/* workspace.label is a translation key (e.g. "recruiting") resolved at render */}
        <SidebarGroupLabel>
          {tWorkspaces(workspace.label as Parameters<typeof tWorkspaces>[0])}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {workspace.navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/");
              // item.label is a translation key (e.g. "positions") resolved at render
              const resolvedLabel = tItems(item.label as Parameters<typeof tItems>[0]);
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
