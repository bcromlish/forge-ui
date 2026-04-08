/**
 * Full calendar page content -- data fetching, state management,
 * and rendering of the active calendar view.
 * All data and mutations provided via props.
 */
"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar as CalendarIcon } from "lucide-react";
import type { CalendarEvent, CalendarViewMode, DragSelection } from "../../types/calendar";
import { computeWeekBoundaries, computeDayBoundaries, computeMonthBoundaries } from "../../types/calendar-utils";
import { CalendarToolbar } from "./CalendarToolbar";
import { CalendarWeekView } from "./CalendarWeekView";
import { CalendarDayView } from "./CalendarDayView";
import { CalendarMonthView } from "./CalendarMonthView";
import { CalendarEventDetail } from "./CalendarEventDetail";
import { CalendarQuickCreate } from "./CalendarQuickCreate";
import { CalendarEventFormSheet } from "./CalendarEventFormSheet";

/** Props for {@link CalendarPageContent}. */
interface CalendarPageContentProps {
  /** Organization ID. Null means loading. */
  organizationId: string | null;
  /** Current user's ID. */
  currentUserId?: string;
  /** Calendar events to display. */
  events: CalendarEvent[];
  /** Organization members. */
  members: { _id: string; name: string; avatarUrl?: string }[];
  /** Selected member IDs for filtering. Null means show all. */
  selectedMemberIds?: Set<string> | null;
  /** User name lookup map. */
  userNameMap?: Map<string, string>;
  /** User info lookup map for avatars. */
  userInfoMap?: Map<string, { _id: string; name: string; avatarUrl?: string }>;
  /** Callback for creating availability. */
  onCreateAvailability?: (data: { startTime: number; endTime: number }) => Promise<void>;
  /** Callback for creating a meeting. */
  onCreateMeeting?: (data: Record<string, unknown>) => Promise<void>;
  /** Callback for creating an interview. */
  onCreateInterview?: (data: Record<string, unknown>) => Promise<void>;
  /** Callback for RSVP changes. */
  onRsvpChange?: (eventId: string, status: string) => void;
  /** Callback for event deletion. */
  onDelete?: (eventId: string) => void;
}

export function CalendarPageContent({
  organizationId,
  currentUserId,
  events,
  members,
  selectedMemberIds,
  userNameMap = new Map(),
  userInfoMap = new Map(),
  onCreateAvailability,
  onCreateMeeting,
  onCreateInterview,
  onRsvpChange,
  onDelete,
}: CalendarPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const viewParam = searchParams.get("view") as CalendarViewMode | null;
  const dateParam = searchParams.get("date");

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

  const membersList = useMemo(
    () => members.map((m) => ({ _id: m._id, name: m.name })),
    [members]
  );

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) ?? null,
    [events, selectedEventId]
  );

  const handleDelete = useCallback(
    (eventId: string) => {
      onDelete?.(eventId);
      setDetailOpen(false);
    },
    [onDelete]
  );

  const handleEdit = useCallback(
    (eventId: string) => {
      const evt = events.find((e) => e.id === eventId);
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
    [events]
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
          case "day": d.setDate(d.getDate() + delta); break;
          case "week": d.setDate(d.getDate() + delta * 7); break;
          case "month": d.setMonth(d.getMonth() + delta); break;
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

  if (!organizationId) {
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
        <CalendarToolbar view={view} onViewChange={handleViewChange} currentDate={currentDate} onNavigate={navigate} />
      </div>
      <div className="flex-1 px-6 pb-6 min-h-0 flex flex-col">
        {view === "week" && (
          <CalendarWeekView events={events} weekStart={currentDate} onEventClick={handleEventClick} onDragComplete={handleDragComplete} userMap={userInfoMap} />
        )}
        {view === "day" && (
          <CalendarDayView
            date={currentDate} events={events} members={membersList}
            selectedUserIds={selectedMemberIds ? Array.from(selectedMemberIds) : membersList.map((m) => m._id)}
            onEventClick={handleEventClick} onDragComplete={handleDragComplete} userMap={userInfoMap}
          />
        )}
        {view === "month" && (
          <CalendarMonthView month={currentDate} events={events} onDayClick={handleDayClick} selectedDate={currentDate} />
        )}
      </div>
      <CalendarEventDetail
        event={selectedEvent} open={detailOpen} onOpenChange={setDetailOpen}
        userNames={userNameMap} currentUserId={currentUserId} organizationId={organizationId}
        onRsvpChange={onRsvpChange} onEdit={handleEdit} onDelete={handleDelete}
      />
      {onCreateAvailability && onCreateMeeting && onCreateInterview && (
        <CalendarQuickCreate
          open={quickCreateOpen} onOpenChange={setQuickCreateOpen} selection={dragSelection}
          organizationId={organizationId}
          selectedMemberIds={selectedMemberIds ? Array.from(selectedMemberIds) : []}
          members={membersList}
          onCreateAvailability={onCreateAvailability}
          onCreateMeeting={onCreateMeeting as CalendarPageContentProps["onCreateMeeting"] & ((data: { title: string; startTime: number; endTime: number; meetingType: string; attendeeUserIds: string[]; guestEmails: string[] }) => Promise<void>)}
          onCreateInterview={onCreateInterview as CalendarPageContentProps["onCreateInterview"] & ((data: { candidateEmail: string; positionId: string; stageName: string; startTime: number; endTime: number; meetingType: string; interviewerUserIds: string[] }) => Promise<void>)}
          onMoreOptions={handleMoreOptions}
        />
      )}
      {onCreateMeeting && (
        <CalendarEventFormSheet
          open={sheetOpen} onOpenChange={setSheetOpen}
          initialValues={sheetInitialValues as { title?: string; startTime: number; endTime: number; meetingType?: string; attendeeUserIds?: string[]; guestEmails?: string[] } | null}
          members={membersList}
          onSave={onCreateMeeting as (data: Record<string, unknown>) => Promise<void>}
        />
      )}
    </div>
  );
}
