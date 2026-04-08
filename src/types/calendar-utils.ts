/**
 * Generic calendar utility functions for forge-ui.
 * These replace VidCruiter-specific domain functions with portable implementations.
 * Consumers can override these by providing their own implementations via props.
 */

import type { CalendarEvent, TimeSlot } from "./calendar";

/** Format a timestamp as a time string (e.g., "9:00 AM"). */
export function formatTime(ms: number): string {
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Format a period label for the calendar toolbar. */
export function formatPeriodLabel(date: Date, view: string): string {
  switch (view) {
    case "day":
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    case "week": {
      const weekEnd = new Date(date);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const startMonth = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const endMonth = weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      return `${startMonth} - ${endMonth}`;
    }
    case "month":
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    default:
      return date.toLocaleDateString("en-US");
  }
}

/** Check if a date is today. */
export function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

/** Check if two dates are the same calendar day. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Get day boundaries as epoch timestamps. */
export function computeDayBoundaries(date: Date): { start: number; end: number } {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const end = start + 86400000;
  return { start, end };
}

/** Get week boundaries starting from Monday. */
export function computeWeekBoundaries(date: Date): { start: number; end: number } {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday start
  d.setDate(d.getDate() + diff);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const end = start + 7 * 86400000;
  return { start, end };
}

/** Get month boundaries. */
export function computeMonthBoundaries(date: Date): { start: number; end: number } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime();
  return { start, end };
}

/** Generate time slot labels for the calendar grid. */
export function generateTimeSlots(startHour: number, endHour: number, intervalMinutes: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const d = new Date(2000, 0, 1, hour, minute);
      slots.push({
        hour,
        minute,
        label: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      });
    }
  }
  return slots;
}

/** Filter events that overlap with a given time range. */
export function filterEventsByDay(events: CalendarEvent[], start: number, end: number): CalendarEvent[] {
  return events.filter((e) => e.startTime < end && e.endTime > start);
}

/** Sort events by start time. */
export function sortEventsByTime(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => a.startTime - b.startTime);
}

/** Get 7 days of the week starting from the given date (Monday start). */
export function getWeekDays(weekStart: Date): Date[] {
  const d = new Date(weekStart);
  const dayOfWeek = d.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  d.setDate(d.getDate() + diff);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(new Date(d.getFullYear(), d.getMonth(), d.getDate() + i));
  }
  return days;
}

/** Get a 6-week grid of days for a month view. */
export function getMonthGridDays(month: Date): Date[] {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  let startDay = firstDay.getDay() - 1; // Monday = 0
  if (startDay < 0) startDay = 6;
  const gridStart = new Date(firstDay);
  gridStart.setDate(gridStart.getDate() - startDay);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }
  return days;
}

/** Compute vertical position of an event in the time grid. */
export function computeEventPosition(
  startTime: number,
  endTime: number,
  dayStartMs: number,
  startHour: number,
  pixelsPerHour: number
): { top: number; height: number } {
  const startHours = (startTime - dayStartMs) / 3600000;
  const endHours = (endTime - dayStartMs) / 3600000;
  const top = (startHours - startHour) * pixelsPerHour;
  const height = Math.max((endHours - startHours) * pixelsPerHour, 4);
  return { top, height };
}

/** Compute horizontal position of an event in the day resource view. */
export function computeHorizontalEventPosition(
  startTime: number,
  endTime: number,
  dayStartMs: number,
  startHour: number,
  pixelsPerHour: number
): { left: number; width: number } {
  const startHours = (startTime - dayStartMs) / 3600000;
  const endHours = (endTime - dayStartMs) / 3600000;
  const left = (startHours - startHour) * pixelsPerHour;
  const width = Math.max((endHours - startHours) * pixelsPerHour, 4);
  return { left, width };
}

/** Detect overlapping events and compute layout positions. */
export function detectOverlappingEvents(
  events: CalendarEvent[]
): { event: CalendarEvent; position: { left: number; width: number } }[] {
  if (events.length === 0) return [];
  const sorted = [...events].sort((a, b) => a.startTime - b.startTime);
  const result: { event: CalendarEvent; position: { left: number; width: number } }[] = [];
  const columns: CalendarEvent[][] = [];

  for (const event of sorted) {
    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      const last = columns[i]![columns[i]!.length - 1]!;
      if (event.startTime >= last.endTime) {
        columns[i]!.push(event);
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([event]);
    }
  }

  const totalColumns = columns.length;
  for (let col = 0; col < columns.length; col++) {
    for (const event of columns[col]!) {
      result.push({
        event,
        position: {
          left: (col / totalColumns) * 100,
          width: (1 / totalColumns) * 100,
        },
      });
    }
  }

  return result;
}

/** Get color classes for an event type. */
export function getEventColor(
  type: string,
  status?: string
): { bg: string; border: string; text: string } {
  if (type === "availability") {
    return {
      bg: "bg-olive-50/60 dark:bg-olive-950/20",
      border: "border-olive-300 dark:border-olive-700",
      text: "text-olive-800 dark:text-olive-200",
    };
  }
  if (type === "meeting") {
    return {
      bg: "bg-fuchsia-50 dark:bg-fuchsia-950/20",
      border: "border-fuchsia-200 dark:border-fuchsia-800",
      text: "text-fuchsia-900 dark:text-fuchsia-100",
    };
  }
  // interview
  if (status === "cancelled" || status === "no_show") {
    return {
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-900 dark:text-red-100",
    };
  }
  if (status === "completed") {
    return {
      bg: "bg-green-50 dark:bg-green-950/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-900 dark:text-green-100",
    };
  }
  return {
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
    border: "border-indigo-200 dark:border-indigo-800",
    text: "text-indigo-900 dark:text-indigo-100",
  };
}

/** Format a drag time range for display. */
export function formatDragTimeRange(startTime: number, endTime: number): string {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}
