"use client";

import { useState, useCallback } from "react";
import { Video, Phone, MapPin, Layers, Plus, X } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "../../primitives/sheet";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";
import { Label } from "../../primitives/label";
import { Textarea } from "../../primitives/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../primitives/select";
import { ToggleGroup, ToggleGroupItem } from "../../primitives/toggle-group";
import { formatTime } from "../../types/calendar-utils";

const MEETING_TYPE_OPTIONS = [
  { value: "video", label: "Online", icon: Video },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "in_person", label: "In Person", icon: MapPin },
  { value: "hybrid", label: "Hybrid", icon: Layers },
] as const;

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

interface MeetingFormInitialValues {
  title?: string;
  startTime: number;
  endTime: number;
  meetingType?: string;
  attendeeUserIds?: string[];
  guestEmails?: string[];
}

interface CalendarEventFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: MeetingFormInitialValues | null;
  members: { _id: string; name: string }[];
  onSave: (data: {
    title: string;
    description?: string;
    startTime: number;
    endTime: number;
    meetingType: string;
    meetingLink?: string;
    location?: string;
    attendeeUserIds: string[];
    guestEmails: string[];
    notes?: string;
  }) => Promise<void>;
}

export function CalendarEventFormSheet({
  open, onOpenChange, initialValues, members, onSave,
}: CalendarEventFormSheetProps) {
  const init = initialValues;
  const [title, setTitle] = useState(init?.title ?? "");
  const [description, setDescription] = useState("");
  const [meetingType, setMeetingType] = useState(init?.meetingType ?? "video");
  const [meetingLink, setMeetingLink] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState(() => {
    if (!init) return 60;
    return Math.round((init.endTime - init.startTime) / 60000);
  });
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(
    () => new Set(init?.attendeeUserIds ?? [])
  );
  const [guestEmail, setGuestEmail] = useState("");
  const [guestEmails, setGuestEmails] = useState<string[]>(() => init?.guestEmails ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const startTime = init?.startTime ?? 0;
  const endTime = startTime + duration * 60000;

  const toggleMember = useCallback((id: string) => {
    setSelectedMemberIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleAddGuest = useCallback(() => {
    const email = guestEmail.trim().toLowerCase();
    if (email && email.includes("@") && !guestEmails.includes(email)) {
      setGuestEmails((prev) => [...prev, email]);
      setGuestEmail("");
    }
  }, [guestEmail, guestEmails]);

  const handleSave = useCallback(async () => {
    setError("");
    if (!title.trim()) { setError("Title is required"); return; }
    setSaving(true);
    try {
      await onSave({
        title: title.trim(), description: description.trim() || undefined,
        startTime, endTime, meetingType,
        meetingLink: meetingLink.trim() || undefined,
        location: location.trim() || undefined,
        attendeeUserIds: Array.from(selectedMemberIds),
        guestEmails, notes: notes.trim() || undefined,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create meeting");
    } finally { setSaving(false); }
  }, [title, description, startTime, endTime, meetingType, meetingLink, location, selectedMemberIds, guestEmails, notes, onSave, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader><SheetTitle>New Meeting</SheetTitle></SheetHeader>
        <div className="flex flex-col gap-4 px-6 pt-4">
          {error && <p className="text-body text-destructive">{error}</p>}
          {init && (
            <p className="text-caption text-muted-foreground">
              {new Date(startTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              {" "}{formatTime(startTime)} – {formatTime(endTime)}
            </p>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sheet-title">Title</Label>
            <Input id="sheet-title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sheet-desc">Description</Label>
            <Textarea id="sheet-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Duration</Label>
              <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((d) => (<SelectItem key={d} value={String(d)}>{d} min</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Type</Label>
              <ToggleGroup type="single" value={meetingType} onValueChange={(v) => v && setMeetingType(v)} variant="outline" size="sm">
                {MEETING_TYPE_OPTIONS.map((opt) => (<ToggleGroupItem key={opt.value} value={opt.value} title={opt.label}><opt.icon className="h-4 w-4" /></ToggleGroupItem>))}
              </ToggleGroup>
            </div>
          </div>
          {(meetingType === "video" || meetingType === "hybrid") && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sheet-link">Meeting Link</Label>
              <Input id="sheet-link" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://meet.example.com/..." />
            </div>
          )}
          {(meetingType === "in_person" || meetingType === "hybrid") && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sheet-loc">Location</Label>
              <Input id="sheet-loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="123 Main St, Room 4A" />
            </div>
          )}
          {members.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label>Attendees</Label>
              <div className="flex flex-wrap gap-1">
                {members.map((m) => (
                  <button key={m._id} type="button" onClick={() => toggleMember(m._id)}
                    className={`rounded-full px-2 py-0.5 text-caption border transition-colors ${selectedMemberIds.has(m._id) ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-transparent text-muted-foreground hover:border-border"}`}>{m.name}</button>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label>Guest Emails</Label>
            {guestEmails.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {guestEmails.map((email) => (
                  <span key={email} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-caption">
                    {email}
                    <button type="button" onClick={() => setGuestEmails((prev) => prev.filter((e) => e !== email))} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-1">
              <Input placeholder="guest@example.com" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddGuest(); } }} className="flex-1" />
              <Button type="button" variant="ghost" size="icon" onClick={handleAddGuest} disabled={!guestEmail.trim()}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sheet-notes">Notes</Label>
            <Textarea id="sheet-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
          <div className="flex gap-2 pt-2 border-t">
            <Button disabled={saving} onClick={handleSave}>{saving ? "Saving..." : "Create Meeting"}</Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
