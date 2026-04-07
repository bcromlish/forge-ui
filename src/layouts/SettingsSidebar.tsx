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
// TODO: Replace with prop-based API
// import { usePermissions } from "@/features/permissions/hooks/usePermissions";
// TODO: Replace with prop-based API
// import { hasPermission } from "@/features/permissions/domain/permissions";

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
}

/**
 * Settings-specific sidebar replacing AppSidebar on /settings/* routes.
 * Renders a back button, settings nav items, and the shared user footer.
 * Uses the same Sidebar shell as AppSidebar for visual consistency.
 */
export function SettingsSidebar({ onSignOut }: SettingsSidebarProps) {
  const pathname = usePathname();
  const { permissions, loading } = usePermissions();

  // Filter nav items by permission -- items without a permission field are always visible
  const visibleItems = useMemo(
    () =>
      loading
        ? SETTINGS_NAV_ITEMS.filter((item) => !("permission" in item))
        : SETTINGS_NAV_ITEMS.filter(
            (item) =>
              !("permission" in item) ||
              !item.permission ||
              hasPermission(permissions, item.permission)
          ),
    [permissions, loading]
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
      <SidebarFooterContent onSignOut={onSignOut} />
      <SidebarRail />
    </Sidebar>
  );
}
