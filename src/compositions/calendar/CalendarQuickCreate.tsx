"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverAnchor } from "../../primitives/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../primitives/tabs";
import { Button } from "../../primitives/button";
import type { DragSelection } from "../../types/calendar";
import { formatTime } from "../../types/calendar-utils";
import { QuickCreateMeetingForm } from "./QuickCreateMeetingForm";
import { QuickCreateInterviewForm } from "./QuickCreateInterviewForm";

type QuickCreateEventType = "availability" | "meeting" | "interview";

interface CalendarQuickCreateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selection: DragSelection | null;
  organizationId: string;
  selectedMemberIds: string[];
  members: { _id: string; name: string }[];
  onCreateAvailability: (data: { startTime: number; endTime: number }) => Promise<void>;
  onCreateMeeting: (data: { title: string; startTime: number; endTime: number; meetingType: string; attendeeUserIds: string[]; guestEmails: string[] }) => Promise<void>;
  onCreateInterview: (data: { candidateEmail: string; positionId: string; stageName: string; startTime: number; endTime: number; meetingType: string; interviewerUserIds: string[] }) => Promise<void>;
  onMoreOptions?: (eventType: QuickCreateEventType, data: Record<string, unknown>) => void;
}

export function CalendarQuickCreate({
  open, onOpenChange, selection, organizationId, selectedMemberIds, members,
  onCreateAvailability, onCreateMeeting, onCreateInterview, onMoreOptions,
}: CalendarQuickCreateProps) {
  const [eventType, setEventType] = useState<QuickCreateEventType>("meeting");
  const [saving, setSaving] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (open) setSaving(false); }, [open]);
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      const input = contentRef.current?.querySelector<HTMLInputElement>("[data-slot='tabs-content'][data-state='active'] input");
      input?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, [eventType, open]);

  const startTime = selection?.startTime ?? 0;
  const endTime = selection?.endTime ?? 0;

  const handleSaveAvailability = useCallback(async () => {
    setSaving(true);
    try { await onCreateAvailability({ startTime, endTime }); onOpenChange(false); } finally { setSaving(false); }
  }, [startTime, endTime, onCreateAvailability, onOpenChange]);

  const handleSaveMeeting = useCallback(async (data: { title: string; meetingType: string; attendeeUserIds: string[]; guestEmails: string[] }) => {
    setSaving(true);
    try { await onCreateMeeting({ ...data, startTime, endTime }); onOpenChange(false); } finally { setSaving(false); }
  }, [startTime, endTime, onCreateMeeting, onOpenChange]);

  const handleSaveInterview = useCallback(async (data: { candidateEmail: string; positionId: string; stageName: string; meetingType: string; interviewerUserIds: string[] }) => {
    setSaving(true);
    try { await onCreateInterview({ ...data, startTime, endTime }); onOpenChange(false); } finally { setSaving(false); }
  }, [startTime, endTime, onCreateInterview, onOpenChange]);

  if (!selection) return null;
  const dateLabel = new Date(startTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor ref={anchorRef} className="absolute" style={{ top: selection.top, left: "50%" }} />
      <PopoverContent ref={contentRef} side="right" align="start" sideOffset={8} className="w-96 p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-caption">{dateLabel}</span>
          <Clock className="h-4 w-4 text-muted-foreground ml-1" /><span className="text-caption">{formatTime(startTime)} – {formatTime(endTime)}</span>
        </div>
        <Tabs value={eventType} onValueChange={(v) => setEventType(v as QuickCreateEventType)} className="gap-0">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="availability" className="flex-1 text-caption">Availability</TabsTrigger>
            <TabsTrigger value="meeting" className="flex-1 text-caption">Meeting</TabsTrigger>
            <TabsTrigger value="interview" className="flex-1 text-caption">Interview</TabsTrigger>
          </TabsList>
          <TabsContent value="availability" className="p-3">
            <div className="flex flex-col gap-2">
              <p className="text-body text-muted-foreground">Mark this time slot as available for scheduling.</p>
              <div className="flex justify-between pt-1">
                <Button variant="ghost" size="sm" onClick={() => onMoreOptions?.("availability", { startTime, endTime })}>More options</Button>
                <Button size="sm" disabled={saving} onClick={handleSaveAvailability}>{saving ? "Saving..." : "Save"}</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="meeting" className="p-3">
            <QuickCreateMeetingForm
              organizationId={organizationId} startTime={startTime} endTime={endTime}
              defaultAttendeeIds={selectedMemberIds} members={members}
              onSave={handleSaveMeeting} onMoreOptions={(data) => onMoreOptions?.("meeting", { ...data, startTime, endTime })} saving={saving}
            />
          </TabsContent>
          <TabsContent value="interview" className="p-3">
            <QuickCreateInterviewForm
              organizationId={organizationId} startTime={startTime} endTime={endTime}
              defaultInterviewerIds={selectedMemberIds} members={members}
              onSave={handleSaveInterview} onMoreOptions={(data) => onMoreOptions?.("interview", { ...data, startTime, endTime })} saving={saving}
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
