"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { UserPlus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../primitives/select";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";
import { Label } from "../../primitives/label";
import { WorkspaceAccessEditor } from "./WorkspaceAccessEditor";
// TODO: Replace with prop-based API
// import { useInviteMember } from "@/features/organizations/hooks/useMemberships";
// TODO: Replace with prop-based API
// import { useGrantWorkspaceAccess } from "@/features/organizations/hooks/useWorkspaces";
// TODO: Replace with prop-based API
// import { ALL_WORKSPACE_IDS } from "@/features/organizations/domain/workspaces";
// TODO: Replace with prop-based API
// import type { MembershipRole } from "@/features/organizations/types/memberships";

/** Props for {@link InviteMemberDialog}. */
interface InviteMemberDialogProps {
  organizationId: string;
}

/** Role key mapping for translation lookup. */
const ROLE_KEYS = [
  { value: "admin", key: "admin" },
  { value: "hiring_manager", key: "hiringManager" },
  { value: "interviewer", key: "interviewer" },
  { value: "viewer", key: "viewer" },
] as const;

/** Basic email format check -- presence of @ symbol. */
function isValidEmail(email: string): boolean {
  return email.includes("@") && email.length > 2;
}

/**
 * Dialog for inviting a new member to the organization.
 * Contains email input, role selector, workspace selection, and submit/cancel buttons.
 * Admin-only -- parent component controls visibility.
 */
export function InviteMemberDialog({ organizationId }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MembershipRole>("viewer");
  const [workspaces, setWorkspaces] = useState<string[]>([...ALL_WORKSPACE_IDS]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inviteMember = useInviteMember();
  const grantAccess = useGrantWorkspaceAccess();
  const t = useTranslations("settings.members.invite");
  const tRoles = useTranslations("roles");
  const tErrors = useTranslations("errors");
  const tCommon = useTranslations("common");

  const resetForm = useCallback(() => {
    setEmail("");
    setRole("viewer");
    setWorkspaces([...ALL_WORKSPACE_IDS]);
    setError(null);
    setIsSubmitting(false);
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) resetForm();
    },
    [resetForm]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        setError(tErrors("emailRequired"));
        return;
      }
      if (!isValidEmail(trimmedEmail)) {
        setError(tErrors("emailInvalid"));
        return;
      }

      setIsSubmitting(true);
      try {
        /* eslint-disable @typescript-eslint/no-explicit-any -- generic string to Id<> bridge */
        const membershipId = await inviteMember({
          organizationId: organizationId as any,
          email: trimmedEmail,
          role,
        });

        // Grant workspace access if not giving all workspaces
        if (workspaces.length > 0 && workspaces.length < ALL_WORKSPACE_IDS.length) {
          await grantAccess({
            organizationId: organizationId as any,
            membershipId: membershipId as any,
            workspaceIds: workspaces,
          });
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */

        toast.success(t("success", { email: trimmedEmail }));
        setOpen(false);
        resetForm();
      } catch (err) {
        const message = err instanceof Error ? err.message : t("error");
        setError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, role, workspaces, organizationId, inviteMember, grantAccess, resetForm, t, tErrors]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          {t("button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>
              {t("description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="invite-email">{t("emailLabel")}</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invite-role">{t("roleLabel")}</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as MembershipRole)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="invite-role">
                  <SelectValue placeholder={t("rolePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_KEYS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {tRoles(opt.key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{t("workspacesLabel")}</Label>
              <WorkspaceAccessEditor
                selected={workspaces}
                onChange={setWorkspaces}
                disabled={isSubmitting}
              />
            </div>
            {error && (
              <p className="text-body text-destructive">{error}</p>
            )}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? tCommon("sending") : t("sendButton")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
