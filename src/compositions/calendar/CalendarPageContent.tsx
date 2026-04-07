"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar as CalendarIcon } from "lucide-react";
// TODO: Replace with prop-based API
// import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
// TODO: Replace with prop-based API
// import { useCurrentUser } from "@/features/users/hooks-current";
// TODO: Replace with prop-based API
// import { useOrgMembers } from "@/features/users/hooks";
// TODO: Replace with prop-based API
// import { useInterviewsByDateRange } from "@/features/interviews/hooks/useInterviews";
// TODO: Replace with prop-based API
// import { useAvailabilityByDateRange } from "@/features/interviews/hooks/useInterviewerAvailability";
// TODO: Replace with prop-based API
// import { useMeetingsByDateRange, useUpdateMeetingRsvp, useRemoveMeeting } from "@/features/meetings/hooks";
// TODO: Replace with prop-based API
// import { useCalendarMutations } from "@/hooks/useCalendarMutations";
import {
  normalizeInterviewToEvent,
  normalizeMeetingToEvent,
  expandRecurringSlots,
// TODO: Replace with prop-based API
// } from "@/lib/domain/calendar-events";
import {
  computeWeekBoundaries,
  computeDayBoundaries,
  computeMonthBoundaries,
// TODO: Replace with prop-based API
// } from "@/lib/domain/calendar-grid";
// TODO: Replace with prop-based API
// import type { CalendarEvent, CalendarViewMode } from "@/types/calendarEvents";
// TODO: Replace with prop-based API
// import type { DragSelection } from "@/hooks/useCalendarDrag";
// TODO: Replace with prop-based API
// import type { Id } from "@/convex/_generated/dataModel";
import { CalendarToolbar } from "./CalendarToolbar";
import { CalendarWeekView } from "./CalendarWeekView";
import { CalendarDayView } from "./CalendarDayView";
import { CalendarMonthView } from "./CalendarMonthView";
import { CalendarEventDetail } from "./CalendarEventDetail";
import { CalendarQuickCreate } from "./CalendarQuickCreate";
import { CalendarEventFormSheet } from "./CalendarEventFormSheet";

/**
 * Full calendar page content — data fetching, state management,
 * and rendering of the active calendar view.
 * URL state: `/calendar?view=week&date=2026-02-17`
 */
export function CalendarPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { organizationId: orgId } = useActiveOrganization();
  const currentUser = useCurrentUser();

  const viewParam = searchParams.get("view") as CalendarViewMode | null;
  const dateParam = searchParams.get("date");
  const membersParam = searchParams.get("members");

  const view: CalendarViewMode = viewParam ?? "week";
  const currentDate = useMemo(
    () => (dateParam ? new Date(dateParam + "T12:00:00") : new Date()),
    [dateParam]
  );

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [dragSelection, setDragSelection] = useState<DragSelection | null>(null);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetInitialValues, setSheetInitialValues] = useState<Record<string, unknown> | null>(null);

  const members = useOrgMembers(orgId!);

  const dateRange = useMemo(() => {
    switch (view) {
      case "day":
        return computeDayBoundaries(currentDate);
      case "week":
        return computeWeekBoundaries(currentDate);
      case "month":
        return computeMonthBoundaries(currentDate);
    }
  }, [view, currentDate]);

  const allMemberIds = useMemo(
    () => (members ?? []).map((m) => m._id as Id<"users">),
    [members]
  );

  const interviews = useInterviewsByDateRange(
    orgId!,
    dateRange.start,
    dateRange.end
  );

  const availabilitySlots = useAvailabilityByDateRange(
    orgId!,
    allMemberIds,
    dateRange.start,
    dateRange.end
  );

  const meetings = useMeetingsByDateRange(
    orgId!,
    dateRange.start,
    dateRange.end
  );

  const calendarMutations = useCalendarMutations(
    orgId,
    currentUser?._id as Id<"users"> | undefined
  );

  const updateMeetingRsvp = useUpdateMeetingRsvp();
  const handleRsvpChange = useCallback(
    (eventId: string, status: string) => {
      void updateMeetingRsvp({
        meetingId: eventId as Id<"meetings">,
        status: status as "pending" | "accepted" | "declined" | "tentative",
      });
    },
    [updateMeetingRsvp]
  );

  const userNameMap = useMemo(() => {
    if (!members) return new Map<string, string>();
    return new Map(members.map((m) => [m._id, m.name]));
  }, [members]);

  /** User lookup for avatar rendering in calendar event blocks. */
  const userInfoMap = useMemo(() => {
    if (!members) return new Map<string, { _id: string; name: string; avatarUrl?: string }>();
    return new Map(
      members.map((m) => [m._id as string, { _id: m._id as string, name: m.name, avatarUrl: m.avatarUrl }])
    );
  }, [members]);

  const membersList = useMemo(
    () => (members ?? []).map((m) => ({ _id: m._id as string, name: m.name })),
    [members]
  );

  // Member filter: null param = current user only (default on reload), CSV = specific IDs
  const currentUserId = currentUser?._id as string | undefined;
  const selectedMemberFilter = useMemo<Set<string> | null>(() => {
    if (membersParam === null) {
      // Default to current user only (matches sidebar behavior)
      return currentUserId ? new Set([currentUserId]) : null;
    }
    if (membersParam === "") return new Set();
    return new Set(membersParam.split(",").filter(Boolean));
  }, [membersParam, currentUserId]);

  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    const events: CalendarEvent[] = [];
    if (interviews) {
      for (const iv of interviews) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Convex Doc to portable type bridge
        const evt = normalizeInterviewToEvent(iv as any);
        if (evt) events.push(evt);
      }
    }
    if (meetings) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Convex Doc to portable type bridge
      for (const m of meetings) events.push(normalizeMeetingToEvent(m as any));
    }
    if (availabilitySlots) {
      for (const slot of availabilitySlots) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Convex Doc to portable type bridge
        events.push(...expandRecurringSlots(slot as any, dateRange.start, dateRange.end, userNameMap.get(slot.userId)));
      }
    }
    if (selectedMemberFilter !== null) {
      return events.filter((e) => e.userIds.some((uid) => selectedMemberFilter.has(uid)));
    }
    return events;
  }, [interviews, meetings, availabilitySlots, dateRange.start, dateRange.end, userNameMap, selectedMemberFilter]);

  /** Derive selected event from live data so RSVP changes reflect immediately. */
  const selectedEvent = useMemo(
    () => calendarEvents.find((e) => e.id === selectedEventId) ?? null,
    [calendarEvents, selectedEventId]
  );

  const removeMeeting = useRemoveMeeting();
  const handleDelete = useCallback(
    (eventId: string) => {
      void removeMeeting({ meetingId: eventId as Id<"meetings"> });
      setDetailOpen(false);
    },
    [removeMeeting]
  );

  const handleEdit = useCallback(
    (eventId: string) => {
      const evt = calendarEvents.find((e) => e.id === eventId);
      if (!evt?.meeting) return;
      setSheetInitialValues({
        title: evt.title,
        startTime: evt.startTime,
        endTime: evt.endTime,
        meetingType: evt.meeting.meetingType,
        attendeeUserIds: evt.meeting.attendees?.map((a) => a.userId) ?? [],
      });
      setDetailOpen(false);
      setSheetOpen(true);
    },
    [calendarEvents]
  );

  const navigate = useCallback(
    (direction: "prev" | "today" | "next") => {
      let newDate: Date;

      if (direction === "today") {
        newDate = new Date();
      } else {
        const d = new Date(currentDate);
        const delta = direction === "next" ? 1 : -1;

        switch (view) {
          case "day":
            d.setDate(d.getDate() + delta);
            break;
          case "week":
            d.setDate(d.getDate() + delta * 7);
            break;
          case "month":
            d.setMonth(d.getMonth() + delta);
            break;
        }
        newDate = d;
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set("view", view);
      params.set("date", newDate.toISOString().split("T")[0]!);
      router.push(`/calendar?${params.toString()}`);
    },
    [currentDate, view, router, searchParams]
  );

  const handleViewChange = useCallback(
    (newView: CalendarViewMode) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", newView);
      params.set("date", currentDate.toISOString().split("T")[0]!);
      router.push(`/calendar?${params.toString()}`);
    },
    [currentDate, router, searchParams]
  );

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEventId(event.id);
    setDetailOpen(true);
  }, []);

  const handleDayClick = useCallback(
    (date: Date) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", "day");
      params.set("date", date.toISOString().split("T")[0]!);
      router.push(`/calendar?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleDragComplete = useCallback((selection: DragSelection) => {
    setDragSelection(selection);
    setQuickCreateOpen(true);
  }, []);

  const handleMoreOptions = useCallback((_eventType: string, data: Record<string, unknown>) => {
    setQuickCreateOpen(false);
    setSheetInitialValues(data);
    setSheetOpen(true);
  }, []);

  if (!orgId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
        <CalendarIcon className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-body text-muted-foreground">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="px-6 pt-6">
        <CalendarToolbar
          view={view}
          onViewChange={handleViewChange}
          currentDate={currentDate}
          onNavigate={navigate}
        />
      </div>

      <div className="flex-1 px-6 pb-6 min-h-0 flex flex-col">
        {view === "week" && (
          <CalendarWeekView
            events={calendarEvents}
            weekStart={currentDate}
            onEventClick={handleEventClick}
            onDragComplete={handleDragComplete}
            userMap={userInfoMap}
          />
        )}
        {view === "day" && (
          <CalendarDayView
            date={currentDate}
            events={calendarEvents}
            members={membersList}
            selectedUserIds={selectedMemberFilter ? Array.from(selectedMemberFilter) : membersList.map(m => m._id)}
            onEventClick={handleEventClick}
            onDragComplete={handleDragComplete}
            userMap={userInfoMap}
          />
        )}
        {view === "month" && (
          <CalendarMonthView
            month={currentDate}
            events={calendarEvents}
            onDayClick={handleDayClick}
            selectedDate={currentDate}
          />
        )}
      </div>

      <CalendarEventDetail
        event={selectedEvent}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        userNames={userNameMap}
        currentUserId={currentUserId}
        organizationId={orgId}
        onRsvpChange={handleRsvpChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CalendarQuickCreate
        open={quickCreateOpen}
        onOpenChange={setQuickCreateOpen}
        selection={dragSelection}
        organizationId={orgId}
        selectedMemberIds={selectedMemberFilter ? Array.from(selectedMemberFilter) : []}
        members={membersList}
        onCreateAvailability={calendarMutations.createAvailability}
        onCreateMeeting={calendarMutations.createMeeting}
        onCreateInterview={calendarMutations.createInterview}
        onMoreOptions={handleMoreOptions}
      />

      <CalendarEventFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        initialValues={sheetInitialValues as { title?: string; startTime: number; endTime: number; meetingType?: string; attendeeUserIds?: string[]; guestEmails?: string[] } | null}
        members={membersList}
        onSave={calendarMutations.createMeeting}
      />
    </div>
  );
}
