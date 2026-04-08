"use client";

import { useState, useCallback, useMemo } from "react";
import { Video, Phone, MapPin, Layers } from "lucide-react";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";
import { Label } from "../../primitives/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../primitives/select";
import { ToggleGroup, ToggleGroupItem } from "../../primitives/toggle-group";

const MEETING_TYPE_OPTIONS = [
  { value: "video", label: "Online", icon: Video },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "in_person", label: "In Person", icon: MapPin },
  { value: "hybrid", label: "Hybrid", icon: Layers },
] as const;

/** A position option for the interview form. */
export interface PositionOption {
  _id: string;
  title: string;
  stages?: { name: string }[];
}

/** A candidate search result. */
export interface CandidateResult {
  _id: string;
  name: string;
  email: string;
}

interface QuickCreateInterviewFormProps {
  organizationId: string;
  startTime: number;
  endTime: number;
  defaultInterviewerIds: string[];
  members: { _id: string; name: string }[];
  onSave: (data: { candidateEmail: string; positionId: string; stageName: string; meetingType: string; interviewerUserIds: string[] }) => void;
  onMoreOptions: (data: { candidateEmail: string; positionId: string; stageName: string; meetingType: string; interviewerUserIds: string[] }) => void;
  saving?: boolean;
  /** Available positions for the dropdown. */
  positions?: PositionOption[];
  /** Candidate search results for typeahead. */
  candidateResults?: CandidateResult[];
}

export function QuickCreateInterviewForm({
  defaultInterviewerIds, members, onSave, onMoreOptions, saving,
  positions = [], candidateResults = [],
}: QuickCreateInterviewFormProps) {
  const [candidateEmail, setCandidateEmail] = useState("");
  const [positionId, setPositionId] = useState("");
  const [meetingType, setMeetingType] = useState("video");
  const [selectedInterviewerIds, setSelectedInterviewerIds] = useState<Set<string>>(() => new Set(defaultInterviewerIds));

  const selectedPosition = useMemo(() => positions.find((p) => p._id === positionId), [positions, positionId]);
  const stageName = selectedPosition?.stages?.[0]?.name ?? "";

  const formData = useCallback(() => ({
    candidateEmail: candidateEmail.trim().toLowerCase(), positionId, stageName, meetingType,
    interviewerUserIds: Array.from(selectedInterviewerIds),
  }), [candidateEmail, positionId, stageName, meetingType, selectedInterviewerIds]);

  const canSave = candidateEmail.trim().includes("@") && positionId.length > 0 && selectedInterviewerIds.size > 0;

  const toggleInterviewer = useCallback((id: string) => {
    setSelectedInterviewerIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="candidate-email" className="text-caption">Candidate email</Label>
        <Input id="candidate-email" type="email" placeholder="candidate@example.com" value={candidateEmail} onChange={(e) => setCandidateEmail(e.target.value)} />
        {candidateResults.length > 0 && (
          <div className="flex flex-col rounded-md border bg-popover text-caption">
            {candidateResults.map((c) => (
              <button key={c._id} type="button" className="px-2 py-1 text-left hover:bg-accent truncate" onClick={() => setCandidateEmail(c.email)}>
                {c.name} — {c.email}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-caption">Position</Label>
        <Select value={positionId} onValueChange={setPositionId}>
          <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
          <SelectContent>
            {positions.map((p) => (<SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>))}
          </SelectContent>
        </Select>
        {stageName && (
          <p className="text-caption text-muted-foreground">
            Stage: {stageName.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label className="text-caption">Type</Label>
        <ToggleGroup type="single" value={meetingType} onValueChange={(v) => v && setMeetingType(v)} variant="outline" size="sm">
          {MEETING_TYPE_OPTIONS.map((opt) => (<ToggleGroupItem key={opt.value} value={opt.value} title={opt.label}><opt.icon className="h-4 w-4" /></ToggleGroupItem>))}
        </ToggleGroup>
      </div>
      {members.length > 0 && (
        <div className="flex flex-col gap-1">
          <Label className="text-caption">Interviewers</Label>
          <div className="flex flex-wrap gap-1">
            {members.map((m) => (
              <button key={m._id} type="button" onClick={() => toggleInterviewer(m._id)}
                className={`rounded-full px-2 py-0.5 text-caption border transition-colors ${selectedInterviewerIds.has(m._id) ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-transparent text-muted-foreground hover:border-border"}`}>{m.name}</button>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-between pt-1 border-t">
        <Button variant="ghost" size="sm" onClick={() => onMoreOptions(formData())}>More options</Button>
        <Button size="sm" disabled={!canSave || saving} onClick={() => onSave(formData())}>{saving ? "Saving..." : "Save"}</Button>
      </div>
    </div>
  );
}
