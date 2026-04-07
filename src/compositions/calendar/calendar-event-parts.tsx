/**
 * Shared sub-components and constants for calendar event detail panels.
 * Used by InterviewEventDetail, MeetingEventDetail, and CalendarEventDetail.
 *
 * @see ./AttendeesSection.tsx for attendees + RSVP components (extracted for file-size limit)
 */
"use client";

import {
  Video,
  Phone,
  MapPin,
  Monitor,
  Layers,
} from "lucide-react";
import { Badge } from "../../primitives/badge";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const MEETING_TYPE_LABELS: Record<string, string> = {
  video: "Online",
  phone: "Phone",
  in_person: "In Person",
  async_video: "Async Video",
  hybrid: "Hybrid",
};

export const MEETING_ICONS: Record<string, React.ReactNode> = {
  video: <Video className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  in_person: <MapPin className="h-4 w-4" />,
  async_video: <Monitor className="h-4 w-4" />,
  hybrid: <Layers className="h-4 w-4" />,
};

const EVENT_TYPE_CHIP: Record<string, { label: string; className: string }> = {
  interview: {
    label: "INTERVIEW",
    className: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  },
  meeting: {
    label: "MEETING",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  },
  availability: {
    label: "AVAILABILITY",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
};

export const VISIBILITY_LABEL: Record<string, string> = {
  internal: "Internal",
  private: "Private",
  public: "Public",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Compact inline metadata item (icon + text). Used in AvailabilityEventDetail. */
export function MetaItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
      <span className="shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

/** Single column in a MetaGrid. */
interface MetaGridColumn {
  icon: React.ReactNode;
  label: string;
  value: string;
}

/** Structured metadata grid with icon → label → value columns. Matches reference design. */
export function MetaGrid({ columns }: { columns: MetaGridColumn[] }) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
    >
      {columns.map((col) => (
        <div key={col.label} className="flex flex-col items-center gap-1 text-center">
          <span className="text-muted-foreground">{col.icon}</span>
          <span className="text-caption text-muted-foreground">{col.label}</span>
          <span className="text-body font-medium">{col.value}</span>
        </div>
      ))}
    </div>
  );
}

/** Event type badge chip (MEETING / INTERVIEW / AVAILABILITY). */
export function EventTypeChip({ type }: { type: string }) {
  const config = EVENT_TYPE_CHIP[type] ?? EVENT_TYPE_CHIP.meeting!;
  return (
    <Badge
      variant="secondary"
      className={`text-caption font-semibold tracking-wider ${config!.className}`}
    >
      {config!.label}
    </Badge>
  );
}

/** Icon + label + value detail row. */
export function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="text-muted-foreground pt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-caption text-muted-foreground">{label}</p>
        <div className="text-body">{children}</div>
      </div>
    </div>
  );
}

// Re-export AttendeesSection from its own file for backward-compatible imports
export { AttendeesSection } from "./AttendeesSection";
