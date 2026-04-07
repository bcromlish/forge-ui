/**
 * Interactive Agenda & Notes section for meeting/interview detail panels.
 * Reads notes via useMeetingNotes and allows adding new notes.
 * Renders in a well container with user avatars beside each item.
 *
 * @see features/meetings/hooks.ts for data hooks
 * @see convex/meetingNotes.ts for backend
 */
"use client";

import { useState, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";
import { Avatar, AvatarFallback } from "../../primitives/avatar";
// TODO: Replace with prop-based API
// import { useMeetingNotes, useCreateMeetingNote } from "@/features/meetings/hooks";
// TODO: Replace with prop-based API
// import type { Id } from "@/convex/_generated/dataModel";
import { getInitials } from "./calendar-event-helpers";

/** Props for {@link AgendaNotesSection}. */
interface AgendaNotesSectionProps {
  organizationId: string;
  meetingId?: string;
  interviewId?: string;
  /** Resolved user names by ID — used for avatar initials. */
  userNames?: Map<string, string>;
}

/** Interactive agenda & notes section with real-time note list and add input. */
export function AgendaNotesSection({
  organizationId,
  meetingId,
  interviewId,
  userNames,
}: AgendaNotesSectionProps) {
  const notes = useMeetingNotes(
    organizationId as Id<"organizations">,
    {
      meetingId: meetingId as Id<"meetings"> | undefined,
      interviewId: interviewId as Id<"interviews"> | undefined,
    }
  );
  const createNote = useCreateMeetingNote();
  const [newNote, setNewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const content = newNote.trim();
    if (!content || submitting) return;

    setSubmitting(true);
    try {
      const nextOrder = (notes?.length ?? 0);
      await createNote({
        organizationId: organizationId as Id<"organizations">,
        ...(meetingId ? { meetingId: meetingId as Id<"meetings"> } : {}),
        ...(interviewId ? { interviewId: interviewId as Id<"interviews"> } : {}),
        type: "note",
        content,
        order: nextOrder,
      });
      setNewNote("");
    } finally {
      setSubmitting(false);
    }
  }, [newNote, submitting, notes, createNote, organizationId, meetingId, interviewId]);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-body font-medium">Agenda & Notes</span>

      <div className="rounded-lg bg-muted/40 p-4 flex flex-col gap-3">
        {/* Notes list with user avatars */}
        {notes && notes.length > 0 && (
          <div className="flex flex-col gap-3">
            {notes.map((note) => {
              const authorName = userNames?.get(note.createdBy as string) ?? "User";
              return (
                <div key={note._id} className="flex items-start gap-3">
                  <Avatar size="xs" className="shrink-0 mt-0.5">
                    <AvatarFallback name={authorName}>
                      {getInitials(authorName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-body">{note.content}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Add note input */}
        <div className="flex gap-1">
          <Input
            placeholder="Add a note or comment..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void handleSubmit();
              }
            }}
            className="flex-1 bg-white dark:bg-background"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => void handleSubmit()}
            disabled={!newNote.trim() || submitting}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
