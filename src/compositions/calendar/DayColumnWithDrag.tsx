/**
 * Day column with drag-to-create overlay for week/day calendar views.
 * The drag hook must be provided by the consumer application.
 */
"use client";

import { cn } from "../../lib/utils";
import type { CalendarEvent, DragSelection, TimeSlot } from "../../types/calendar";
import {
  computeEventPosition,
  detectOverlappingEvents,
  isToday,
  formatDragTimeRange,
} from "../../types/calendar-utils";
import { CalendarEventBlock } from "./CalendarEventBlock";

/** Props for {@link DayColumnWithDrag}. */
interface DayColumnWithDragProps {
  day: Date;
  dayStartMs: number;
  dayEvents: CalendarEvent[];
  startHour: number;
  pixelsPerHour: number;
  timeSlots: TimeSlot[];
  onEventClick?: (event: CalendarEvent) => void;
  onDragComplete?: (selection: DragSelection) => void;
  currentTimeIndicator?: React.ReactNode;
  userMap?: Map<string, { _id: string; name: string; avatarUrl?: string }>;
  /** Optional drag state -- provided by a consumer drag hook. */
  dragState?: {
    isDragging: boolean;
    preview: { top: number; height: number; startTime: number; endTime: number } | null;
    handleMouseDown: (e: React.MouseEvent) => void;
  };
}

/**
 * A single day column with optional drag-to-create interaction.
 */
export function DayColumnWithDrag({
  day,
  dayStartMs,
  dayEvents,
  startHour,
  pixelsPerHour,
  timeSlots,
  onEventClick,
  currentTimeIndicator,
  userMap,
  dragState,
}: DayColumnWithDragProps) {
  const interviews = dayEvents.filter((e) => e.type === "interview");
  const meetings = dayEvents.filter((e) => e.type === "meeting");
  const availability = dayEvents.filter((e) => e.type === "availability");
  const foregroundEvents = [...interviews, ...meetings];
  const positioned = detectOverlappingEvents(foregroundEvents);

  return (
    <div
      className={cn(
        "relative border-r last:border-r-0",
        isToday(day) && "bg-blue-50/50 dark:bg-blue-950/20"
      )}
    >
      {/* Grid lines */}
      {timeSlots.map((slot, slotIdx) => {
        const top = (slot.hour - startHour + slot.minute / 60) * pixelsPerHour;
        const isHourLine = slot.minute === 0;
        return (
          <div
            key={slotIdx}
            className={cn(
              "absolute left-0 right-0",
              isHourLine ? "border-t border-border" : "border-t border-border/30"
            )}
            style={{ top }}
          />
        );
      })}

      {/* Drag overlay */}
      <div
        className="absolute inset-0 z-0 cursor-crosshair"
        onMouseDown={dragState?.handleMouseDown}
      />

      {/* Availability blocks (background) */}
      {availability.map((event) => {
        const pos = computeEventPosition(event.startTime, event.endTime, dayStartMs, startHour, pixelsPerHour);
        return (
          <div key={event.id} className="absolute left-0 right-0 z-[1] px-0.5" style={{ top: pos.top, height: pos.height }}>
            <CalendarEventBlock event={event} height={pos.height} onClick={onEventClick} userMap={userMap} />
          </div>
        );
      })}

      {/* Interview + meeting events (foreground) */}
      {positioned.map(({ event, position }) => {
        const pos = computeEventPosition(event.startTime, event.endTime, dayStartMs, startHour, pixelsPerHour);
        return (
          <div
            key={event.id}
            className="absolute z-[2] px-0.5"
            style={{ top: pos.top, height: pos.height, left: `${position.left}%`, width: `${position.width}%` }}
          >
            <CalendarEventBlock event={event} height={pos.height} onClick={onEventClick} userMap={userMap} />
          </div>
        );
      })}

      {/* Drag preview */}
      {dragState?.isDragging && dragState.preview && (
        <div
          className="absolute left-1 right-1 z-[4] rounded-sm border border-primary/40 bg-primary/20 pointer-events-none flex items-start px-1.5 py-0.5"
          style={{ top: dragState.preview.top, height: dragState.preview.height }}
        >
          <span className="text-signal-2 font-medium text-primary">
            {formatDragTimeRange(dragState.preview.startTime, dragState.preview.endTime)}
          </span>
        </div>
      )}

      {currentTimeIndicator}
    </div>
  );
}
