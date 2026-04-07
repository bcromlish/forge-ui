"use client";

import { cn } from "../../lib/utils";
// TODO: Replace with prop-based API
// import type { CalendarEvent } from "@/types/calendarEvents";
// import {
//   getMonthGridDays,
//   computeDayBoundaries,
//   filterEventsByDay,
// TODO: Replace with prop-based API
// } from "@/lib/domain/calendar-grid";
// TODO: Replace with prop-based API
// import { isToday, isSameDay, formatTime } from "@/lib/domain/calendar-format";
// TODO: Replace with prop-based API
// import { getEventColor } from "@/lib/domain/calendar-events";

const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_VISIBLE_EVENTS = 3;

/** Props for {@link CalendarMonthView}. */
interface CalendarMonthViewProps {
  month: Date;
  events: CalendarEvent[];
  onDayClick?: (date: Date) => void;
  selectedDate?: Date;
}

/**
 * Month overview — shows event indicators per day.
 * Click a day to navigate to day view.
 */
export function CalendarMonthView({
  month,
  events,
  onDayClick,
  selectedDate,
}: CalendarMonthViewProps) {
  const gridDays = getMonthGridDays(month);
  const currentMonth = month.getMonth();

  return (
    <div className="flex flex-col flex-1 overflow-hidden rounded-lg border bg-white dark:bg-gray-950">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b">
        {WEEKDAY_HEADERS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-caption font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 flex-1">
        {gridDays.map((day, idx) => {
          const { start, end } = computeDayBoundaries(day);
          const dayEvents = filterEventsByDay(events, start, end);
          const visibleEvents = dayEvents.filter((e) => e.type !== "availability");
          const isCurrentMonth = day.getMonth() === currentMonth;
          const today = isToday(day);
          const selected = selectedDate ? isSameDay(day, selectedDate) : false;

          return (
            <button
              key={idx}
              onClick={() => onDayClick?.(day)}
              className={cn(
                "min-h-24 border-b border-r p-1 text-left transition-colors hover:bg-muted/30",
                !isCurrentMonth && "bg-muted/10 text-muted-foreground/50",
                selected && "ring-2 ring-primary ring-inset"
              )}
            >
              {/* Date number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-caption",
                    today && "bg-primary text-primary-foreground font-semibold",
                    !today && isCurrentMonth && "font-medium"
                  )}
                >
                  {day.getDate()}
                </span>
                {visibleEvents.length > 0 && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                )}
              </div>

              {/* Event previews */}
              <div className="flex flex-col gap-0.5">
                {visibleEvents.slice(0, MAX_VISIBLE_EVENTS).map((event) => {
                  const colors = getEventColor(event.type, event.interview?.status);
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "truncate rounded-sm px-1 py-0.5 text-caption leading-tight",
                        colors.bg,
                        colors.text
                      )}
                    >
                      {formatTime(event.startTime)} {event.title}
                    </div>
                  );
                })}
                {visibleEvents.length > MAX_VISIBLE_EVENTS && (
                  <p className="text-caption text-muted-foreground pl-1">
                    +{visibleEvents.length - MAX_VISIBLE_EVENTS} more
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
