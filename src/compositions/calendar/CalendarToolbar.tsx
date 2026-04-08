"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, CalendarClock } from "lucide-react";
import { Button } from "../../primitives/button";
import { cn } from "../../lib/utils";
import type { CalendarViewMode } from "../../types/calendar";
import { formatPeriodLabel } from "../../types/calendar-utils";

/** Props for {@link CalendarToolbar}. */
interface CalendarToolbarProps {
  view: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  currentDate: Date;
  onNavigate: (direction: "prev" | "today" | "next") => void;
  onScheduleInterview?: () => void;
  /** Labels for i18n. */
  labels?: {
    editAvailability?: string;
    scheduleInterview?: string;
  };
}

const VIEW_OPTIONS: { value: CalendarViewMode; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export function CalendarToolbar({
  view,
  onViewChange,
  currentDate,
  onNavigate,
  onScheduleInterview,
  labels = {},
}: CalendarToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 pb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onNavigate("today")}>
          Today
        </Button>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onNavigate("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onNavigate("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-title-3 whitespace-nowrap">
          {formatPeriodLabel(currentDate, view)}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex rounded-md border bg-muted/30 p-0.5">
          {VIEW_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onViewChange(opt.value)}
              className={cn(
                "rounded-sm px-3 py-1 text-body font-medium transition-colors",
                view === opt.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/availability">
            <CalendarClock className="mr-1 h-4 w-4" />
            {labels.editAvailability ?? "Edit Availability"}
          </Link>
        </Button>
        {onScheduleInterview && (
          <Button size="sm" onClick={onScheduleInterview}>
            <Plus className="mr-1 h-4 w-4" />
            {labels.scheduleInterview ?? "Schedule Interview"}
          </Button>
        )}
      </div>
    </div>
  );
}
