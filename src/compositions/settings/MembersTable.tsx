"use client";

import { useState } from "react";
import { Users, Trash2, Crown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../patterns/table";
import { Badge } from "../../primitives/badge";
import { Button } from "../../primitives/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../primitives/select";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitives/avatar";
import { RemoveMemberDialog } from "./RemoveMemberDialog";
import { EditMemberDialog } from "./EditMemberDialog";
import { MembersTableSkeleton } from "./MembersTableSkeleton";
import { cn } from "../../lib/utils";
import type { MembershipRole } from "../../types/domain";
import { ROLE_COLORS, STATUS_STYLES, ROLE_KEYS, STATUS_KEYS, getInitials, type EnrichedMember } from "./member-table-utils";

interface MembersTableProps {
  members: EnrichedMember[] | undefined;
  isAdmin?: boolean;
  isCurrentUserOwner?: boolean;
  currentUserId?: string;
  organizationId?: string;
  /** Total workspace count for the "X/Y" access display. */
  totalWorkspaceCount?: number;
  /** Handler for role changes. */
  onRoleChange?: (membershipId: string, newRole: MembershipRole) => Promise<void>;
  /** Handler for member edits (workspace access). */
  onMemberEdit?: (data: { membershipId: string; isOwner: boolean; workspaces: string[] }) => Promise<void>;
  /** Handler for member removal. */
  onMemberRemove?: (membershipId: string) => Promise<void>;
  /** All available workspace IDs. */
  allWorkspaceIds?: string[];
  /** Workspace data for the editor. */
  workspaces?: { id: string; label: string; iconName: string }[];
  /** Labels for i18n. */
  labels?: {
    member?: string; role?: string; workspaces?: string; status?: string; joined?: string;
    emptyTitle?: string; emptyDescription?: string; workspaceAccessAll?: string; you?: string;
    roleLabels?: Record<string, string>; statusLabels?: Record<string, string>;
  };
}

function getWorkspaceSummary(member: EnrichedMember, totalWorkspaceCount: number): string {
  if (member.isOwner) return "all";
  if (!member.workspaces) return "all";
  return `${member.workspaces.length}/${totalWorkspaceCount}`;
}

export function MembersTable({
  members, isAdmin = false, isCurrentUserOwner = false, currentUserId, organizationId,
  totalWorkspaceCount = 13, onRoleChange, onMemberEdit, onMemberRemove,
  allWorkspaceIds = [], workspaces = [], labels = {},
}: MembersTableProps) {
  const [removeMember, setRemoveMember] = useState<EnrichedMember | null>(null);
  const roleLabels = labels.roleLabels ?? Object.fromEntries(Object.entries(ROLE_KEYS).map(([k, v]) => [k, v]));

  if (members === undefined) return <MembersTableSkeleton showActions={isAdmin} />;

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center">
        <Users className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-body font-medium text-muted-foreground">{labels.emptyTitle ?? "No members"}</p>
        <p className="text-caption text-muted-foreground/70">{labels.emptyDescription ?? "Invite someone to get started."}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">{labels.member ?? "Member"}</TableHead>
              <TableHead>{labels.role ?? "Role"}</TableHead>
              <TableHead>{labels.workspaces ?? "Workspaces"}</TableHead>
              <TableHead>{labels.status ?? "Status"}</TableHead>
              <TableHead>{labels.joined ?? "Joined"}</TableHead>
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
                        {member.userAvatarUrl && <AvatarImage src={member.userAvatarUrl} alt={member.userName} />}
                        <AvatarFallback name={member.userName}>{getInitials(member.userName)}</AvatarFallback>
                      </Avatar>
                      <div className="grid text-body leading-tight">
                        <span className="truncate font-medium">
                          {member.userName}
                          {isSelf && <span className="ml-1 text-caption text-muted-foreground">{labels.you ?? "(you)"}</span>}
                        </span>
                        <span className="truncate text-caption text-muted-foreground">{member.userEmail}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {canModify && onRoleChange ? (
                      <Select value={member.role} onValueChange={(v) => onRoleChange(member._id, v as MembershipRole)}>
                        <SelectTrigger className="h-8 text-caption"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.keys(ROLE_KEYS) as MembershipRole[]).map((role) => (
                            <SelectItem key={role} value={role}>{roleLabels[role] ?? ROLE_KEYS[role]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="secondary" className={cn("border-0 font-medium", ROLE_COLORS[member.role])}>
                        {roleLabels[member.role] ?? ROLE_KEYS[member.role]}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {member.isOwner && <Crown className="h-4 w-4 text-amber-500" />}
                      <span className="text-body text-muted-foreground">
                        {getWorkspaceSummary(member, totalWorkspaceCount) === "all" ? (labels.workspaceAccessAll ?? "All") : getWorkspaceSummary(member, totalWorkspaceCount)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("border-0 font-medium", STATUS_STYLES[member.status])}>
                      {labels.statusLabels?.[member.status] ?? STATUS_KEYS[member.status] ?? member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-body text-muted-foreground">
                    {new Date(member.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {canModify && organizationId && onMemberEdit && (
                          <EditMemberDialog
                            member={member} organizationId={organizationId}
                            isCurrentUserOwner={isCurrentUserOwner}
                            allWorkspaceIds={allWorkspaceIds} onSave={onMemberEdit}
                            workspaces={workspaces}
                          />
                        )}
                        {canModify && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setRemoveMember(member)}>
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
      {removeMember && organizationId && onMemberRemove && (
        <RemoveMemberDialog
          open={!!removeMember} onOpenChange={(o) => { if (!o) setRemoveMember(null); }}
          organizationId={organizationId} membershipId={removeMember._id} memberName={removeMember.userName}
          onConfirm={() => onMemberRemove(removeMember._id)}
        />
      )}
    </>
  );
}
