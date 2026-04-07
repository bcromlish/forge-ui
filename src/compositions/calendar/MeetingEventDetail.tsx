/**
 * Meeting-specific detail panel content for CalendarEventDetail.
 * Shows meta grid, join button, RSVP, agenda/notes, and attendees.
 */
"use client";

import { Video, Clock, MapPin, Users } from "lucide-react";
import { Button } from "../../primitives/button";
import { Separator } from "../../primitives/separator";
// TODO: Replace with prop-based API
// import type { CalendarEvent } from "@/types/calendarEvents";
import { formatDuration } from "./calendar-event-helpers";
import {
  MetaGrid,
  AttendeesSection,
  MEETING_ICONS,
  MEETING_TYPE_LABELS,
  VISIBILITY_LABEL,
} from "./calendar-event-parts";
import { RsvpWell } from "./RsvpWell";
import { AgendaNotesSection } from "./AgendaNotesSection";

/** Props for {@link MeetingEventDetail}. */
interface MeetingEventDetailProps {
  event: CalendarEvent;
  userNames?: Map<string, string>;
  currentUserId?: string;
  organizationId?: string;
  onRsvpChange?: (id: string, status: string) => void;
}

/** Meeting detail content — renders inside CalendarEventDetail body. */
export function MeetingEventDetail({
  event,
  userNames,
  currentUserId,
  organizationId,
  onRsvpChange,
}: MeetingEventDetailProps) {
  const info = event.meeting!;
  const durationMin = Math.round((event.endTime - event.startTime) / 60000);

  const currentUserAttendee = currentUserId
    ? (info.attendees ?? []).find((a) => a.userId === currentUserId)
    : undefined;

  return (
    <>
      {/* Meta grid: Location/Type, Duration, Visibility */}
      <MetaGrid
        columns={[
          ...(info.location
            ? [{ icon: <MapPin className="h-4 w-4" />, label: "Location", value: info.location }]
            : [{ icon: MEETING_ICONS[info.meetingType] ?? <Video className="h-4 w-4" />, label: "Type", value: MEETING_TYPE_LABELS[info.meetingType] ?? info.meetingType }]),
          { icon: <Clock className="h-4 w-4" />, label: "Duration", value: formatDuration(durationMin) },
          { icon: <Users className="h-4 w-4" />, label: "Visibility", value: VISIBILITY_LABEL[info.visibility ?? "internal"] ?? "Internal" },
        ]}
      />

      {/* Join Meeting — always shown, disabled when no link */}
      {info.meetingLink ? (
        <a href={info.meetingLink} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full" size="lg">
            <Video className="h-4 w-4 mr-2" />
            Join Video Meeting
          </Button>
        </a>
      ) : (
        <Button className="w-full" size="lg" disabled>
          <Video className="h-4 w-4 mr-2" />
          Join Video Meeting
        </Button>
      )}

      {/* RSVP well */}
      {currentUserAttendee && onRsvpChange && (
        <RsvpWell
          currentStatus={currentUserAttendee.rsvpStatus}
          onStatusChange={(status) => onRsvpChange(event.id, status)}
        />
      )}

      {/* Description */}
      {info.description && (
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-caption font-medium text-muted-foreground mb-2">
            Description
          </p>
          <p className="text-body">{info.description}</p>
        </div>
      )}

      <Separator />

      {/* Attendees */}
      <AttendeesSection
        eventId={event.id}
        attendees={(info.attendees ?? []).map((a) => ({
          userId: a.userId,
          rsvpStatus: a.rsvpStatus,
        }))}
        userNames={userNames}
        currentUserId={currentUserId}
        guestEmailCount={info.guestEmailCount}
      />

      {/* Agenda & Notes — bottom composition */}
      {organizationId && (
        <>
          <Separator />
          <AgendaNotesSection
            organizationId={organizationId}
            meetingId={event.id}
            userNames={userNames}
          />
        </>
      )}
    </>
  );
}
