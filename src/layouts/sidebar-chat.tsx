"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus, MessageCircle } from "lucide-react";
// TODO: Replace with prop-based API
// import { useActiveChats, useArchivedChats } from "@/features/chats/hooks";
// TODO: Replace with prop-based API
// import { ChatMenuItem } from "@/features/chats/components/ChatMenuItem";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../primitives/sidebar";

/** Chat sidebar panel -- shows Saved, Recent, and Archived chat sections. */
export function SidebarChat() {
  const activeChats = useActiveChats();
  const archivedChats = useArchivedChats();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("sidebar.chat");
  const tCommon = useTranslations("common");

  const isLoading = activeChats === undefined;
  const saved = activeChats?.filter((c) => c.isBookmarked) ?? [];
  const recent = activeChats?.filter((c) => !c.isBookmarked) ?? [];
  const archived = archivedChats ?? [];

  return (
    <SidebarContent>
      {/* New chat button lives in the top group header */}
      <SidebarGroup>
        <SidebarGroupLabel>{t("title")}</SidebarGroupLabel>
        <SidebarGroupAction
          onClick={() => router.push("/")}
          title={t("newChat")}
        >
          <Plus className="h-4 w-4" />
        </SidebarGroupAction>
      </SidebarGroup>

      {isLoading ? (
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <span className="text-muted-foreground text-body">
                  {tCommon("loading")}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      ) : activeChats.length === 0 && archived.length === 0 ? (
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-body">
                  {t("noChats")}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      ) : (
        <>
          {/* Saved section -- only shown when bookmarked chats exist */}
          {saved.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>{t("saved")}</SidebarGroupLabel>
              <SidebarMenu className="gap-0">
                {saved.map((chat) => (
                  <ChatMenuItem
                    key={chat._id}
                    chatId={chat._id}
                    title={chat.title || t("defaultChatTitle")}
                    isActive={pathname === `/chat/${chat._id}`}
                    isBookmarked
                    isArchived={false}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}

          {/* Recent section */}
          {recent.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>{t("recent")}</SidebarGroupLabel>
              <SidebarMenu className="gap-0">
                {recent.map((chat) => (
                  <ChatMenuItem
                    key={chat._id}
                    chatId={chat._id}
                    title={chat.title || t("defaultChatTitle")}
                    isActive={pathname === `/chat/${chat._id}`}
                    isBookmarked={false}
                    isArchived={false}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}

          {/* Archived section -- only shown when archived chats exist */}
          {archived.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>{t("archived")}</SidebarGroupLabel>
              <SidebarMenu className="gap-0">
                {archived.map((chat) => (
                  <ChatMenuItem
                    key={chat._id}
                    chatId={chat._id}
                    title={chat.title || t("defaultChatTitle")}
                    isActive={pathname === `/chat/${chat._id}`}
                    isBookmarked={false}
                    isArchived
                  />
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </>
      )}
    </SidebarContent>
  );
}
