"use client";

import { Video, Phone, MapPin, Monitor, Layers, Calendar } from "lucide-react";
import { cn } from "../../lib/utils";
import type { CalendarEvent } from "../../types/calendar";
import { formatTime, getEventColor } from "../../types/calendar-utils";
import { BufferBlock } from "./BufferBlock";

/** Meeting type icons (compact). */
const MEETING_ICONS: Record<string, React.ReactNode> = {
  video: <Video className="h-3 w-3 shrink-0" />,
  phone: <Phone className="h-3 w-3 shrink-0" />,
  in_person: <MapPin className="h-3 w-3 shrink-0" />,
  async_video: <Monitor className="h-3 w-3 shrink-0" />,
  hybrid: <Layers className="h-3 w-3 shrink-0" />,
};

/** Minimal user info for avatar rendering. */
export interface CalendarUserInfo {
  _id: string;
  name: string;
  avatarUrl?: string;
}

/** Props for {@link CalendarEventBlock}. */
interface CalendarEventBlockProps {
  event: CalendarEvent;
  height?: number;
  onClick?: (event: CalendarEvent) => void;
  onBufferDismiss?: (segmentId: string) => void;
  onBufferRestore?: (segmentId: string) => void;
  dismissedBufferSegmentIds?: Set<string>;
  userMap?: Map<string, CalendarUserInfo>;
  className?: string;
}

/**
 * Individual event block for the calendar time grid.
 */
export function CalendarEventBlock({
  event,
  height = 60,
  onClick,
  onBufferDismiss,
  onBufferRestore,
  dismissedBufferSegmentIds,
  userMap,
  className,
}: CalendarEventBlockProps) {
  if (event.segment?.isBuffer) {
    return (
      <BufferBlock
        event={event}
        height={height}
        onDismiss={onBufferDismiss}
        onRestore={onBufferRestore}
        isDismissed={dismissedBufferSegmentIds?.has(event.segment.segmentId)}
        className={className}
      />
    );
  }

  const colors = getEventColor(event.type, event.interview?.status);
  const isCompact = height < 30;
  const isMedium = height >= 30 && height < 50;

  if (event.type === "availability") {
    return (
      <AvailabilityBlock
        event={event} height={height} onClick={onClick}
        colors={colors} userMap={userMap} className={className}
      />
    );
  }

  if (event.type === "meeting") {
    return (
      <MeetingBlock
        event={event} isCompact={isCompact} isMedium={isMedium}
        onClick={onClick} colors={colors} userMap={userMap} className={className}
      />
    );
  }

  return (
    <InterviewBlock
      event={event} isCompact={isCompact} isMedium={isMedium}
      onClick={onClick} colors={colors} userMap={userMap} className={className}
    />
  );
}

