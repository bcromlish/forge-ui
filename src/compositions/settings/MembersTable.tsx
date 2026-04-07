"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Users, Trash2, Crown } from "lucide-react";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../patterns/table";
import { Badge } from "../../primitives/badge";
import { Button } from "../../primitives/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../primitives/select";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitives/avatar";
import { RemoveMemberDialog } from "./RemoveMemberDialog";
import { EditMemberDialog } from "./EditMemberDialog";
import { MembersTableSkeleton } from "./MembersTableSkeleton";
// TODO: Replace with prop-based API
// import { useUpdateRole } from "@/features/organizations/hooks/useMemberships";
// TODO: Replace with prop-based API
// import { WORKSPACES } from "@/features/organizations/domain/workspaces";
import { cn } from "../../lib/utils";
// TODO: Replace with prop-based API
// import type { MembershipRole } from "@/features/organizations/types/memberships";
import {
  ROLE_COLORS, STATUS_STYLES, ROLE_KEYS, STATUS_KEYS,
  getInitials, type EnrichedMember,
} from "./member-table-utils";

/** Props for {@link MembersTable}. */
interface MembersTableProps {
  /** Members data: undefined = loading, empty array = no members. */
  members: EnrichedMember[] | undefined;
  /** Whether the current user is an admin (enables action controls). */
  isAdmin?: boolean;
  /** Whether the current user is an account owner (enables owner toggle). */
  isCurrentUserOwner?: boolean;
  /** Current user's ID (to prevent self-modification). */
  currentUserId?: string;
  /** Organization ID for mutations. */
  organizationId?: string;
}

/** Summarize workspace access for display. */
function getWorkspaceSummary(member: EnrichedMember): string {
  if (member.isOwner) return "all";
  if (!member.workspaces) return "all"; // legacy fallback
  return `${member.workspaces.length}/${WORKSPACES.length}`;
}

/**
 * Members table -- displays org members with avatar, name, email,
 * role badge/dropdown, workspace access, status, join date, and admin actions.
 * Handles loading and empty states.
 */
export function MembersTable({
  members,
  isAdmin = false,
  isCurrentUserOwner = false,
  currentUserId,
  organizationId,
}: MembersTableProps) {
  const [removeMember, setRemoveMember] = useState<EnrichedMember | null>(null);
  const updateRole = useUpdateRole();
  const t = useTranslations("settings.members");
  const tRoles = useTranslations("roles");
  const tCommon = useTranslations("common");

  const handleRoleChange = useCallback(
    async (membershipId: string, newRole: MembershipRole, memberName: string) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic string to Id<> bridge
        await updateRole({ organizationId: organizationId as any, membershipId: membershipId as any, newRole });
        toast.success(t("roleUpdated", { name: memberName, role: tRoles(ROLE_KEYS[newRole]) }));
      } catch (err) {
        const message = err instanceof Error ? err.message : t("roleUpdateError");
        toast.error(message);
      }
    },
    [organizationId, updateRole, t, tRoles]
  );

  if (members === undefined) {
    return <MembersTableSkeleton showActions={isAdmin} />;
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center">
        <Users className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-body font-medium text-muted-foreground">{t("emptyTitle")}</p>
        <p className="text-caption text-muted-foreground/70">{t("emptyDescription")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">{t("tableHeaders.member")}</TableHead>
              <TableHead>{t("tableHeaders.role")}</TableHead>
              <TableHead>{t("tableHeaders.workspaces")}</TableHead>
              <TableHead>{t("tableHeaders.status")}</TableHead>
              <TableHead>{t("tableHeaders.joined")}</TableHead>
              {isAdmin && <TableHead className="w-24" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const isSelf = member.userId === currentUserId;
              const canModify = isAdmin && !isSelf;
              return (
                <TableRow key={member._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" className="shrink-0">
                        {member.userAvatarUrl && (
                          <AvatarImage src={member.userAvatarUrl} alt={member.userName} />
                        )}
                        <AvatarFallback name={member.userName}>
                          {getInitials(member.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid text-body leading-tight">
                        <span className="truncate font-medium">
                          {member.userName}
                          {isSelf && (
                            <span className="ml-1 text-caption text-muted-foreground">
                              {tCommon("you")}
                            </span>
                          )}
                        </span>
                        <span className="truncate text-caption text-muted-foreground">
                          {member.userEmail}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {canModify ? (
                      <Select
                        value={member.role}
                        onValueChange={(v) =>
                          handleRoleChange(member._id, v as MembershipRole, member.userName)
                        }
                      >
                        <SelectTrigger className="h-8 text-caption">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(ROLE_KEYS) as MembershipRole[]).map((role) => (
                            <SelectItem key={role} value={role}>
                              {tRoles(ROLE_KEYS[role])}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant="secondary"
                        className={cn("border-0 font-medium", ROLE_COLORS[member.role])}
                      >
                        {tRoles(ROLE_KEYS[member.role])}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {member.isOwner && <Crown className="h-4 w-4 text-amber-500" />}
                      <span className="text-body text-muted-foreground">
                        {getWorkspaceSummary(member) === "all"
                          ? t("workspaceAccess.all")
                          : getWorkspaceSummary(member)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn("border-0 font-medium", STATUS_STYLES[member.status])}
                    >
                      {t(`statuses.${STATUS_KEYS[member.status]}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-body text-muted-foreground">
                    {new Date(member.joinedAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {canModify && organizationId && (
                          <EditMemberDialog
                            member={member}
                            organizationId={organizationId}
                            isCurrentUserOwner={isCurrentUserOwner}
                          />
                        )}
                        {canModify && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setRemoveMember(member)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {removeMember && organizationId && (
        <RemoveMemberDialog
          open={!!removeMember}
          onOpenChange={(open) => { if (!open) setRemoveMember(null); }}
          organizationId={organizationId}
          membershipId={removeMember._id}
          memberName={removeMember.userName}
        />
      )}
    </>
  );
}
