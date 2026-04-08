/**
 * Interactive Agenda & Notes section for meeting/interview detail panels.
 * All data and mutation callbacks provided via props.
 */
"use client";

import { useState, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";
import { Avatar, AvatarFallback } from "../../primitives/avatar";
import { getInitials } from "./calendar-event-helpers";

/** A single note entry. */
export interface NoteEntry {
  _id: string;
  content: string;
  createdBy: string;
}

/** Props for {@link AgendaNotesSection}. */
interface AgendaNotesSectionProps {
  organizationId: string;
  meetingId?: string;
  interviewId?: string;
  /** Resolved user names by ID -- used for avatar initials. */
  userNames?: Map<string, string>;
  /** Existing notes to display. */
  notes?: NoteEntry[];
  /** Callback to create a new note. */
  onCreateNote?: (data: {
    organizationId: string;
    meetingId?: string;
    interviewId?: string;
    type: string;
    content: string;
    order: number;
  }) => Promise<void>;
}

/** Interactive agenda & notes section with real-time note list and add input. */
export function AgendaNotesSection({
  organizationId,
  meetingId,
  interviewId,
  userNames,
  notes = [],
  onCreateNote,
}: AgendaNotesSectionProps) {
  const [newNote, setNewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const content = newNote.trim();
    if (!content || submitting || !onCreateNote) return;

    setSubmitting(true);
    try {
      await onCreateNote({
        organizationId,
        ...(meetingId ? { meetingId } : {}),
        ...(interviewId ? { interviewId } : {}),
        type: "note",
        content,
        order: notes.length,
      });
      setNewNote("");
    } finally {
      setSubmitting(false);
    }
  }, [newNote, submitting, notes, onCreateNote, organizationId, meetingId, interviewId]);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-body font-medium">Agenda & Notes</span>
      <div className="rounded-lg bg-muted/40 p-4 flex flex-col gap-3">
        {notes.length > 0 && (
          <div className="flex flex-col gap-3">
            {notes.map((note) => {
              const authorName = userNames?.get(note.createdBy) ?? "User";
              return (
                <div key={note._id} className="flex items-start gap-3">
                  <Avatar size="xs" className="shrink-0 mt-0.5">
                    <AvatarFallback name={authorName}>{getInitials(authorName)}</AvatarFallback>
                  </Avatar>
                  <span className="text-body">{note.content}</span>
                </div>
              );
            })}
          </div>
        )}
        {onCreateNote && (
          <div className="flex gap-1">
            <Input
              placeholder="Add a note or comment..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleSubmit(); } }}
              className="flex-1 bg-white dark:bg-background"
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => void handleSubmit()} disabled={!newNote.trim() || submitting}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
