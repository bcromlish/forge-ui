/**
 * Slide-over detail panel for a calendar event.
 * Routes to the appropriate detail sub-component based on event type.
 *
 * @see InterviewEventDetail — interview-specific content
 * @see MeetingEventDetail — meeting-specific content
 * @see AvailabilityEventDetail — availability-specific content
 */
"use client";

import { Pencil, MoreHorizontal, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../primitives/sheet";
import { Button } from "../../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../primitives/dropdown-menu";
// TODO: Replace with prop-based API
// import type { CalendarEvent } from "@/types/calendarEvents";
// TODO: Replace with prop-based API
// import { formatTime } from "@/lib/domain/calendar-format";
import { formatEventDate } from "./calendar-event-helpers";
import { EventTypeChip } from "./calendar-event-parts";
import { InterviewEventDetail } from "./InterviewEventDetail";
import { MeetingEventDetail } from "./MeetingEventDetail";
import { AvailabilityEventDetail } from "./AvailabilityEventDetail";

/** Props for {@link CalendarEventDetail}. */
interface CalendarEventDetailProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Resolved user names by ID. */
  userNames?: Map<string, string>;
  /** Current authenticated user's ID. */
  currentUserId?: string;
  /** Organization ID for data queries (notes, etc.). */
  organizationId?: string;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onComplete?: (eventId: string) => void;
  onCancel?: (eventId: string) => void;
  onNoShow?: (eventId: string) => void;
  /** Called when the user changes their RSVP status. */
  onRsvpChange?: (eventId: string, status: string) => void;
}

/**
 * Slide-over detail panel for a calendar event.
 * Shows event type chip, details, join button, agenda/notes, and attendees with RSVP.
 */
export function CalendarEventDetail({
  event,
  open,
  onOpenChange,
  userNames,
  currentUserId,
  organizationId,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
  onNoShow,
  onRsvpChange,
}: CalendarEventDetailProps) {
  if (!event) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto bg-white dark:bg-background">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <EventTypeChip type={event.type} />
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(event.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onDelete && (
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDelete(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <SheetTitle className="text-title-2 pt-2">{event.title}</SheetTitle>
          <p className="text-body text-muted-foreground pb-2">
            {formatEventDate(event.startTime)} &middot;{" "}
            {formatTime(event.startTime)}–{formatTime(event.endTime)}
          </p>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-6 pt-4">
          {event.type === "interview" && event.interview ? (
            <InterviewEventDetail
              event={event}
              userNames={userNames}
              currentUserId={currentUserId}
              organizationId={organizationId}
              onComplete={onComplete}
              onCancel={onCancel}
              onNoShow={onNoShow}
              onRsvpChange={onRsvpChange}
            />
          ) : event.type === "meeting" && event.meeting ? (
            <MeetingEventDetail
              event={event}
              userNames={userNames}
              currentUserId={currentUserId}
              organizationId={organizationId}
              onRsvpChange={onRsvpChange}
            />
          ) : (
            <AvailabilityEventDetail event={event} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
