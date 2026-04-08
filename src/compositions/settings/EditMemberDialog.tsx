"use client";

import { useState, useCallback, useEffect } from "react";
import { Settings } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "../../primitives/dialog";
import { Button } from "../../primitives/button";
import { Label } from "../../primitives/label";
import { Switch } from "../../primitives/switch";
import { Badge } from "../../primitives/badge";
import { WorkspaceAccessEditor } from "./WorkspaceAccessEditor";

interface EditMemberInfo {
  _id: string;
  userName: string;
  userEmail: string;
  isOwner?: boolean;
  workspaces?: string[];
}

interface EditMemberDialogProps {
  member: EditMemberInfo;
  organizationId: string;
  isCurrentUserOwner: boolean;
  /** All available workspace IDs. */
  allWorkspaceIds: string[];
  /** Save handler -- receives updated workspace list and owner flag. */
  onSave: (data: { membershipId: string; isOwner: boolean; workspaces: string[] }) => Promise<void>;
  /** Labels for i18n. */
  labels?: {
    title?: string; description?: string; ownerLabel?: string; ownerDescription?: string;
    ownerBadge?: string; ownerAccessNote?: string; workspacesLabel?: string;
    success?: string; error?: string; cancel?: string; save?: string; saving?: string;
  };
  /** Workspace data for the workspace editor. */
  workspaces?: { id: string; label: string; iconName: string }[];
}

export function EditMemberDialog({
  member, organizationId, isCurrentUserOwner, allWorkspaceIds, onSave,
  labels = {}, workspaces = [],
}: EditMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSelected(member.workspaces ?? [...allWorkspaceIds]);
      setIsOwner(member.isOwner ?? false);
    }
  }, [open, member.workspaces, member.isOwner, allWorkspaceIds]);

  const handleOpenChange = useCallback((nextOpen: boolean) => { setOpen(nextOpen); if (!nextOpen) setIsSubmitting(false); }, []);

  const handleSave = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await onSave({ membershipId: member._id, isOwner, workspaces: isOwner ? [...allWorkspaceIds] : selected });
      setOpen(false);
    } catch {
      // Error handling delegated to consumer via onSave rejection
    } finally { setIsSubmitting(false); }
  }, [member._id, isOwner, selected, allWorkspaceIds, onSave]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Settings className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{labels.title ?? "Edit Member"}</DialogTitle>
          <DialogDescription>{labels.description ?? `Update access for ${member.userName}.`}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isCurrentUserOwner && (
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="grid gap-0.5">
                <Label className="text-body font-medium">{labels.ownerLabel ?? "Account Owner"}</Label>
                <span className="text-caption text-muted-foreground">{labels.ownerDescription ?? "Owners have full access to all workspaces."}</span>
              </div>
              <Switch checked={isOwner} onCheckedChange={setIsOwner} disabled={isSubmitting} />
            </div>
          )}
          {isOwner && (
            <div className="flex items-center gap-2 rounded-md bg-amber-50 p-3 dark:bg-amber-900/20">
              <Badge variant="secondary" className="border-0 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                {labels.ownerBadge ?? "Owner"}
              </Badge>
              <span className="text-caption text-muted-foreground">{labels.ownerAccessNote ?? "Owners automatically have access to all workspaces."}</span>
            </div>
          )}
          <div className="grid gap-2">
            <Label className="text-body font-medium">{labels.workspacesLabel ?? "Workspaces"}</Label>
            <WorkspaceAccessEditor
              selected={isOwner ? [...allWorkspaceIds] : selected}
              onChange={setSelected}
              disabled={isOwner || isSubmitting}
              workspaces={workspaces}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>{labels.cancel ?? "Cancel"}</Button>
          <Button onClick={handleSave} disabled={isSubmitting}>{isSubmitting ? (labels.saving ?? "Saving...") : (labels.save ?? "Save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
