/**
 * Organization switcher -- shows active org name + dropdown for switching.
 * Single-org users see org name without a dropdown.
 */
"use client";

import { ChevronsUpDown, Check, Plus } from "lucide-react";
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

/** An organization membership entry. */
export interface OrgMembership {
  _id: string;
  name: string;
}

/** Props for {@link OrgSwitcher}. */
export interface OrgSwitcherProps {
  /** The currently active organization. */
  organization: OrgMembership | null;
  /** All organizations the user belongs to. */
  memberships: OrgMembership[];
  /** Switch to a different organization. */
  onSwitchOrg: (orgId: string) => void;
  /** Whether data is still loading. */
  isLoading?: boolean;
  /** Label for the loading state. */
  loadingLabel?: string;
  /** Label for the "Create Organization" action. */
  createOrgLabel?: string;
  /** Called when user clicks "Create Organization". */
  onCreateOrg?: () => void;
}

/** First letter of org name as avatar placeholder. */
function OrgAvatar({ name }: { name: string }) {
  return (
    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-body font-medium">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/** Org switcher dropdown for the sidebar header. */
export function OrgSwitcher({
  organization,
  memberships,
  onSwitchOrg,
  isLoading = false,
  loadingLabel = "Loading...",
  createOrgLabel = "Create Organization",
  onCreateOrg,
}: OrgSwitcherProps) {
  if (isLoading || !organization) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted" />
            <span className="text-muted-foreground">{loadingLabel}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Single org -- show name without dropdown
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

  // Multi-org -- full dropdown
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
                onClick={() => onSwitchOrg(org._id)}
              >
                <OrgAvatar name={org.name} />
                <span className="flex-1 truncate">{org.name}</span>
                {org._id === organization._id && (
                  <Check className="ml-auto size-4" />
                )}
              </DropdownMenuItem>
            ))}
            {onCreateOrg && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onCreateOrg}>
                  <Plus className="size-4" />
                  <span>{createOrgLabel}</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
