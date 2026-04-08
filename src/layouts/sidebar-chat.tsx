"use client";

import { usePathname, useRouter } from "next/navigation";
import { Plus, MessageCircle } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../primitives/sidebar";
import type { ChatItem } from "./AppSidebar";

/** Props for {@link SidebarChat}. */
interface SidebarChatProps {
  /** Active (non-archived) chats. Undefined means loading. */
  activeChats?: ChatItem[];
  /** Archived chats. */
  archivedChats?: ChatItem[];
  /** Render function for a single chat menu item. */
  renderChatItem?: (chat: ChatItem, isActive: boolean) => React.ReactNode;
  /** Labels for i18n. */
  labels?: {
    title?: string;
    newChat?: string;
    noChats?: string;
    saved?: string;
    recent?: string;
    archived?: string;
    defaultChatTitle?: string;
    loading?: string;
  };
}

/**
 * Chat sidebar panel -- shows Saved, Recent, and Archived chat sections.
 * All data provided via props -- no internal data fetching.
 */
export function SidebarChat({
  activeChats,
  archivedChats,
  renderChatItem,
  labels = {},
}: SidebarChatProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoading = activeChats === undefined;
  const saved = activeChats?.filter((c) => c.isBookmarked) ?? [];
  const recent = activeChats?.filter((c) => !c.isBookmarked) ?? [];
  const archived = archivedChats ?? [];

  const defaultRenderItem = (chat: ChatItem, isActive: boolean) => (
    <SidebarMenuItem key={chat._id}>
      <SidebarMenuButton asChild isActive={isActive}>
        <a href={`/chat/${chat._id}`}>
          <span className="truncate">
            {chat.title || labels.defaultChatTitle || "New Chat"}
          </span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const render = renderChatItem ?? defaultRenderItem;

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>{labels.title ?? "Chat"}</SidebarGroupLabel>
        <SidebarGroupAction
          onClick={() => router.push("/")}
          title={labels.newChat ?? "New Chat"}
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
                  {labels.loading ?? "Loading..."}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      ) : (activeChats?.length ?? 0) === 0 && archived.length === 0 ? (
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-body">
                  {labels.noChats ?? "No chats yet"}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      ) : (
        <>
          {saved.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>{labels.saved ?? "Saved"}</SidebarGroupLabel>
              <SidebarMenu className="gap-0">
                {saved.map((chat) => render(chat, pathname === `/chat/${chat._id}`))}
              </SidebarMenu>
            </SidebarGroup>
          )}

          {recent.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>{labels.recent ?? "Recent"}</SidebarGroupLabel>
              <SidebarMenu className="gap-0">
                {recent.map((chat) => render(chat, pathname === `/chat/${chat._id}`))}
              </SidebarMenu>
            </SidebarGroup>
          )}

          {archived.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>{labels.archived ?? "Archived"}</SidebarGroupLabel>
              <SidebarMenu className="gap-0">
                {archived.map((chat) => render(chat, pathname === `/chat/${chat._id}`))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </>
      )}
    </SidebarContent>
  );
}
