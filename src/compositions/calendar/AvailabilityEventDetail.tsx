/**
 * Availability-specific detail panel content for CalendarEventDetail.
 * Shows duration, timezone, user, and recurrence info.
 */
"use client";

import { Clock, ExternalLink, Users, CalendarClock } from "lucide-react";
import type { CalendarEvent } from "../../types/calendar";
import { formatDuration } from "./calendar-event-helpers";
import { MetaItem, DetailRow } from "./calendar-event-parts";

/** Availability detail content -- renders inside CalendarEventDetail body. */
export function AvailabilityEventDetail({ event }: { event: CalendarEvent }) {
  const info = event.availability!;
  const durationMin = Math.round((event.endTime - event.startTime) / 60000);

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <MetaItem icon={<Clock className="h-4 w-4" />}>
          {formatDuration(durationMin)}
        </MetaItem>
        <MetaItem icon={<ExternalLink className="h-4 w-4" />}>
          {info.timezone}
        </MetaItem>
      </div>

      {info.userName && (
        <DetailRow icon={<Users className="h-4 w-4" />} label="User">
          {info.userName}
        </DetailRow>
      )}
      <DetailRow icon={<CalendarClock className="h-4 w-4" />} label="Recurrence">
        {info.recurrenceType === "none"
          ? "One-time"
          : info.recurrenceType.charAt(0).toUpperCase() +
            info.recurrenceType.slice(1)}
        {info.isExpanded && " (expanded occurrence)"}
      </DetailRow>
    </>
  );
}
