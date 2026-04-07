/**
 * RSVP status control rendered in a well/card container.
 * Shows current status badge and a segmented toggle for changing response.
 */
"use client";

import { Badge } from "../../primitives/badge";
import { cn } from "../../lib/utils";

const RSVP_STATUSES = ["accepted", "tentative", "declined"] as const;

const RSVP_LABEL: Record<string, string> = {
  accepted: "Accepted",
  declined: "Declined",
  tentative: "Tentative",
  pending: "Pending",
};

const RSVP_BADGE_CLASSES: Record<string, string> = {
  accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  declined: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  tentative: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  pending: "bg-muted text-muted-foreground",
};

/** Props for {@link RsvpWell}. */
interface RsvpWellProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

/** RSVP control in a well container — matches reference design. */
export function RsvpWell({ currentStatus, onStatusChange }: RsvpWellProps) {
  return (
    <div className="rounded-lg bg-muted/40 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-body font-medium">RSVP Status</span>
        <Badge
          variant="secondary"
          className={cn(
            "text-caption font-semibold uppercase tracking-wider",
            RSVP_BADGE_CLASSES[currentStatus] ?? RSVP_BADGE_CLASSES.pending
          )}
        >
          {RSVP_LABEL[currentStatus] ?? currentStatus}
        </Badge>
      </div>
      <div className="flex rounded-lg border overflow-hidden">
        {RSVP_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange(status)}
            className={cn(
              "flex-1 px-3 py-1.5 text-caption font-medium transition-colors",
              currentStatus === status
                ? "bg-foreground text-background"
                : "bg-white dark:bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            {RSVP_LABEL[status]}
          </button>
        ))}
      </div>
    </div>
  );
}
