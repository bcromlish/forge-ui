"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "../../primitives/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../primitives/tabs";
import { Button } from "../../primitives/button";
// TODO: Replace with prop-based API
// import { formatTime } from "@/lib/domain/calendar-format";
import { QuickCreateMeetingForm } from "./QuickCreateMeetingForm";
import { QuickCreateInterviewForm } from "./QuickCreateInterviewForm";
// TODO: Replace with prop-based API
// import type { Id } from "@/convex/_generated/dataModel";
// TODO: Replace with prop-based API
// import type { DragSelection } from "@/hooks/useCalendarDrag";

/** Event type for the quick-create popover. */
type QuickCreateEventType = "availability" | "meeting" | "interview";

/** Props for {@link CalendarQuickCreate}. */
interface CalendarQuickCreateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selection: DragSelection | null;
  organizationId: Id<"organizations">;
  /** Member IDs selected in the sidebar filter (auto-fill attendees). */
  selectedMemberIds: string[];
  /** All org members for attendee/interviewer picker. */
  members: { _id: string; name: string }[];
  onCreateAvailability: (data: {
    startTime: number;
    endTime: number;
  }) => Promise<void>;
  onCreateMeeting: (data: {
    title: string;
    startTime: number;
    endTime: number;
    meetingType: string;
    attendeeUserIds: string[];
    guestEmails: string[];
  }) => Promise<void>;
  onCreateInterview: (data: {
    candidateEmail: string;
    positionId: string;
    stageName: string;
    startTime: number;
    endTime: number;
    meetingType: string;
    interviewerUserIds: string[];
  }) => Promise<void>;
  /** Escalate to full form Sheet with pre-filled data. */
  onMoreOptions?: (eventType: QuickCreateEventType, data: Record<string, unknown>) => void;
}

/**
 * Quick-create popover anchored to the calendar drag selection.
 * Three tabs: Availability (minimal), Meeting, Interview.
 */
export function CalendarQuickCreate({
  open,
  onOpenChange,
  selection,
  organizationId,
  selectedMemberIds,
  members,
  onCreateAvailability,
  onCreateMeeting,
  onCreateInterview,
  onMoreOptions,
}: CalendarQuickCreateProps) {
  const [eventType, setEventType] = useState<QuickCreateEventType>("meeting");
  const [saving, setSaving] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  // Reset state when popover opens
  useEffect(() => {
    if (open) setSaving(false);
  }, [open]);

  // Focus the first input when the active tab changes (deferred to avoid aria-hidden conflict)
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      const input = contentRef.current?.querySelector<HTMLInputElement>(
        "[data-slot='tabs-content'][data-state='active'] input"
      );
      input?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, [eventType, open]);

  const startTime = selection?.startTime ?? 0;
  const endTime = selection?.endTime ?? 0;

  const handleSaveAvailability = useCallback(async () => {
    setSaving(true);
    try {
      await onCreateAvailability({ startTime, endTime });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }, [startTime, endTime, onCreateAvailability, onOpenChange]);

  const handleSaveMeeting = useCallback(
    async (data: {
      title: string;
      meetingType: string;
      attendeeUserIds: string[];
      guestEmails: string[];
    }) => {
      setSaving(true);
      try {
        await onCreateMeeting({ ...data, startTime, endTime });
        onOpenChange(false);
      } finally {
        setSaving(false);
      }
    },
    [startTime, endTime, onCreateMeeting, onOpenChange]
  );

  const handleSaveInterview = useCallback(
    async (data: {
      candidateEmail: string;
      positionId: string;
      stageName: string;
      meetingType: string;
      interviewerUserIds: string[];
    }) => {
      setSaving(true);
      try {
        await onCreateInterview({ ...data, startTime, endTime });
        onOpenChange(false);
      } finally {
        setSaving(false);
      }
    },
    [startTime, endTime, onCreateInterview, onOpenChange]
  );

  if (!selection) return null;

  const dateLabel = new Date(startTime).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor ref={anchorRef} className="absolute" style={{ top: selection.top, left: "50%" }} />
      <PopoverContent
        ref={contentRef}
        side="right"
        align="start"
        sideOffset={8}
        className="w-96 p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Time header */}
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-caption">{dateLabel}</span>
          <Clock className="h-4 w-4 text-muted-foreground ml-1" />
          <span className="text-caption">
            {formatTime(startTime)} – {formatTime(endTime)}
          </span>
        </div>

        {/* Event type tabs */}
        <Tabs
          value={eventType}
          onValueChange={(v) => setEventType(v as QuickCreateEventType)}
          className="gap-0"
        >
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="availability" className="flex-1 text-caption">
              Availability
            </TabsTrigger>
            <TabsTrigger value="meeting" className="flex-1 text-caption">
              Meeting
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex-1 text-caption">
              Interview
            </TabsTrigger>
          </TabsList>

          {/* Availability — minimal, save directly */}
          <TabsContent value="availability" className="p-3">
            <div className="flex flex-col gap-2">
              <p className="text-body text-muted-foreground">
                Mark this time slot as available for scheduling.
              </p>
              <div className="flex justify-between pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMoreOptions?.("availability", { startTime, endTime })}
                >
                  More options
                </Button>
                <Button
                  size="sm"
                  disabled={saving}
                  onClick={handleSaveAvailability}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Meeting form */}
          <TabsContent value="meeting" className="p-3">
            <QuickCreateMeetingForm
              organizationId={organizationId}
              startTime={startTime}
              endTime={endTime}
              defaultAttendeeIds={selectedMemberIds}
              members={members}
              onSave={handleSaveMeeting}
              onMoreOptions={(data) => onMoreOptions?.("meeting", { ...data, startTime, endTime })}
              saving={saving}
            />
          </TabsContent>

          {/* Interview form */}
          <TabsContent value="interview" className="p-3">
            <QuickCreateInterviewForm
              organizationId={organizationId}
              startTime={startTime}
              endTime={endTime}
              defaultInterviewerIds={selectedMemberIds}
              members={members}
              onSave={handleSaveInterview}
              onMoreOptions={(data) => onMoreOptions?.("interview", { ...data, startTime, endTime })}
              saving={saving}
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
