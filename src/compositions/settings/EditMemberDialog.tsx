"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../primitives/dialog";
import { Button } from "../../primitives/button";
import { Label } from "../../primitives/label";
import { Switch } from "../../primitives/switch";
import { Badge } from "../../primitives/badge";
import { WorkspaceAccessEditor } from "./WorkspaceAccessEditor";
// TODO: Replace with prop-based API
// import { useGrantWorkspaceAccess, useRevokeWorkspaceAccess, useSetOwner } from "@/features/organizations/hooks/useWorkspaces";
// TODO: Replace with prop-based API
// import { ALL_WORKSPACE_IDS } from "@/features/organizations/domain/workspaces";

/** Member shape expected by the dialog -- subset of enriched member. */
interface EditMemberInfo {
  _id: string;
  userName: string;
  userEmail: string;
  isOwner?: boolean;
  workspaces?: string[];
}

/** Props for {@link EditMemberDialog}. */
interface EditMemberDialogProps {
  member: EditMemberInfo;
  organizationId: string;
  /** Whether the current user is an owner (required to toggle owner flag). */
  isCurrentUserOwner: boolean;
}

/**
 * Dialog for editing a member's workspace access and owner flag.
 * Shows a multi-select workspace picker and owner toggle.
 * Computes diff on save -- grants new workspaces and revokes removed ones.
 */
export function EditMemberDialog({
  member,
  organizationId,
  isCurrentUserOwner,
}: EditMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const grantAccess = useGrantWorkspaceAccess();
  const revokeAccess = useRevokeWorkspaceAccess();
  const setOwnerMutation = useSetOwner();

  const t = useTranslations("settings.members.edit");
  const tCommon = useTranslations("common");

  // Sync local state when dialog opens or member data changes
  useEffect(() => {
    if (open) {
      setSelected(member.workspaces ?? [...ALL_WORKSPACE_IDS]);
      setIsOwner(member.isOwner ?? false);
    }
  }, [open, member.workspaces, member.isOwner]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        setIsSubmitting(false);
      }
    },
    []
  );

  const handleSave = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const currentIsOwner = member.isOwner ?? false;
      const ownerChanged = isOwner !== currentIsOwner;

      // Handle owner flag change first (it clears workspace array when promoting)
      if (ownerChanged) {
        /* eslint-disable @typescript-eslint/no-explicit-any -- generic string to Id<> bridge */
        await setOwnerMutation({
          organizationId: organizationId as any,
          membershipId: member._id as any,
          isOwner,
        });
        /* eslint-enable @typescript-eslint/no-explicit-any */
      }

      // Only update workspaces if NOT owner (owners bypass workspace restrictions)
      if (!isOwner && !ownerChanged) {
        const currentWorkspaces = new Set(member.workspaces ?? []);
        const newWorkspaces = new Set(selected);

        const toGrant = selected.filter((id) => !currentWorkspaces.has(id));
        const toRevoke = (member.workspaces ?? []).filter(
          (id) => !newWorkspaces.has(id)
        );

        if (toGrant.length > 0) {
          /* eslint-disable @typescript-eslint/no-explicit-any -- generic string to Id<> bridge */
          await grantAccess({
            organizationId: organizationId as any,
            membershipId: member._id as any,
            workspaceIds: toGrant,
          });
          /* eslint-enable @typescript-eslint/no-explicit-any */
        }

        if (toRevoke.length > 0) {
          /* eslint-disable @typescript-eslint/no-explicit-any -- generic string to Id<> bridge */
          await revokeAccess({
            organizationId: organizationId as any,
            membershipId: member._id as any,
            workspaceIds: toRevoke,
          });
          /* eslint-enable @typescript-eslint/no-explicit-any */
        }
      }

      toast.success(t("success", { name: member.userName }));
      setOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("error");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    member,
    isOwner,
    selected,
    organizationId,
    grantAccess,
    revokeAccess,
    setOwnerMutation,
    t,
  ]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description", { name: member.userName })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Owner toggle -- only visible to other owners */}
          {isCurrentUserOwner && (
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="grid gap-0.5">
                <Label className="text-body font-medium">
                  {t("ownerLabel")}
                </Label>
                <span className="text-caption text-muted-foreground">
                  {t("ownerDescription")}
                </span>
              </div>
              <Switch
                checked={isOwner}
                onCheckedChange={setIsOwner}
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Owner badge info */}
          {isOwner && (
            <div className="flex items-center gap-2 rounded-md bg-amber-50 p-3 dark:bg-amber-900/20">
              <Badge
                variant="secondary"
                className="border-0 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              >
                {t("ownerBadge")}
              </Badge>
              <span className="text-caption text-muted-foreground">
                {t("ownerAccessNote")}
              </span>
            </div>
          )}

          {/* Workspace picker */}
          <div className="grid gap-2">
            <Label className="text-body font-medium">
              {t("workspacesLabel")}
            </Label>
            <WorkspaceAccessEditor
              selected={isOwner ? [...ALL_WORKSPACE_IDS] : selected}
              onChange={setSelected}
              disabled={isOwner || isSubmitting}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            {tCommon("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? tCommon("saving") : tCommon("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
