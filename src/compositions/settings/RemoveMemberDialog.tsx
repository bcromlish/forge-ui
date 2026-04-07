"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../primitives/alert-dialog";
// TODO: Replace with prop-based API
// import { useRemoveMember } from "@/features/organizations/hooks/useMemberships";

/** Props for {@link RemoveMemberDialog}. */
interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  membershipId: string;
  memberName: string;
}

/**
 * Confirmation dialog for removing a member from the organization.
 * Calls removeMember mutation on confirm, shows toast on success/error.
 */
export function RemoveMemberDialog({
  open,
  onOpenChange,
  organizationId,
  membershipId,
  memberName,
}: RemoveMemberDialogProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const removeMember = useRemoveMember();
  const t = useTranslations("settings.members.remove");
  const tCommon = useTranslations("common");

  const handleConfirm = useCallback(async () => {
    setIsRemoving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic string to Id<> bridge
      await removeMember({ organizationId: organizationId as any, membershipId: membershipId as any });
      toast.success(t("success", { name: memberName }));
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("error");
      toast.error(message);
    } finally {
      setIsRemoving(false);
    }
  }, [organizationId, membershipId, memberName, removeMember, onOpenChange, t]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("description", { name: memberName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving}>{tCommon("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isRemoving}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isRemoving ? tCommon("removing") : tCommon("remove")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
