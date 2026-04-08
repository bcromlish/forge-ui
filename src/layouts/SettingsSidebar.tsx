"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { User, KeyRound, Users, Settings2, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../primitives/sidebar";
import { SidebarBack } from "./SidebarBack";
import { SidebarFooterContent } from "./sidebar-footer";
import type { SidebarFooterUser, SidebarFooterOrg, LocaleConfig } from "./sidebar-footer";

/** Settings navigation items with route, icon, and optional required permission. */
const SETTINGS_NAV_ITEMS = [
  { label: "Profile", href: "/settings/profile", icon: User },
  { label: "Authentication", href: "/settings/authentication", icon: KeyRound },
  { label: "Members", href: "/settings/members", icon: Users, permission: "members:read" },
  { label: "Workspaces", href: "/settings/workspaces", icon: Settings2, permission: "settings:read" },
  { label: "Custom Fields", href: "/settings/custom-fields", icon: FileText, permission: "settings:read" },
] as const;

/** Props for {@link SettingsSidebar}. */
interface SettingsSidebarProps {
  /** Sign-out handler forwarded to the shared footer. */
  onSignOut: () => void;
  /** User's granted permissions. Items with a permission not in this set are hidden. */
  permissions?: Set<string>;
  /** Whether permissions are still loading. */
  permissionsLoading?: boolean;
  /** Footer user data. */
  footerUser?: SidebarFooterUser | null;
  /** Footer organization data. */
  footerOrg?: SidebarFooterOrg | null;
  /** Locale config for language switcher. */
  localeConfig?: LocaleConfig;
}

/**
 * Settings-specific sidebar replacing AppSidebar on /settings/* routes.
 * Renders a back button, settings nav items, and the shared user footer.
 * Permission-based filtering is done via the `permissions` prop.
 */
export function SettingsSidebar({
  onSignOut,
  permissions = new Set(),
  permissionsLoading = false,
  footerUser,
  footerOrg,
  localeConfig,
}: SettingsSidebarProps) {
  const pathname = usePathname();

  // Filter nav items by permission -- items without a permission field are always visible
  const visibleItems = useMemo(
    () =>
      permissionsLoading
        ? SETTINGS_NAV_ITEMS.filter((item) => !("permission" in item))
        : SETTINGS_NAV_ITEMS.filter(
            (item) =>
              !("permission" in item) ||
              !item.permission ||
              permissions.has(item.permission)
          ),
    [permissions, permissionsLoading]
  );

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b">
        <SidebarBack href="/positions" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            {visibleItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
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
