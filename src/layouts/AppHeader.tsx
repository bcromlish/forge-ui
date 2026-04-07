"use client";

import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { Button } from "../primitives/button";
import {
  SegmentedToggle,
  type SegmentedToggleItem,
} from "./segmented-toggle";
import { SidebarTrigger } from "../primitives/sidebar";

/** Props for {@link AppHeader}. */
interface AppHeaderProps {
  /** Currently active tab value. */
  activeTab: string;
  /** Callback fired when the active tab changes. */
  onTabChange: (tab: string) => void;
}

/**
 * App header with sidebar trigger, centered segmented toggle,
 * and notification bell. Settings/sign-out live in the sidebar footer menu.
 */
export function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
  const t = useTranslations("navigation.tabs");

  const tabs: SegmentedToggleItem[] = [
    { value: "chat", label: t("chat") },
    { value: "tasks", label: t("tasks") },
    { value: "calendar", label: t("calendar") },
    { value: "workspaces", label: t("workspaces") },
  ];

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background px-4">
      {/* Left: sidebar trigger */}
      <SidebarTrigger className="-ml-1" />

      {/* Center: segmented toggle */}
      <div className="flex flex-1 justify-center">
        <SegmentedToggle
          items={tabs}
          value={activeTab}
          onValueChange={onTabChange}
        />
      </div>

      {/* Right: bell */}
      <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </Button>
    </header>
  );
}
