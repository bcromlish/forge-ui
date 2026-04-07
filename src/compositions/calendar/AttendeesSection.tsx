/**
 * Attendees section with RSVP summary badge and per-person list.
 * RSVP control is now in RsvpWell — this component focuses on the attendee list.
 */
"use client";

import { Check, Circle, X, HelpCircle } from "lucide-react";
import { Badge } from "../../primitives/badge";
import { Avatar, AvatarFallback } from "../../primitives/avatar";
import { cn } from "../../lib/utils";
import { getInitials } from "./calendar-event-helpers";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RSVP_ICON: Record<string, React.ReactNode> = {
  accepted: <Check className="h-4 w-4 text-emerald-600" />,
  declined: <X className="h-4 w-4 text-red-500" />,
  tentative: <HelpCircle className="h-4 w-4 text-amber-500" />,
  pending: <Circle className="h-4 w-4 text-muted-foreground" />,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Compute a short RSVP summary for the attendees heading badge. */
function getRsvpSummary(attendees: Array<{ rsvpStatus: string }>): {
  label: string;
  className: string;
} {
  const declined = attendees.filter((a) => a.rsvpStatus === "declined").length;
  if (declined > 0) {
    return {
      label: `${declined} Declined`,
      className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    };
  }
  const pending = attendees.filter((a) => a.rsvpStatus === "pending").length;
  if (pending > 0) {
    return {
      label: `${pending} Pending`,
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    };
  }
  return {
    label: "All Accepted",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/** Attendees section with RSVP summary badge and per-person list. */
export function AttendeesSection({
  attendees,
  userNames,
  guestEmailCount,
}: {
  eventId: string;
  attendees: Array<{ userId: string; rsvpStatus: string; role?: string }>;
  userNames?: Map<string, string>;
  currentUserId?: string;
  onRsvpChange?: (eventId: string, status: string) => void;
  guestEmailCount?: number;
}) {
  const totalCount = attendees.length + (guestEmailCount ?? 0);
  const summary = getRsvpSummary(attendees);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-body font-medium">
          Attendees ({totalCount})
        </span>
        <Badge
          variant="secondary"
          className={cn("text-caption font-medium", summary.className)}
        >
          {summary.label}
        </Badge>
      </div>

      {/* Attendee list */}
      <div className="flex flex-col gap-2">
        {attendees.map((attendee) => {
          const name = userNames?.get(attendee.userId) ?? attendee.userId;
          const initials = getInitials(name);
          return (
            <div
              key={attendee.userId}
              className="flex items-center gap-3"
            >
              <Avatar size="sm">
                <AvatarFallback name={name}>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <span className="text-body font-medium truncate block">{name}</span>
                {attendee.role && (
                  <span className="text-caption text-muted-foreground capitalize">
                    {attendee.role}
                  </span>
                )}
              </div>
              <div className="shrink-0">
                {RSVP_ICON[attendee.rsvpStatus] ?? RSVP_ICON.pending}
              </div>
            </div>
          );
        })}
        {guestEmailCount !== undefined && guestEmailCount > 0 && (
          <p className="text-caption text-muted-foreground">
            + {guestEmailCount} external guest{guestEmailCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
