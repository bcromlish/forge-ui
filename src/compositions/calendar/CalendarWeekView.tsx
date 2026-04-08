"use client";

import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import type { CalendarEvent, DragSelection } from "../../types/calendar";
import {
  generateTimeSlots,
  computeDayBoundaries,
  filterEventsByDay,
  getWeekDays,
  isToday,
} from "../../types/calendar-utils";
import { DayColumnWithDrag } from "./DayColumnWithDrag";

const DEFAULT_START_HOUR = 0;
const DEFAULT_END_HOUR = 24;
const PIXELS_PER_HOUR = 60;
const SLOT_INTERVAL = 30;

/** Props for {@link CalendarWeekView}. */
interface CalendarWeekViewProps {
  events: CalendarEvent[];
  weekStart: Date;
  startHour?: number;
  endHour?: number;
  onEventClick?: (event: CalendarEvent) => void;
  onTimeSlotClick?: (date: Date, hour: number) => void;
  onDragComplete?: (selection: DragSelection) => void;
  highlightedUserIds?: string[];
  userMap?: Map<string, { _id: string; name: string; avatarUrl?: string }>;
}

function DayHeader({ date, eventCount }: { date: Date; eventCount: number }) {
  const today = isToday(date);
  const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
  const dateNum = date.getDate();

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0.5 py-2 border-b text-body",
        today && "bg-blue-50/50 dark:bg-blue-950/20"
      )}
    >
      <span className="text-caption text-muted-foreground">{dayLabel}</span>
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-body font-medium",
          today && "bg-primary text-primary-foreground"
        )}
      >
        {dateNum}
      </span>
      {eventCount > 0 && (
        <span className="text-caption text-muted-foreground">
          {eventCount} event{eventCount !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}

export function CalendarWeekView({
  events,
  weekStart,
  startHour = DEFAULT_START_HOUR,
  endHour = DEFAULT_END_HOUR,
  onEventClick,
  onDragComplete,
  userMap,
}: CalendarWeekViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const days = getWeekDays(weekStart);
  const timeSlots = generateTimeSlots(startHour, endHour, SLOT_INTERVAL);
  const totalHours = endHour - startHour;
  const gridHeight = totalHours * PIXELS_PER_HOUR;

  useEffect(() => {
    if (scrollRef.current) {
      const defaultVisibleHour = 6;
      const offset = (defaultVisibleHour - startHour) * PIXELS_PER_HOUR;
      scrollRef.current.scrollTop = Math.max(0, offset);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col flex-1 overflow-hidden rounded-lg border bg-white dark:bg-gray-950">
      <div
        className="grid border-b"
        style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}
      >
        <div className="border-r" />
        {days.map((day, i) => {
          const { start, end } = computeDayBoundaries(day);
          const dayEvents = filterEventsByDay(events, start, end).filter(
            (e) => e.type !== "availability"
          );
          return (
            <div key={i} className={cn("border-r last:border-r-0", isToday(day) && "bg-blue-50/50 dark:bg-blue-950/20")}>
              <DayHeader date={day} eventCount={dayEvents.length} />
            </div>
          );
        })}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: "60px repeat(7, 1fr)",
            height: gridHeight,
          }}
        >
          <div className="border-r relative">
            {timeSlots
              .filter((_, i) => i % (60 / SLOT_INTERVAL) === 0)
              .map((slot) => {
                const top = (slot.hour - startHour) * PIXELS_PER_HOUR;
                return (
                  <div
                    key={`${slot.hour}-${slot.minute}`}
                    className="absolute right-2 text-caption text-muted-foreground -translate-y-1/2"
                    style={{ top }}
                  >
                    {slot.label}
                  </div>
                );
              })}
          </div>

          {days.map((day, dayIdx) => {
            const { start: dayStart, end: dayEnd } = computeDayBoundaries(day);
            const dayEvents = filterEventsByDay(events, dayStart, dayEnd);

            return (
              <DayColumnWithDrag
                key={dayIdx}
                day={day}
                dayStartMs={dayStart}
                dayEvents={dayEvents}
                startHour={startHour}
                pixelsPerHour={PIXELS_PER_HOUR}
                timeSlots={timeSlots}
                onEventClick={onEventClick}
                onDragComplete={onDragComplete}
                userMap={userMap}
                currentTimeIndicator={
                  isToday(day) ? (
                    <CurrentTimeIndicator startHour={startHour} pixelsPerHour={PIXELS_PER_HOUR} />
                  ) : undefined
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CurrentTimeIndicator({
  startHour,
  pixelsPerHour,
}: {
  startHour: number;
  pixelsPerHour: number;
}) {
  const now = new Date();
  const hours = now.getHours() + now.getMinutes() / 60;
  const top = (hours - startHour) * pixelsPerHour;
  if (top < 0) return null;
  return (
    <div className="absolute left-0 right-0 z-[3] pointer-events-none" style={{ top }}>
      <div className="flex items-center">
        <div className="h-3 w-3 rounded-full bg-red-500 -ml-1" />
        <div className="flex-1 h-px bg-red-500" />
      </div>
    </div>
  );
}
