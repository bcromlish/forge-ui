/**
 * Organization switcher — shows active org name + dropdown for switching.
 * Single-org users see org name without a dropdown.
 *
 * @see hooks/useActiveOrganization.ts for the org context
 */
"use client";

import { useTranslations } from "next-intl";
import { ChevronsUpDown, Check, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
// TODO: Replace with prop-based API
// import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../primitives/sidebar";

/** First letter of org name as avatar placeholder. */
function OrgAvatar({ name }: { name: string }) {
  return (
    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-body font-medium">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/** Org switcher dropdown for the sidebar header. */
export function OrgSwitcher() {
  const { organization, memberships, switchOrg, isLoading } =
    useActiveOrganization();
  const router = useRouter();
  const tCommon = useTranslations("common");
  const tOnboarding = useTranslations("onboarding.createOrg");

  if (isLoading || !organization) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted" />
            <span className="text-muted-foreground">{tCommon("loading")}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Single org — show name without dropdown
  if (memberships.length <= 1) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <OrgAvatar name={organization.name} />
            <span className="font-semibold truncate">{organization.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Multi-org — full dropdown
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <OrgAvatar name={organization.name} />
              <span className="font-semibold truncate flex-1">
                {organization.name}
              </span>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[--radix-dropdown-menu-trigger-width]"
          >
            {memberships.map((org) => (
              <DropdownMenuItem
                key={org._id}
                onClick={() => switchOrg(org._id)}
              >
                <OrgAvatar name={org.name} />
                <span className="flex-1 truncate">{org.name}</span>
                {org._id === organization._id && (
                  <Check className="ml-auto size-4" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/onboarding")}>
              <Plus className="size-4" />
              <span>{tOnboarding("title")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
