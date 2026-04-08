"use client";

import { useState, useCallback } from "react";
import { UserPlus } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "../../primitives/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../primitives/select";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";
import { Label } from "../../primitives/label";
import { WorkspaceAccessEditor } from "./WorkspaceAccessEditor";
import type { MembershipRole } from "../../types/domain";

const ROLE_OPTIONS: { value: MembershipRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "hiring_manager", label: "Hiring Manager" },
  { value: "interviewer", label: "Interviewer" },
  { value: "viewer", label: "Viewer" },
];

function isValidEmail(email: string): boolean { return email.includes("@") && email.length > 2; }

interface InviteMemberDialogProps {
  organizationId: string;
  /** All available workspace IDs. */
  allWorkspaceIds: string[];
  /** Invite handler. */
  onInvite: (data: { email: string; role: MembershipRole; workspaces: string[] }) => Promise<void>;
  /** Optional role labels for i18n override. */
  roleLabels?: Record<string, string>;
  /** Workspace data for the editor. */
  workspaces?: { id: string; label: string; iconName: string }[];
  /** Labels for i18n. */
  labels?: {
    button?: string; title?: string; description?: string; emailLabel?: string;
    emailPlaceholder?: string; roleLabel?: string; rolePlaceholder?: string;
    workspacesLabel?: string; cancel?: string; send?: string; sending?: string;
    emailRequired?: string; emailInvalid?: string;
  };
}

export function InviteMemberDialog({
  allWorkspaceIds, onInvite, roleLabels, workspaces = [], labels = {},
}: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MembershipRole>("viewer");
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([...allWorkspaceIds]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => { setEmail(""); setRole("viewer"); setSelectedWorkspaces([...allWorkspaceIds]); setError(null); setIsSubmitting(false); }, [allWorkspaceIds]);
  const handleOpenChange = useCallback((nextOpen: boolean) => { setOpen(nextOpen); if (!nextOpen) resetForm(); }, [resetForm]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) { setError(labels.emailRequired ?? "Email is required."); return; }
    if (!isValidEmail(trimmedEmail)) { setError(labels.emailInvalid ?? "Invalid email address."); return; }
    setIsSubmitting(true);
    try {
      await onInvite({ email: trimmedEmail, role, workspaces: selectedWorkspaces });
      setOpen(false); resetForm();
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to invite member."); } finally { setIsSubmitting(false); }
  }, [email, role, selectedWorkspaces, onInvite, resetForm, labels]);

  const resolvedRoleLabels = roleLabels ?? Object.fromEntries(ROLE_OPTIONS.map((r) => [r.value, r.label]));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild><Button size="sm"><UserPlus className="mr-2 h-4 w-4" />{labels.button ?? "Invite Member"}</Button></DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{labels.title ?? "Invite Member"}</DialogTitle>
            <DialogDescription>{labels.description ?? "Add a new member to your organization."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="invite-email">{labels.emailLabel ?? "Email"}</Label>
              <Input id="invite-email" type="email" placeholder={labels.emailPlaceholder ?? "name@example.com"} value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }} disabled={isSubmitting} autoFocus />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invite-role">{labels.roleLabel ?? "Role"}</Label>
              <Select value={role} onValueChange={(v) => setRole(v as MembershipRole)} disabled={isSubmitting}>
                <SelectTrigger id="invite-role"><SelectValue placeholder={labels.rolePlaceholder ?? "Select role"} /></SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{resolvedRoleLabels[opt.value] ?? opt.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{labels.workspacesLabel ?? "Workspaces"}</Label>
              <WorkspaceAccessEditor selected={selectedWorkspaces} onChange={setSelectedWorkspaces} disabled={isSubmitting} workspaces={workspaces} />
            </div>
            {error && <p className="text-body text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>{labels.cancel ?? "Cancel"}</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? (labels.sending ?? "Sending...") : (labels.send ?? "Send Invite")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
