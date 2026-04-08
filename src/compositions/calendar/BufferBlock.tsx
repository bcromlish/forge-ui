/**
 * Buffer block for calendar views -- narrow muted bar between segments.
 */
"use client";

import { cn } from "../../lib/utils";
import { X, RotateCcw } from "lucide-react";
import type { CalendarEvent } from "../../types/calendar";
import { formatTime } from "../../types/calendar-utils";

/** Props for {@link BufferBlock}. */
interface BufferBlockProps {
  event: CalendarEvent;
  /** Height in pixels -- determines detail level. */
  height?: number;
  /** Called when user dismisses the buffer from their calendar. */
  onDismiss?: (segmentId: string) => void;
  /** Called when user restores a previously dismissed buffer. */
  onRestore?: (segmentId: string) => void;
  /** Whether this buffer has been dismissed by the current user. */
  isDismissed?: boolean;
  className?: string;
}

/**
 * Narrow muted bar rendered between interview/meeting segments.
 * Shows buffer duration with dismiss/restore toggle.
 */
export function BufferBlock({
  event,
  height = 24,
  onDismiss,
  onRestore,
  isDismissed,
  className,
}: BufferBlockProps) {
  const isTrailing = event.segment?.bufferType === "trailing";
  const segmentId = event.segment?.segmentId;
  const isCompact = height < 20;

  if (isDismissed) {
    return (
      <button
        onClick={() => segmentId && onRestore?.(segmentId)}
        className={cn(
          "w-full h-full rounded-sm border border-dashed px-1.5",
          "border-muted-foreground/20 bg-muted/30 opacity-50",
          "hover:opacity-80 transition-opacity",
          "flex items-center gap-1",
          className
        )}
      >
        <RotateCcw className="h-3 w-3 shrink-0 text-muted-foreground" />
        {!isCompact && (
          <span className="truncate text-caption text-muted-foreground">
            Restore buffer
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "w-full h-full rounded-sm border px-1.5",
        isTrailing
          ? "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20"
          : "border-muted-foreground/20 bg-muted/40",
        "flex items-center justify-between gap-1",
        className
      )}
    >
      <div className="flex items-center gap-1 min-w-0">
        {!isCompact && (
          <span className={cn(
            "truncate text-caption font-medium",
            isTrailing
              ? "text-amber-700 dark:text-amber-300"
              : "text-muted-foreground"
          )}>
            {event.title}
          </span>
        )}
        {!isCompact && (
          <span className={cn(
            "text-caption shrink-0",
            isTrailing
              ? "text-amber-600/70 dark:text-amber-400/70"
              : "text-muted-foreground/70"
          )}>
            {formatTime(event.startTime)} – {formatTime(event.endTime)}
          </span>
        )}
      </div>
      {segmentId && onDismiss && (
        <button
          onClick={() => onDismiss(segmentId)}
          className={cn(
            "shrink-0 rounded-sm p-0.5",
            "hover:bg-muted-foreground/10 transition-colors",
            "text-muted-foreground/60 hover:text-muted-foreground"
          )}
          title="Remove buffer from your calendar"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
