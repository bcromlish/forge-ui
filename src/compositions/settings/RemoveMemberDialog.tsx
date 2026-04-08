"use client";

import { useState, useCallback } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../../primitives/alert-dialog";

interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  membershipId: string;
  memberName: string;
  /** Confirm handler. Consumer handles the actual mutation. */
  onConfirm: () => Promise<void>;
  /** Labels for i18n. */
  labels?: { title?: string; description?: string; cancel?: string; remove?: string; removing?: string };
}

export function RemoveMemberDialog({
  open, onOpenChange, memberName, onConfirm, labels = {},
}: RemoveMemberDialogProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleConfirm = useCallback(async () => {
    setIsRemoving(true);
    try { await onConfirm(); onOpenChange(false); } catch { /* consumer handles */ } finally { setIsRemoving(false); }
  }, [onConfirm, onOpenChange]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{labels.title ?? "Remove Member"}</AlertDialogTitle>
          <AlertDialogDescription>{labels.description ?? `Are you sure you want to remove ${memberName} from the organization?`}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving}>{labels.cancel ?? "Cancel"}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isRemoving} className="bg-destructive text-white hover:bg-destructive/90">
            {isRemoving ? (labels.removing ?? "Removing...") : (labels.remove ?? "Remove")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