function AvailabilityBlock({
  event, height, onClick, colors, userMap, className,
}: {
  event: CalendarEvent; height: number;
  onClick?: (e: CalendarEvent) => void;
  colors: ReturnType<typeof getEventColor>;
  userMap?: Map<string, CalendarUserInfo>; className?: string;
}) {
  const isCompact = height < 30;
  return (
    <button
      onClick={() => onClick?.(event)}
      className={cn(
        "w-full h-full rounded-sm border border-dashed px-1.5 py-0.5 text-left",
        colors.bg, colors.border, colors.text,
        "hover:brightness-95 dark:hover:brightness-110 transition-all",
        className
      )}
      style={{
        background:
          "repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(101, 130, 48, 0.12) 4px, rgba(101, 130, 48, 0.12) 8px)",
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <p className="truncate text-caption font-medium">
          {event.subtitle ?? "Available"}
        </p>
        <EventAvatarStack userIds={event.userIds} userMap={userMap} />
      </div>
      {!isCompact && (
        <p className="truncate text-caption opacity-80">
          {formatTime(event.startTime)} – {formatTime(event.endTime)}
        </p>
      )}
    </button>
  );
}

function MeetingBlock({
  event, isCompact, isMedium, onClick, colors, userMap, className,
}: {
  event: CalendarEvent; isCompact: boolean; isMedium: boolean;
  onClick?: (e: CalendarEvent) => void;
  colors: ReturnType<typeof getEventColor>;
  userMap?: Map<string, CalendarUserInfo>; className?: string;
}) {
  return (
    <button
      onClick={() => onClick?.(event)}
      className={cn(
        "w-full rounded-sm border border-l-2 border-l-fuchsia-500 dark:border-l-fuchsia-400",
        "px-1.5 py-0.5 text-left",
        colors.bg, colors.border, colors.text,
        "hover:brightness-95 dark:hover:brightness-110 transition-all",
        className
      )}
    >
      <div className="flex items-center gap-1 min-w-0">
        <Calendar className="h-3 w-3 shrink-0 text-fuchsia-600 dark:text-fuchsia-400" />
        <p className="truncate text-caption font-medium flex-1">{event.title}</p>
        <EventAvatarStack userIds={event.userIds} userMap={userMap} />
      </div>
      {!isCompact && (
        <p className="truncate text-signal-2 font-normal opacity-90">
          {formatTime(event.startTime)} – {formatTime(event.endTime)}
        </p>
      )}
      {!isCompact && !isMedium && event.meeting && event.meeting.attendeeCount > 1 && !userMap && (
        <div className="flex items-center gap-1 text-signal-2 font-normal opacity-80">
          {event.meeting.attendeeCount}
        </div>
      )}
    </button>
  );
}

function InterviewBlock({
  event, isCompact, isMedium, onClick, colors, userMap, className,
}: {
  event: CalendarEvent; isCompact: boolean; isMedium: boolean;
  onClick?: (e: CalendarEvent) => void;
  colors: ReturnType<typeof getEventColor>;
  userMap?: Map<string, CalendarUserInfo>; className?: string;
}) {
  const borderColor =
    event.interview?.status === "cancelled" || event.interview?.status === "no_show"
      ? "border-l-red-500 dark:border-l-red-400"
      : event.interview?.status === "completed"
        ? "border-l-green-500 dark:border-l-green-400"
        : "border-l-indigo-500 dark:border-l-indigo-400";

  return (
    <button
      onClick={() => onClick?.(event)}
      className={cn(
        "w-full rounded-sm border border-l-2 px-1.5 py-0.5 text-left",
        borderColor, colors.bg, colors.border, colors.text,
        "hover:brightness-95 dark:hover:brightness-110 transition-all",
        className
      )}
    >
      <div className="flex items-center gap-1 min-w-0">
        {event.interview && MEETING_ICONS[event.interview.meetingType]}
        <p className="truncate text-caption font-medium flex-1">{event.title}</p>
        <EventAvatarStack userIds={event.userIds} userMap={userMap} />
      </div>
      {!isCompact && (
        <p className="truncate text-caption opacity-90">
          {formatTime(event.startTime)} – {formatTime(event.endTime)}
        </p>
      )}
      {!isCompact && !isMedium && event.subtitle && (
        <p className="truncate text-caption opacity-80">{event.subtitle}</p>
      )}
    </button>
  );
}

const MAX_VISIBLE_AVATARS = 2;

function EventAvatarStack({
  userIds,
  userMap,
}: {
  userIds: string[];
  userMap?: Map<string, CalendarUserInfo>;
}) {
  if (!userMap || userIds.length === 0) return null;
  const users = userIds.map((id) => userMap.get(id)).filter((u): u is CalendarUserInfo => u !== undefined);
  if (users.length === 0) return null;
  const visible = users.slice(0, MAX_VISIBLE_AVATARS);
  const overflow = users.length - MAX_VISIBLE_AVATARS;

  return (
    <div className="flex -space-x-1.5 shrink-0">
      {visible.map((user) => (
        <MiniAvatar key={user._id} name={user.name} avatarUrl={user.avatarUrl} />
      ))}
      {overflow > 0 && (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-signal-2 font-medium ring-1 ring-white dark:ring-gray-900">
          +{overflow}
        </span>
      )}
    </div>
  );
}

function MiniAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  if (avatarUrl) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img src={avatarUrl} alt={name} className="h-4 w-4 rounded-full object-cover ring-1 ring-white dark:ring-gray-900" />
    );
  }
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-signal-2 font-medium ring-1 ring-white dark:ring-gray-900" title={name}>
      {initials}
    </span>
  );
}
