"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarRail,
} from "../primitives/sidebar";
import { OrgSwitcher } from "./OrgSwitcher";
import { WorkspaceSelector } from "./WorkspaceSelector";
import { SidebarWorkspaces } from "./sidebar-workspaces";
import { SidebarChat } from "./sidebar-chat";
import { SidebarTasks } from "./sidebar-tasks";
import { SidebarCalendar } from "./sidebar-calendar";
import { SidebarFooterContent } from "./sidebar-footer";
// TODO: Replace with prop-based API
// import { useCurrentMembership } from "@/features/organizations/hooks/useCurrentMembership";
// TODO: Replace with prop-based API
// import type { WorkspaceId } from "@/features/organizations/types/workspaces";
// import {
//   getAccessibleWorkspaces,
//   workspaceForPath,
//   getDefaultRoute,
// TODO: Replace with prop-based API
// } from "@/features/organizations/domain/workspaces";

/** Props for {@link AppSidebar}. */
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  /** Currently active tab -- determines which sidebar content to render. */
  activeTab: string;
  /** Sign-out handler -- forwarded to sidebar footer menu. */
  onSignOut: () => void;
}

/**
 * Main application sidebar that renders tab-specific content.
 * For the workspaces tab, integrates WorkspaceSelector dropdown
 * and passes the active workspace config to SidebarWorkspaces.
 * Active workspace is inferred from the current pathname -- selecting
 * a workspace navigates to its default route, and pathname inference
 * keeps the selection in sync as the user navigates.
 *
 * Workspace access is membership-based: Account Owners see all 13,
 * non-owners see their granted workspaces, legacy memberships see all.
 */
export function AppSidebar({ activeTab, onSignOut, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const membership = useCurrentMembership();

  // Build accessible workspaces from membership (isOwner + workspaces array).
  // Handles: loading (undefined) → empty, null → legacy (all), data → filtered.
  const accessibleWorkspaces = useMemo(
    () =>
      getAccessibleWorkspaces({
        isOwner: membership?.isOwner,
        workspaces: membership?.workspaces,
      }),
    [membership?.isOwner, membership?.workspaces]
  );

  // Active workspace inferred from current pathname.
  // Persists naturally: navigating within a workspace keeps the same ID.
  const activeWorkspaceId = useMemo(
    () => workspaceForPath(pathname, accessibleWorkspaces),
    [pathname, accessibleWorkspaces]
  );

  const activeWorkspace = useMemo(
    () =>
      accessibleWorkspaces.find((ws) => ws.id === activeWorkspaceId) ??
      accessibleWorkspaces[0],
    [accessibleWorkspaces, activeWorkspaceId]
  );

  /** Navigate to the selected workspace's default route. */
  const handleWorkspaceChange = useCallback(
    (workspaceId: WorkspaceId) => {
      const route = getDefaultRoute(accessibleWorkspaces, workspaceId);
      router.push(route);
    },
    [accessibleWorkspaces, router]
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b">
        <OrgSwitcher />
      </SidebarHeader>
      {activeTab === "workspaces" && activeWorkspace && (
        <>
          <WorkspaceSelector
            activeWorkspaceId={activeWorkspaceId}
            accessibleWorkspaces={accessibleWorkspaces}
            onWorkspaceChange={handleWorkspaceChange}
          />
          <SidebarWorkspaces workspace={activeWorkspace} />
        </>
      )}
      {activeTab === "chat" && <SidebarChat />}
      {activeTab === "tasks" && <SidebarTasks />}
      {activeTab === "calendar" && <SidebarCalendar />}
      <SidebarFooterContent onSignOut={onSignOut} />
      <SidebarRail />
    </Sidebar>
  );
}
