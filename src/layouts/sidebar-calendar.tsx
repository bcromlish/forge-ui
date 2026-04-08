"use client";

import { useMemo } from "react";
import { Clock } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "../primitives/sidebar";
import { Calendar } from "../primitives/calendar";
import { TeamMemberFilter } from "../compositions/calendar/TeamMemberFilter";
import { TodayEvents } from "../compositions/calendar/TodayEvents";
import type { CalendarEvent } from "../types/calendar";
import type { User } from "../types/domain";

// Captured once at module load
const MODULE_NOW = Date.now();

/** Props for {@link SidebarCalendar}. */
interface SidebarCalendarProps {
  /** Calendar events for today's list and mini-calendar dots. */
  events: CalendarEvent[];
  /** Organization members for the team member filter. */
  members: User[];
  /** Currently selected member IDs. */
  selectedIds: Set<string>;
  /** Selected date for the mini-calendar. Defaults to today. */
  selectedDate?: Date;
  /** Callback when a member is added to the filter. */
  onMemberAdd?: (userId: string) => void;
  /** Callback when a member is removed from the filter. */
  onMemberRemove?: (userId: string) => void;
  /** Callback when a date is selected in the mini-calendar. */
  onDateSelect?: (date: Date | undefined) => void;
  /** Callback when an event is clicked in the today's events list. */
  onEventClick?: (event: CalendarEvent) => void;
  /** Labels for i18n. */
  labels?: {
    title?: string;
    teamMembers?: string;
    today?: string;
    loading?: string;
  };
}

/**
 * Calendar tab sidebar -- mini calendar, team member filter, and today's events.
 * All data provided via props -- no internal data fetching.
 */
export function SidebarCalendar({
  events,
  members,
  selectedIds,
  selectedDate,
  onMemberAdd,
  onMemberRemove,
  onDateSelect,
  onEventClick,
  labels = {},
}: SidebarCalendarProps) {
  const effectiveDate = selectedDate ?? new Date(MODULE_NOW);

  // Dates with events for mini-calendar dots
  const eventDates = useMemo(() => {
    const dates: Date[] = [];
    const seen = new Set<string>();
    for (const event of events) {
      if (event.type === "availability") continue;
      const d = new Date(event.startTime);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!seen.has(key)) {
        seen.add(key);
        dates.push(d);
      }
    }
    return dates;
  }, [events]);

  return (
    <SidebarContent>
      {/* Mini Calendar */}
      <SidebarGroup>
        <SidebarGroupLabel>{labels.title ?? "Calendar"}</SidebarGroupLabel>
        <SidebarGroupContent className="px-2">
          <Calendar
            mode="single"
            selected={effectiveDate}
            onSelect={onDateSelect}
            weekStartsOn={1}
            modifiers={eventDates.length > 0 ? { hasEvents: eventDates } : undefined}
            modifiersClassNames={
              eventDates.length > 0
                ? {
                    hasEvents:
                      "after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-primary relative",
                  }
                : undefined
            }
            className="[--cell-size:--spacing(7)]"
          />
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Team Members */}
      {members.length > 0 && onMemberAdd && onMemberRemove && (
        <SidebarGroup>
          <SidebarGroupLabel>{labels.teamMembers ?? "Team Members"}</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <TeamMemberFilter
              members={members}
              selectedIds={selectedIds}
              onAdd={onMemberAdd}
              onRemove={onMemberRemove}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {/* Today's Events */}
      <SidebarGroup>
        <SidebarGroupLabel>{labels.today ?? "Today"}</SidebarGroupLabel>
        <SidebarGroupContent className="px-2">
          <TodayEvents events={events} now={MODULE_NOW} onEventClick={onEventClick} />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
