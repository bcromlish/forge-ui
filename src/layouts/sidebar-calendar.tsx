"use client";

import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
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
// TODO: Replace with prop-based API
// import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
// TODO: Replace with prop-based API
// import { useCurrentUser } from "@/features/users/hooks-current";
// TODO: Replace with prop-based API
// import { useOrgMembers } from "@/features/users/hooks";
// TODO: Replace with prop-based API
// import { useInterviewsByDateRange } from "@/features/interviews/hooks/useInterviews";
// TODO: Replace with prop-based API
// import { useMeetingsByDateRange } from "@/features/meetings/hooks";
import {
  normalizeInterviewToEvent,
  normalizeMeetingToEvent,
// TODO: Replace with prop-based API
// } from "@/lib/domain/calendar-events";
// TODO: Replace with prop-based API
// import type { CalendarEvent } from "@/types/calendarEvents";

// Captured once at module load — stable "now" that avoids impure Date calls during render
const MODULE_NOW = Date.now();

/**
 * Calendar tab sidebar — mini calendar, team member filter, and today's events.
 * Smart component that fetches its own data.
 */
export function SidebarCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("sidebar.calendar");
  const tCommon = useTranslations("common");
  const { organizationId: orgId } = useActiveOrganization();
  const currentUser = useCurrentUser();

  // Read date from URL or default to today
  const dateParam = searchParams.get("date");
  const selectedDate = useMemo(
    () => (dateParam ? new Date(dateParam + "T12:00:00") : new Date(MODULE_NOW)),
    [dateParam]
  );

  // Fetch org members
  const members = useOrgMembers(orgId!);

  // Selected member IDs synced to URL for cross-component sharing with CalendarPageContent.
  // No param = current user only (default on reload). CSV = specific IDs.
  const membersParam = searchParams.get("members");
  const currentUserId = currentUser?._id;
  const effectiveSelectedIds = useMemo<Set<string>>(() => {
    if (membersParam === null) {
      // No param — default to current user only
      return currentUserId ? new Set([currentUserId]) : new Set();
    }
    if (membersParam === "") {
      return new Set();
    }
    return new Set(membersParam.split(",").filter(Boolean));
  }, [membersParam, currentUserId]);

  // Fetch current month's interviews + meetings for mini-calendar dots + today's events
  const monthRange = useMemo(() => {
    const d = new Date(selectedDate);
    const start = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
    return { start, end };
  }, [selectedDate]);

  const interviews = useInterviewsByDateRange(
    orgId!,
    monthRange.start,
    monthRange.end
  );

  const meetings = useMeetingsByDateRange(
    orgId!,
    monthRange.start,
    monthRange.end
  );

  // Normalize interviews + meetings to CalendarEvents for TodayEvents and dots
  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    const events: CalendarEvent[] = [];
    if (interviews) {
      for (const i of interviews) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Convex Doc to portable Interview bridge
        const evt = normalizeInterviewToEvent(i as any);
        if (evt) events.push(evt);
      }
    }
    if (meetings) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Convex Doc to portable Meeting bridge
      for (const m of meetings) events.push(normalizeMeetingToEvent(m as any));
    }
    return events;
  }, [interviews, meetings]);

  // Dates with events for mini-calendar dots (interviews + meetings, not availability)
  const eventDates = useMemo(() => {
    const dates: Date[] = [];
    const seen = new Set<string>();
    for (const event of calendarEvents) {
      const d = new Date(event.startTime);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!seen.has(key)) {
        seen.add(key);
        dates.push(d);
      }
    }
    return dates;
  }, [calendarEvents]);

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("date", date.toISOString().split("T")[0]!);
        if (!params.has("view")) params.set("view", "week");
        router.push(`/calendar?${params.toString()}`);
      }
    },
    [router, searchParams]
  );

  /** Update URL with new member selection, preserving existing date/view params. */
  const updateMembersParam = useCallback(
    (ids: Set<string>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (ids.size === 0) {
        params.set("members", "");
      } else {
        params.set("members", Array.from(ids).join(","));
      }
      router.push(`/calendar?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleAddMember = useCallback(
    (userId: string) => {
      const next = new Set(effectiveSelectedIds);
      next.add(userId);
      updateMembersParam(next);
    },
    [effectiveSelectedIds, updateMembersParam]
  );

  const handleRemoveMember = useCallback(
    (userId: string) => {
      const next = new Set(effectiveSelectedIds);
      next.delete(userId);
      updateMembersParam(next);
    },
    [effectiveSelectedIds, updateMembersParam]
  );

  const handleEventClick = useCallback(
    (event: CalendarEvent) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("date", new Date(event.startTime).toISOString().split("T")[0]!);
      params.set("view", "day");
      router.push(`/calendar?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Don't render until org is loaded (need orgId for queries)
  if (!orgId) {
    return (
      <SidebarContent>
        <SidebarGroup className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
          <Clock className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-body font-medium text-muted-foreground">{t("title")}</p>
          <p className="text-caption text-muted-foreground/70">{tCommon("loading")}</p>
        </SidebarGroup>
      </SidebarContent>
    );
  }

  return (
    <SidebarContent>
      {/* Mini Calendar */}
      <SidebarGroup>
        <SidebarGroupLabel>{t("title")}</SidebarGroupLabel>
        <SidebarGroupContent className="px-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
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
      {members && members.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel>{t("teamMembers")}</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <TeamMemberFilter
              // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Convex Doc to portable User type bridge
              members={members as any}
              selectedIds={effectiveSelectedIds}
              onAdd={handleAddMember}
              onRemove={handleRemoveMember}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {/* Today's Events */}
      <SidebarGroup>
        <SidebarGroupLabel>{t("today")}</SidebarGroupLabel>
        <SidebarGroupContent className="px-2">
          <TodayEvents events={calendarEvents} now={MODULE_NOW} onEventClick={handleEventClick} />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
