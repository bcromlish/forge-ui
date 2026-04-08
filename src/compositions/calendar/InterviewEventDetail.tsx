/**
 * Interview-specific detail panel content for CalendarEventDetail.
 */
"use client";

import { Video, Clock, BookOpen, CalendarClock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "../../primitives/button";
import { Badge } from "../../primitives/badge";
import { Separator } from "../../primitives/separator";
import { StatusBadge } from "../../patterns/status-badge";
import type { StatusBadgeStatus } from "../../patterns/status-badge";
import type { CalendarEvent } from "../../types/calendar";
import { formatDuration, formatStageName } from "./calendar-event-helpers";
import { MetaGrid, DetailRow, AttendeesSection, MEETING_ICONS, MEETING_TYPE_LABELS } from "./calendar-event-parts";
import { RsvpWell } from "./RsvpWell";
import { AgendaNotesSection } from "./AgendaNotesSection";

interface InterviewEventDetailProps {
  event: CalendarEvent;
  userNames?: Map<string, string>;
  currentUserId?: string;
  organizationId?: string;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  onNoShow?: (id: string) => void;
  onRsvpChange?: (id: string, status: string) => void;
}

export function InterviewEventDetail({
  event, userNames, currentUserId, onComplete, onCancel, onNoShow, organizationId, onRsvpChange,
}: InterviewEventDetailProps) {
  const info = event.interview!;
  const canAct = !["completed", "cancelled", "no_show"].includes(info.status);
  const durationMin = Math.round((event.endTime - event.startTime) / 60000);
  const currentUserAttendee = currentUserId
    ? (event.interviewAttendees ?? []).find((a) => a.userId === currentUserId)
    : undefined;

  return (
    <>
      <StatusBadge status={info.status as StatusBadgeStatus} />
      <MetaGrid columns={[
        { icon: MEETING_ICONS[info.meetingType] ?? <Video className="h-4 w-4" />, label: "Type", value: MEETING_TYPE_LABELS[info.meetingType] ?? info.meetingType },
        { icon: <Clock className="h-4 w-4" />, label: "Duration", value: formatDuration(durationMin) },
      ]} />
      {info.positionTitle && (
        <DetailRow icon={<BookOpen className="h-4 w-4" />} label="Position">
          {info.positionTitle} — {formatStageName(info.stageName)}
        </DetailRow>
      )}
      <Separator />
      {info.meetingLink ? (
        <a href={info.meetingLink} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full" size="lg"><Video className="h-4 w-4 mr-2" />Join Video Meeting</Button>
        </a>
      ) : (
        <Button className="w-full" size="lg" disabled><Video className="h-4 w-4 mr-2" />Join Video Meeting</Button>
      )}
      {currentUserAttendee && canAct && onRsvpChange && (
        <RsvpWell currentStatus={currentUserAttendee.rsvpStatus} onStatusChange={(status) => onRsvpChange(event.id, status)} />
      )}
      {info.notes && (
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-caption font-medium text-muted-foreground mb-2">Notes</p>
          <p className="text-body">{info.notes}</p>
        </div>
      )}
      <Separator />
      <AttendeesSection
        eventId={event.id}
        attendees={(event.interviewAttendees ?? []).map((a) => ({ userId: a.userId, rsvpStatus: a.rsvpStatus, role: a.role }))}
        userNames={userNames}
        currentUserId={currentUserId}
      />
      {info.selfScheduleToken && (
        <DetailRow icon={<CalendarClock className="h-4 w-4" />} label="Self-Schedule">
          <Badge variant="secondary" className="text-caption">Link generated</Badge>
        </DetailRow>
      )}
      {organizationId && (
        <><Separator /><AgendaNotesSection organizationId={organizationId} interviewId={event.id} userNames={userNames} /></>
      )}
      {canAct && (onComplete || onCancel || onNoShow) && (
        <>
          <Separator />
          <div className="flex gap-2">
            {onComplete && <Button variant="outline" size="sm" onClick={() => onComplete(event.id)}><CheckCircle className="h-4 w-4 mr-1" /> Complete</Button>}
            {onCancel && <Button variant="outline" size="sm" onClick={() => onCancel(event.id)}><XCircle className="h-4 w-4 mr-1" /> Cancel</Button>}
            {onNoShow && <Button variant="outline" size="sm" className="text-destructive" onClick={() => onNoShow(event.id)}><AlertTriangle className="h-4 w-4 mr-1" /> No-Show</Button>}
          </div>
        </>
      )}
    </>
  );
}
