"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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

/** User data for the sidebar footer. */
export interface SidebarFooterUser {
  name?: string;
  email: string;
  role?: string;
  avatarUrl?: string;
}

/** Organization data for the sidebar footer. */
export interface SidebarFooterOrg {
  name: string;
}

/** Locale/language configuration. */
export interface LocaleConfig {
  locale: string;
  availableLocales: [string, string][];
  switchLocale: (code: string) => void;
}

/** Props for {@link SidebarFooterContent}. */
interface SidebarFooterContentProps {
  /** Sign-out handler passed from auth layout. */
  onSignOut: () => void;
  /** Current user data. Null hides the footer. */
  user: SidebarFooterUser | null;
  /** Current organization. */
  organization?: SidebarFooterOrg | null;
  /** Locale configuration for language switching. */
  localeConfig?: LocaleConfig;
  /** Labels for the footer menu items. */
  labels?: {
    settings?: string;
    theme?: string;
    themeLight?: string;
    themeDark?: string;
    themeSystem?: string;
    language?: string;
    getHelp?: string;
    viewAllPlans?: string;
    logOut?: string;
  };
  /** Labels for role display. */
  roleLabels?: Record<string, string>;
}

/** Role key mapping for translation lookup. */
const DEFAULT_ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  hiring_manager: "Hiring Manager",
  interviewer: "Interviewer",
  viewer: "Viewer",
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
export function SidebarFooterContent({
  onSignOut,
  user,
  organization,
  localeConfig,
  labels = {},
  roleLabels = DEFAULT_ROLE_LABELS,
}: SidebarFooterContentProps) {
  const { setTheme } = useTheme();
  const router = useRouter();

  if (!user) return null;

  const displayName = user.name || user.email;
  const initials = getInitials(displayName);
  const roleLabel = user.role ? (roleLabels[user.role] ?? user.role) : undefined;

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
                  {roleLabel && (
                    <span className="truncate text-caption text-muted-foreground">
                      {roleLabel}
                    </span>
                  )}
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
                {labels.settings ?? "Settings"}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun className="mr-2 h-4 w-4 dark:hidden" />
                  <Moon className="mr-2 h-4 w-4 hidden dark:block" />
                  {labels.theme ?? "Theme"}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    {labels.themeLight ?? "Light"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    {labels.themeDark ?? "Dark"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    {labels.themeSystem ?? "System"}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              {localeConfig && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Globe className="mr-2 h-4 w-4" />
                    {labels.language ?? "Language"}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {localeConfig.availableLocales.map(([code, name]) => (
                      <DropdownMenuItem
                        key={code}
                        onClick={() => localeConfig.switchLocale(code)}
                      >
                        {localeConfig.locale === code && (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        {localeConfig.locale !== code && (
                          <span className="mr-2 h-4 w-4" />
                        )}
                        {name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                {labels.getHelp ?? "Get Help"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ListChecks className="mr-2 h-4 w-4" />
                {labels.viewAllPlans ?? "View All Plans"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                {labels.logOut ?? "Log Out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
