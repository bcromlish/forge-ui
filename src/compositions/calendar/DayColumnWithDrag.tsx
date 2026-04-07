/**
 * Day column with drag-to-create overlay for week/day calendar views.
 * Renders grid lines, events, availability blocks, and the drag preview.
 *
 * @see hooks/useCalendarDrag.ts for drag state machine
 * @see lib/domain/calendar-drag.ts for pixel-to-time math
 */
"use client";

import { cn } from "../../lib/utils";
// TODO: Replace with prop-based API
// import type { CalendarEvent } from "@/types/calendarEvents";
import {
  computeEventPosition,
  detectOverlappingEvents,
// TODO: Replace with prop-based API
// } from "@/lib/domain/calendar-grid";
// TODO: Replace with prop-based API
// import { isToday } from "@/lib/domain/calendar-format";
// TODO: Replace with prop-based API
// import { formatDragTimeRange } from "@/lib/domain/calendar-drag";
import {
  useCalendarDrag,
  type DragSelection,
// TODO: Replace with prop-based API
// } from "@/hooks/useCalendarDrag";
import { CalendarEventBlock } from "./CalendarEventBlock";

/** Props for {@link DayColumnWithDrag}. */
interface DayColumnWithDragProps {
  day: Date;
  dayStartMs: number;
  dayEvents: CalendarEvent[];
  startHour: number;
  pixelsPerHour: number;
  timeSlots: { hour: number; minute: number }[];
  onEventClick?: (event: CalendarEvent) => void;
  onDragComplete?: (selection: DragSelection) => void;
  /** Renders the current time indicator when true. */
  showCurrentTime?: boolean;
  /** Component to render for the current time indicator. */
  currentTimeIndicator?: React.ReactNode;
  /** User lookup for avatar rendering in event blocks. */
  userMap?: Map<string, { _id: string; name: string; avatarUrl?: string }>;
}

/**
 * A single day column with drag-to-create interaction.
 * The overlay div captures mouse events; grid lines are non-interactive.
 */
export function DayColumnWithDrag({
  day,
  dayStartMs,
  dayEvents,
  startHour,
  pixelsPerHour,
  timeSlots,
  onEventClick,
  onDragComplete,
  currentTimeIndicator,
  userMap,
}: DayColumnWithDragProps) {
  const { isDragging, preview, handleMouseDown } = useCalendarDrag({
    dayStartMs,
    startHour,
    pixelsPerHour,
    dayDate: day,
    onDragComplete,
  });

  const interviews = dayEvents.filter((e) => e.type === "interview");
  const meetings = dayEvents.filter((e) => e.type === "meeting");
  const availability = dayEvents.filter((e) => e.type === "availability");
  // Overlap detection applies to interviews and meetings together
  const foregroundEvents = [...interviews, ...meetings];
  const positioned = detectOverlappingEvents(foregroundEvents);

  return (
    <div
      className={cn(
        "relative border-r last:border-r-0",
        isToday(day) && "bg-blue-50/50 dark:bg-blue-950/20"
      )}
    >
      {/* Grid lines — non-interactive, purely visual */}
      {timeSlots.map((slot, slotIdx) => {
        const top =
          (slot.hour - startHour + slot.minute / 60) * pixelsPerHour;
        const isHourLine = slot.minute === 0;
        return (
          <div
            key={slotIdx}
            className={cn(
              "absolute left-0 right-0",
              isHourLine
                ? "border-t border-border"
                : "border-t border-border/30"
            )}
            style={{ top }}
          />
        );
      })}

      {/* Drag overlay — captures mouse events */}
      <div
        className="absolute inset-0 z-0 cursor-crosshair"
        onMouseDown={handleMouseDown}
      />

      {/* Availability blocks (background layer) */}
      {availability.map((event) => {
        const pos = computeEventPosition(
          event.startTime,
          event.endTime,
          dayStartMs,
          startHour,
          pixelsPerHour
        );
        return (
          <div
            key={event.id}
            className="absolute left-0 right-0 z-[1] px-0.5"
            style={{ top: pos.top, height: pos.height }}
          >
            <CalendarEventBlock
              event={event}
              height={pos.height}
              onClick={onEventClick}
              userMap={userMap}
            />
          </div>
        );
      })}

      {/* Interview + meeting events (foreground layer) */}
      {positioned.map(({ event, position }) => {
        const pos = computeEventPosition(
          event.startTime,
          event.endTime,
          dayStartMs,
          startHour,
          pixelsPerHour
        );
        return (
          <div
            key={event.id}
            className="absolute z-[2] px-0.5"
            style={{
              top: pos.top,
              height: pos.height,
              left: `${position.left}%`,
              width: `${position.width}%`,
            }}
          >
            <CalendarEventBlock
              event={event}
              height={pos.height}
              onClick={onEventClick}
              userMap={userMap}
            />
          </div>
        );
      })}

      {/* Drag preview */}
      {isDragging && preview && (
        <div
          className="absolute left-1 right-1 z-[4] rounded-sm border border-primary/40 bg-primary/20 pointer-events-none flex items-start px-1.5 py-0.5"
          style={{ top: preview.top, height: preview.height }}
        >
          <span className="text-signal-2 font-medium text-primary">
            {formatDragTimeRange(preview.startTime, preview.endTime)}
          </span>
        </div>
      )}

      {/* Current time indicator */}
      {currentTimeIndicator}
    </div>
  );
}
