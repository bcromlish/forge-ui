"use client";

import { useTranslations } from "next-intl";
import { CheckSquare } from "lucide-react";
import { SidebarContent, SidebarGroup } from "../primitives/sidebar";

/** Tasks tab sidebar — placeholder for future task management. */
export function SidebarTasks() {
  const t = useTranslations("sidebar.tasks");
  const tCommon = useTranslations("common");

  return (
    <SidebarContent>
      <SidebarGroup className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
        <CheckSquare className="h-8 w-8 text-muted-foreground/50" />
        <p className="text-body font-medium text-muted-foreground">{t("title")}</p>
        <p className="text-caption text-muted-foreground/70">{tCommon("comingSoon")}</p>
      </SidebarGroup>
    </SidebarContent>
  );
}
