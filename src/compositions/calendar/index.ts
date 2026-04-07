// TODO: Calendar compositions are temporarily stubbed.
// They depend on VidCruiter-specific hooks (useInterviewsByDateRange,
// useMeetingsByDateRange, useActiveOrganization, etc.) and domain types
// (CalendarEvent, CalendarViewMode, DragSelection).
// These need to be refactored to accept data via props before re-exporting.
//
// Stubbed components: AgendaNotesSection, AttendeesSection, AvailabilityEventDetail,
//   BufferBlock, CalendarDayView, CalendarEventBlock, CalendarEventDetail,
//   CalendarEventFormSheet, CalendarMonthView, CalendarPageContent,
//   CalendarQuickCreate, CalendarToolbar, CalendarWeekView, DayColumnWithDrag,
//   DayRowWithDrag, InterviewEventDetail, MeetingEventDetail,
//   QuickCreateInterviewForm, QuickCreateMeetingForm, RsvpWell,
//   TeamMemberFilter, TodayEvents

// Re-export only framework-independent helpers
export * from './calendar-event-helpers';
export * from './calendar-event-parts';
