"use client";

import { useState, useCallback } from "react";
import { Video, Phone, MapPin, Layers, Plus, X } from "lucide-react";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";
import { Label } from "../../primitives/label";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../primitives/toggle-group";
// TODO: Replace with prop-based API
// import type { Id } from "@/convex/_generated/dataModel";

/** Meeting type option for the icon button group. */
const MEETING_TYPE_OPTIONS = [
  { value: "video", label: "Online", icon: Video },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "in_person", label: "In Person", icon: MapPin },
  { value: "hybrid", label: "Hybrid", icon: Layers },
] as const;

/** Props for {@link QuickCreateMeetingForm}. */
interface QuickCreateMeetingFormProps {
  organizationId: Id<"organizations">;
  startTime: number;
  endTime: number;
  defaultAttendeeIds: string[];
  members: { _id: string; name: string }[];
  onSave: (data: {
    title: string;
    meetingType: string;
    attendeeUserIds: string[];
    guestEmails: string[];
  }) => void;
  onMoreOptions: (data: {
    title: string;
    meetingType: string;
    attendeeUserIds: string[];
    guestEmails: string[];
  }) => void;
  saving?: boolean;
}

/**
 * Meeting form for the calendar quick-create popover.
 * Minimal fields: title, meeting type, attendees, guest emails.
 */
export function QuickCreateMeetingForm({
  defaultAttendeeIds,
  members,
  onSave,
  onMoreOptions,
  saving,
}: QuickCreateMeetingFormProps) {
  const [title, setTitle] = useState("");
  const [meetingType, setMeetingType] = useState("video");
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(
    () => new Set(defaultAttendeeIds)
  );
  const [guestEmail, setGuestEmail] = useState("");
  const [guestEmails, setGuestEmails] = useState<string[]>([]);

  const formData = useCallback(
    () => ({
      title: title.trim(),
      meetingType,
      attendeeUserIds: Array.from(selectedMemberIds),
      guestEmails,
    }),
    [title, meetingType, selectedMemberIds, guestEmails]
  );

  const canSave = title.trim().length > 0;

  const handleAddGuest = useCallback(() => {
    const email = guestEmail.trim().toLowerCase();
    if (email && email.includes("@") && !guestEmails.includes(email)) {
      setGuestEmails((prev) => [...prev, email]);
      setGuestEmail("");
    }
  }, [guestEmail, guestEmails]);

  const toggleMember = useCallback((id: string) => {
    setSelectedMemberIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="meeting-title" className="text-caption">
          Title
        </Label>
        <Input
          id="meeting-title"
          placeholder="Team sync, debrief..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Meeting type */}
      <div className="flex flex-col gap-1">
        <Label className="text-caption">Type</Label>
        <ToggleGroup
          type="single"
          value={meetingType}
          onValueChange={(v) => v && setMeetingType(v)}
          variant="outline"
          size="sm"
        >
          {MEETING_TYPE_OPTIONS.map((opt) => (
            <ToggleGroupItem key={opt.value} value={opt.value} title={opt.label}>
              <opt.icon className="h-4 w-4" />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Attendees — simple checkbox list of org members */}
      {members.length > 0 && (
        <div className="flex flex-col gap-1">
          <Label className="text-caption">Attendees</Label>
          <div className="flex flex-wrap gap-1">
            {members.map((m) => (
              <button
                key={m._id}
                type="button"
                onClick={() => toggleMember(m._id)}
                className={`rounded-full px-2 py-0.5 text-caption border transition-colors ${
                  selectedMemberIds.has(m._id)
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted border-transparent text-muted-foreground hover:border-border"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Guest emails */}
      <div className="flex flex-col gap-1">
        <Label className="text-caption">Guests</Label>
        {guestEmails.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {guestEmails.map((email) => (
              <span
                key={email}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-caption"
              >
                {email}
                <button
                  type="button"
                  onClick={() =>
                    setGuestEmails((prev) => prev.filter((e) => e !== email))
                  }
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-1">
          <Input
            placeholder="guest@example.com"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddGuest();
              }
            }}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleAddGuest}
            disabled={!guestEmail.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-1 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMoreOptions(formData())}
        >
          More options
        </Button>
        <Button
          size="sm"
          disabled={!canSave || saving}
          onClick={() => onSave(formData())}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
