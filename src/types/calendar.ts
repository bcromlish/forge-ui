/**
 * Generic calendar event types for forge-ui calendar compositions.
 * These replace VidCruiter-specific types with portable interfaces.
 */

/** View mode for the calendar page. */
export type CalendarViewMode = "day" | "week" | "month";

/** Generic calendar event type — covers interviews, meetings, and availability. */
export interface CalendarEvent {
  id: string;
  title: string;
  subtitle?: string;
  type: "interview" | "meeting" | "availability";
  startTime: number;
  endTime: number;
  /** IDs of users associated with this event. */
  userIds: string[];

  /** Interview-specific metadata (present when type === "interview"). */
  interview?: {
    status: string;
    meetingType: string;
    meetingLink?: string;
    positionTitle?: string;
    stageName?: string;
    candidateEmail?: string;
    notes?: string;
    selfScheduleToken?: string;
  };

  /** Interview attendees — separate from meeting attendees for role support. */
  interviewAttendees?: CalendarAttendee[];

  /** Meeting-specific metadata (present when type === "meeting"). */
  meeting?: {
    meetingType: string;
    meetingLink?: string;
    location?: string;
    description?: string;
    visibility?: string;
    attendeeCount: number;
    attendees?: CalendarAttendee[];
    guestEmailCount?: number;
  };

  /** Availability-specific metadata (present when type === "availability"). */
  availability?: {
    timezone: string;
    userName?: string;
    recurrenceType: string;
    isExpanded?: boolean;
  };

  /** Segment metadata for buffer blocks. */
  segment?: {
    isBuffer: boolean;
    segmentId: string;
    bufferType?: "leading" | "trailing";
  };
}

/** An attendee of a calendar event (meeting or interview). */
export interface CalendarAttendee {
  userId: string;
  rsvpStatus: string;
  role?: string;
}

/** Selection result from a calendar drag interaction. */
export interface DragSelection {
  startTime: number;
  endTime: number;
  top: number;
  height: number;
  dayDate: Date;
}

/** A time slot label for the calendar grid. */
export interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}
