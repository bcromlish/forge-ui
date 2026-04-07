// Universal layout components
export * from './dashboard-layout';
export * from './DetailPanel';
export * from './list-page-layout';
export * from './segmented-toggle';
export * from './workspace-icons';

// TODO: The following layout components are temporarily excluded because they
// depend on next/navigation, next-intl, and VidCruiter-specific hooks.
// They need to be refactored to accept data via props before re-exporting.
//
// Excluded: AppHeader, AppSidebar, ConfirmDialog, OrgSwitcher,
//   SettingsSidebar, SidebarBack, sidebar-calendar, sidebar-chat,
//   sidebar-footer, sidebar-tasks, sidebar-workspaces, WorkspaceSelector
