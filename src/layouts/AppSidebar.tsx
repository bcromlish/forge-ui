"use client";

import { useCallback } from "react";
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
import type { WorkspaceConfig, WorkspaceGroup } from "../types/domain";
import type { OrgSwitcherProps } from "./OrgSwitcher";
import type { SidebarFooterUser, SidebarFooterOrg, LocaleConfig } from "./sidebar-footer";
import type { CalendarEvent, DragSelection } from "../types/calendar";
import type { User } from "../types/domain";

/** Props for {@link AppSidebar}. */
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  /** Currently active tab -- determines which sidebar content to render. */
  activeTab: string;
  /** Sign-out handler -- forwarded to sidebar footer menu. */
  onSignOut: () => void;

  // --- Workspace data (required when activeTab === "workspaces") ---
  /** Workspaces the user can access. */
  accessibleWorkspaces?: WorkspaceConfig[];
  /** Workspace groups for grouped dropdown. */
  workspaceGroups?: WorkspaceGroup[];
  /** Active workspace inferred from pathname. */
  activeWorkspaceId?: string;

  // --- Org switcher data ---
  /** Org switcher props forwarded to OrgSwitcher. */
  orgSwitcher?: OrgSwitcherProps;

  // --- Footer data ---
  /** Current user for sidebar footer. */
  footerUser?: SidebarFooterUser | null;
  /** Current organization for sidebar footer. */
  footerOrg?: SidebarFooterOrg | null;
  /** Locale config for language switcher. */
  localeConfig?: LocaleConfig;

  // --- Chat data (required when activeTab === "chat") ---
  /** Active (non-archived) chats. */
  activeChats?: ChatItem[];
  /** Archived chats. */
  archivedChats?: ChatItem[];
  /** Render function for a single chat menu item. */
  renderChatItem?: (chat: ChatItem, isActive: boolean) => React.ReactNode;

  // --- Calendar data (required when activeTab === "calendar") ---
  /** Calendar events for the sidebar mini-calendar and today's events. */
  calendarEvents?: CalendarEvent[];
  /** Organization members for the team member filter. */
  calendarMembers?: User[];
  /** Currently selected member IDs. */
  calendarSelectedIds?: Set<string>;
  /** Callbacks for calendar sidebar interactions. */
  onCalendarMemberAdd?: (userId: string) => void;
  onCalendarMemberRemove?: (userId: string) => void;
  onCalendarDateSelect?: (date: Date) => void;
  onCalendarEventClick?: (event: CalendarEvent) => void;
}

/** Minimal chat item shape for the sidebar. */
export interface ChatItem {
  _id: string;
  title?: string;
  isBookmarked?: boolean;
}

/**
 * Main application sidebar that renders tab-specific content.
 * All data is provided via props -- no internal data fetching.
 */
export function AppSidebar({
  activeTab,
  onSignOut,
  accessibleWorkspaces = [],
  workspaceGroups = [],
  activeWorkspaceId,
  orgSwitcher,
  footerUser,
  footerOrg,
  localeConfig,
  activeChats,
  archivedChats,
  renderChatItem,
  calendarEvents,
  calendarMembers,
  calendarSelectedIds,
  onCalendarMemberAdd,
  onCalendarMemberRemove,
  onCalendarDateSelect,
  onCalendarEventClick,
  ...props
}: AppSidebarProps) {
  const router = useRouter();

  const activeWorkspace = accessibleWorkspaces.find(
    (ws) => ws.id === activeWorkspaceId
  ) ?? accessibleWorkspaces[0];

  const handleWorkspaceChange = useCallback(
    (workspaceId: string) => {
      const ws = accessibleWorkspaces.find((w) => w.id === workspaceId);
      if (ws?.navItems[0]) {
        router.push(ws.navItems[0].href);
      }
    },
    [accessibleWorkspaces, router]
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b">
        {orgSwitcher ? <OrgSwitcher {...orgSwitcher} /> : null}
      </SidebarHeader>
      {activeTab === "workspaces" && activeWorkspace && (
        <>
          <WorkspaceSelector
            activeWorkspaceId={activeWorkspaceId ?? activeWorkspace.id}
            accessibleWorkspaces={accessibleWorkspaces}
            workspaceGroups={workspaceGroups}
            onWorkspaceChange={handleWorkspaceChange}
          />
          <SidebarWorkspaces workspace={activeWorkspace} />
        </>
      )}
      {activeTab === "chat" && (
        <SidebarChat
          activeChats={activeChats}
          archivedChats={archivedChats}
          renderChatItem={renderChatItem}
        />
      )}
      {activeTab === "tasks" && <SidebarTasks />}
      {activeTab === "calendar" && (
        <SidebarCalendar
          events={calendarEvents ?? []}
          members={calendarMembers ?? []}
          selectedIds={calendarSelectedIds ?? new Set()}
          onMemberAdd={onCalendarMemberAdd}
          onMemberRemove={onCalendarMemberRemove}
          onDateSelect={onCalendarDateSelect}
          onEventClick={onCalendarEventClick}
        />
      )}
      <SidebarFooterContent
        onSignOut={onSignOut}
        user={footerUser ?? null}
        organization={footerOrg ?? null}
        localeConfig={localeConfig}
      />
      <SidebarRail />
    </Sidebar>
  );
}
