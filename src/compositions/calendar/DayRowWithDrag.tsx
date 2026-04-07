"use client";

import { cn } from "../../lib/utils";
// TODO: Replace with prop-based API
// import type { CalendarEvent } from "@/types/calendarEvents";
// import {
//   computeHorizontalEventPosition,
//   filterEventsByDay,
// TODO: Replace with prop-based API
// } from "@/lib/domain/calendar-grid";
import { CalendarEventBlock } from "./CalendarEventBlock";

/** Row height in pixels for each user in horizontal day view. */
export const ROW_HEIGHT = 64;

/** Props for {@link DayRowWithDrag}. */
interface DayRowWithDragProps {
  userId: string;
  userName: string;
  events: CalendarEvent[];
  dayStartMs: number;
  dayEndMs: number;
  startHour: number;
  pixelsPerHour: number;
  timeSlots: { hour: number; minute: number }[];
  onEventClick?: (event: CalendarEvent) => void;
  isLast?: boolean;
  /** User lookup for avatar rendering in event blocks. */
  userMap?: Map<string, { _id: string; name: string; avatarUrl?: string }>;
}

/**
 * Horizontal event row for a single user in the day resource view.
 * Events are positioned left/width based on time within the day.
 */
export function DayRowWithDrag({
  userId,
  userName,
  events,
  dayStartMs,
  dayEndMs,
  startHour,
  pixelsPerHour,
  timeSlots,
  onEventClick,
  isLast,
  userMap,
}: DayRowWithDragProps) {
  // Filter events for this user within this day
  const dayEvents = filterEventsByDay(events, dayStartMs, dayEndMs);
  const userEvents = dayEvents.filter((e) =>
    e.userIds.includes(userId)
  );
  const availability = userEvents.filter((e) => e.type === "availability");
  const foreground = userEvents.filter((e) => e.type !== "availability");

  return (
    <div
      className={cn(
        "flex",
        !isLast && "border-b"
      )}
      style={{ height: ROW_HEIGHT }}
    >
      {/* User gutter */}
      <div className="w-32 shrink-0 border-r px-2 flex items-center gap-2 sticky left-0 z-[4] bg-white dark:bg-gray-950">
        <UserAvatar name={userName} />
        <span className="text-caption font-medium truncate">{userName}</span>
      </div>

      {/* Horizontal timeline */}
      <div className="flex-1 relative">
        {/* Hour grid lines */}
        {timeSlots
          .filter((s) => s.minute === 0)
          .map((slot) => {
            const left = (slot.hour - startHour) * pixelsPerHour;
            return (
              <div
                key={slot.hour}
                className="absolute top-0 bottom-0 border-l border-border/30"
                style={{ left }}
              />
            );
          })}

        {/* Availability (background) */}
        {availability.map((event) => {
          const pos = computeHorizontalEventPosition(
            event.startTime, event.endTime, dayStartMs, startHour, pixelsPerHour
          );
          return (
            <div
              key={event.id}
              className="absolute top-0.5 bottom-0.5 z-[1]"
              style={{ left: pos.left, width: pos.width }}
            >
              <CalendarEventBlock
                event={event}
                height={ROW_HEIGHT - 4}
                onClick={onEventClick}
                userMap={userMap}
              />
            </div>
          );
        })}

        {/* Interviews + Meetings (foreground) */}
        {foreground.map((event) => {
          const pos = computeHorizontalEventPosition(
            event.startTime, event.endTime, dayStartMs, startHour, pixelsPerHour
          );
          return (
            <div
              key={event.id}
              className="absolute top-1 bottom-1 z-[2]"
              style={{ left: pos.left, width: pos.width }}
            >
              <CalendarEventBlock
                event={event}
                height={ROW_HEIGHT - 8}
                onClick={onEventClick}
                userMap={userMap}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-signal-2 font-medium">
      {initials}
    </div>
  );
}
