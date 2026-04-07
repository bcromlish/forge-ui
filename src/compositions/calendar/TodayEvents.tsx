"use client";

import { Calendar, Clock, Users } from "lucide-react";
import { cn } from "../../lib/utils";
// TODO: Replace with prop-based API
// import type { CalendarEvent } from "@/types/calendarEvents";
// import {
//   computeDayBoundaries,
//   filterEventsByDay,
//   sortEventsByTime,
// TODO: Replace with prop-based API
// } from "@/lib/domain/calendar-grid";
// TODO: Replace with prop-based API
// import { formatTime } from "@/lib/domain/calendar-format";
// TODO: Replace with prop-based API
// import { getEventColor } from "@/lib/domain/calendar-events";
import { StatusBadge } from "../../patterns/status-badge";
import type { StatusBadgeStatus } from "../../patterns/status-badge";

/** Props for {@link TodayEvents}. */
interface TodayEventsProps {
  events: CalendarEvent[];
  /** Current time in epoch ms — caller provides to keep render pure. */
  now: number;
  onEventClick?: (event: CalendarEvent) => void;
}

/**
 * Compact list of today's interviews and meetings sorted by time.
 * Availability is excluded — it's a time window, not an event.
 * Displayed in the calendar sidebar.
 */
export function TodayEvents({ events, now, onEventClick }: TodayEventsProps) {
  const today = new Date(now);
  const { start, end } = computeDayBoundaries(today);
  const todayEvents = sortEventsByTime(
    filterEventsByDay(events, start, end).filter((e) => e.type !== "availability")
  );

  if (todayEvents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 py-4 text-center">
        <Clock className="h-4 w-4 text-muted-foreground/40" />
        <p className="text-caption text-muted-foreground">No events today</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {todayEvents.map((event) => {
        const colors = getEventColor(event.type, event.interview?.status);
        const isPast = event.endTime < now;
        const icon = event.type === "meeting"
          ? <Calendar className="h-3 w-3 shrink-0 text-fuchsia-600" />
          : <Users className="h-3 w-3 shrink-0 text-indigo-500" />;

        return (
          <button
            key={event.id}
            onClick={() => onEventClick?.(event)}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted/50 transition-colors",
              isPast && "opacity-50"
            )}
          >
            <div className={cn("w-1 self-stretch rounded-full", colors.border.replace("border-", "bg-"))} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                {icon}
                <p className="text-caption font-medium truncate">{event.title}</p>
              </div>
              <p className="text-caption text-muted-foreground">
                {formatTime(event.startTime)} – {formatTime(event.endTime)}
              </p>
            </div>
            {event.interview?.status && (
              <StatusBadge
                status={event.interview.status as StatusBadgeStatus}
                className="text-caption px-1.5 py-0"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
