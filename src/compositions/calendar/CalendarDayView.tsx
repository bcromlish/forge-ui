"use client";

import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
// TODO: Replace with prop-based API
// import type { CalendarEvent } from "@/types/calendarEvents";
// TODO: Replace with prop-based API
// import type { DragSelection } from "@/hooks/useCalendarDrag";
// import {
//   generateTimeSlots,
//   computeDayBoundaries,
//   filterEventsByDay,
// TODO: Replace with prop-based API
// } from "@/lib/domain/calendar-grid";
// TODO: Replace with prop-based API
// import { isToday } from "@/lib/domain/calendar-format";
import { DayRowWithDrag } from "./DayRowWithDrag";

const DEFAULT_START_HOUR = 0;
const DEFAULT_END_HOUR = 24;
const PIXELS_PER_HOUR = 80;
const SLOT_INTERVAL = 60;

/** Props for {@link CalendarDayView}. */
interface CalendarDayViewProps {
  date: Date;
  events: CalendarEvent[];
  members?: { _id: string; name: string }[];
  selectedUserIds?: string[];
  startHour?: number;
  endHour?: number;
  onEventClick?: (event: CalendarEvent) => void;
  onTimeSlotClick?: (date: Date, hour: number) => void;
  onDragComplete?: (selection: DragSelection) => void;
  /** User lookup for avatar rendering in event blocks. */
  userMap?: Map<string, { _id: string; name: string; avatarUrl?: string }>;
}

/**
 * Horizontal resource day view — one row per selected user, hours across the top.
 * Events are positioned horizontally by time within each user's row.
 */
export function CalendarDayView({
  date,
  events,
  members = [],
  selectedUserIds = [],
  startHour = DEFAULT_START_HOUR,
  endHour = DEFAULT_END_HOUR,
  onEventClick,
  userMap,
}: CalendarDayViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to 6 AM on mount so the working day is visible by default
  useEffect(() => {
    if (scrollRef.current) {
      const defaultVisibleHour = 6;
      const offset = (defaultVisibleHour - startHour) * PIXELS_PER_HOUR;
      scrollRef.current.scrollLeft = Math.max(0, offset);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const timeSlots = generateTimeSlots(startHour, endHour, SLOT_INTERVAL);
  const totalHours = endHour - startHour;
  const gridWidth = totalHours * PIXELS_PER_HOUR;
  const { start: dayStart, end: dayEnd } = computeDayBoundaries(date);
  const dayEvents = filterEventsByDay(events, dayStart, dayEnd);
  const scheduledEvents = dayEvents.filter((e) => e.type !== "availability");
  const today = isToday(date);

  // Resolve selected user names from member list
  const displayUsers = selectedUserIds
    .map((id) => {
      const member = members.find((m) => m._id === id);
      return member ? { _id: id, name: member.name } : null;
    })
    .filter((u): u is { _id: string; name: string } => u !== null);

  return (
    <div className="flex flex-col flex-1 overflow-hidden rounded-lg border bg-white dark:bg-gray-950">
      {/* Day header */}
      <div className={cn("border-b px-4 py-3", today && "bg-blue-50/50 dark:bg-blue-950/20")}>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-title-3",
              today && "bg-primary text-primary-foreground"
            )}
          >
            {date.getDate()}
          </span>
          <div>
            <p className="text-body font-medium">
              {date.toLocaleDateString("en-US", { weekday: "long" })}
            </p>
            <p className="text-caption text-muted-foreground">
              {scheduledEvents.length} event{scheduledEvents.length !== 1 ? "s" : ""}
              {displayUsers.length > 0 && ` \u00B7 ${displayUsers.length} member${displayUsers.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable resource grid */}
      <div ref={scrollRef} className="flex-1 overflow-auto">
        <div style={{ minWidth: gridWidth + 128 }}>
          {/* Time header row */}
          <div className="flex border-b sticky top-0 bg-white dark:bg-gray-950 z-[3]">
            <div className="w-32 shrink-0 border-r sticky left-0 z-[4] bg-white dark:bg-gray-950" />
            <div className="flex-1 relative" style={{ width: gridWidth }}>
              {timeSlots.map((slot) => {
                const left = (slot.hour - startHour) * PIXELS_PER_HOUR;
                return (
                  <div
                    key={slot.hour}
                    className="absolute text-caption text-muted-foreground py-1"
                    style={{ left, width: PIXELS_PER_HOUR }}
                  >
                    <span className="pl-1">{slot.label}</span>
                  </div>
                );
              })}
              <div style={{ height: 28 }} />
            </div>
          </div>

          {/* User rows */}
          {displayUsers.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-caption text-muted-foreground">
              No team members selected
            </div>
          ) : (
            displayUsers.map((user, idx) => (
              <DayRowWithDrag
                key={user._id}
                userId={user._id}
                userName={user.name}
                events={events}
                dayStartMs={dayStart}
                dayEndMs={dayEnd}
                startHour={startHour}
                pixelsPerHour={PIXELS_PER_HOUR}
                timeSlots={timeSlots}
                onEventClick={onEventClick}
                isLast={idx === displayUsers.length - 1}
                userMap={userMap}
              />
            ))
          )}
        </div>
      </div>

      {/* Current time indicator for today */}
      {today && <CurrentTimeBar startHour={startHour} pixelsPerHour={PIXELS_PER_HOUR} gutterWidth={128} />}
    </div>
  );
}

/** Vertical red line showing current time across all rows. */
function CurrentTimeBar({
  startHour,
  pixelsPerHour,
  gutterWidth,
}: {
  startHour: number;
  pixelsPerHour: number;
  gutterWidth: number;
}) {
  const now = new Date();
  const hours = now.getHours() + now.getMinutes() / 60;
  const left = gutterWidth + (hours - startHour) * pixelsPerHour;

  if (left < gutterWidth) return null;

  return (
    <div
      className="absolute top-0 bottom-0 z-[3] pointer-events-none w-px bg-red-500"
      style={{ left }}
    />
  );
}
