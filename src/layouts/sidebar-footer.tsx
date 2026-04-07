"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import {
  Check,
  ChevronsUpDown,
  Settings,
  Globe,
  HelpCircle,
  ListChecks,
  LogOut,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../primitives/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../primitives/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";
// TODO: Replace with prop-based API
// import { useCurrentUser } from "@/features/users/hooks-current";
// TODO: Replace with prop-based API
// import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
// TODO: Replace with prop-based API
// import { useLanguage } from "@/hooks/useLanguage";

/** Props for {@link SidebarFooterContent}. */
interface SidebarFooterContentProps {
  /** Sign-out handler passed from auth layout. */
  onSignOut: () => void;
}

/** Role key mapping for translation lookup. */
const ROLE_KEYS: Record<string, "admin" | "hiringManager" | "interviewer" | "viewer"> = {
  admin: "admin",
  hiring_manager: "hiringManager",
  interviewer: "interviewer",
  viewer: "viewer",
};

/** Get initials from a name or email. Falls back to first letter of email. */
function getInitials(nameOrEmail: string): string {
  if (nameOrEmail.includes("@")) {
    return nameOrEmail[0]?.toUpperCase() ?? "?";
  }
  return nameOrEmail
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Shared sidebar footer with user avatar, name, role, and a dropdown menu
 * for settings, theme, language, help, plans, and sign-out.
 */
export function SidebarFooterContent({ onSignOut }: SidebarFooterContentProps) {
  const user = useCurrentUser();
  const { organization } = useActiveOrganization();
  const { setTheme } = useTheme();
  const router = useRouter();
  const { locale, availableLocales, switchLocale } = useLanguage();
  const tSidebar = useTranslations("sidebar.footer");
  const tRoles = useTranslations("roles");

  if (!user) return null;

  const displayName = user.name || user.email;
  const initials = getInitials(displayName);
  const roleKey = ROLE_KEYS[user.role] ?? "viewer";
  const roleLabel = tRoles(roleKey);

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="h-auto min-h-12">
                <Avatar size="sm" className="shrink-0">
                  {user.avatarUrl && (
                    <AvatarImage src={user.avatarUrl} alt={displayName} />
                  )}
                  <AvatarFallback name={displayName}>{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-body leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-caption text-muted-foreground">
                    {roleLabel}
                  </span>
                  {organization?.name && (
                    <span className="truncate text-caption text-muted-foreground/70">
                      {organization.name}
                    </span>
                  )}
                </div>
                <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="w-64"
            >
              <DropdownMenuLabel className="font-normal text-caption text-muted-foreground">
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
                <Settings className="mr-2 h-4 w-4" />
                {tSidebar("settings")}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun className="mr-2 h-4 w-4 dark:hidden" />
                  <Moon className="mr-2 h-4 w-4 hidden dark:block" />
                  {tSidebar("theme")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    {tSidebar("themeLight")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    {tSidebar("themeDark")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    {tSidebar("themeSystem")}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Globe className="mr-2 h-4 w-4" />
                  {tSidebar("language")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {availableLocales.map(([code, name]) => (
                    <DropdownMenuItem
                      key={code}
                      onClick={() => switchLocale(code)}
                    >
                      {locale === code && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {locale !== code && (
                        <span className="mr-2 h-4 w-4" />
                      )}
                      {name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                {tSidebar("getHelp")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ListChecks className="mr-2 h-4 w-4" />
                {tSidebar("viewAllPlans")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                {tSidebar("logOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
