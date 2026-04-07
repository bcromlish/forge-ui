"use client";

import { useState, useCallback, useMemo } from "react";
import { Video, Phone, MapPin, Layers } from "lucide-react";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";
import { Label } from "../../primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../primitives/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../primitives/toggle-group";
// TODO: Replace with prop-based API
// import { usePositions } from "@/features/positions/hooks";
// TODO: Replace with prop-based API
// import { useCandidateSearch } from "@/features/candidates/hooks";
// TODO: Replace with prop-based API
// import type { Id } from "@/convex/_generated/dataModel";

const MEETING_TYPE_OPTIONS = [
  { value: "video", label: "Online", icon: Video },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "in_person", label: "In Person", icon: MapPin },
  { value: "hybrid", label: "Hybrid", icon: Layers },
] as const;

/** Props for {@link QuickCreateInterviewForm}. */
interface QuickCreateInterviewFormProps {
  organizationId: Id<"organizations">;
  startTime: number;
  endTime: number;
  defaultInterviewerIds: string[];
  members: { _id: string; name: string }[];
  onSave: (data: {
    candidateEmail: string;
    positionId: string;
    stageName: string;
    meetingType: string;
    interviewerUserIds: string[];
  }) => void;
  onMoreOptions: (data: {
    candidateEmail: string;
    positionId: string;
    stageName: string;
    meetingType: string;
    interviewerUserIds: string[];
  }) => void;
  saving?: boolean;
}

/**
 * Interview form for the calendar quick-create popover.
 * Candidate email search, position/stage select, meeting type, interviewers.
 */
export function QuickCreateInterviewForm({
  organizationId,
  defaultInterviewerIds,
  members,
  onSave,
  onMoreOptions,
  saving,
}: QuickCreateInterviewFormProps) {
  const [candidateEmail, setCandidateEmail] = useState("");
  const [positionId, setPositionId] = useState("");
  const [meetingType, setMeetingType] = useState("video");
  const [selectedInterviewerIds, setSelectedInterviewerIds] = useState<Set<string>>(
    () => new Set(defaultInterviewerIds)
  );

  // Candidate email search — debounced via query skip
  const searchQuery = candidateEmail.length >= 3 ? candidateEmail : undefined;
  const candidateResults = useCandidateSearch(organizationId, searchQuery, 5);

  // Positions for this org
  const positions = usePositions(organizationId, "active");

  // Auto-select first stage from selected position
  const selectedPosition = useMemo(
    () => positions?.find((p) => p._id === positionId),
    [positions, positionId]
  );
  const stageName = selectedPosition?.stages?.[0]?.name ?? "";

  const formData = useCallback(
    () => ({
      candidateEmail: candidateEmail.trim().toLowerCase(),
      positionId,
      stageName,
      meetingType,
      interviewerUserIds: Array.from(selectedInterviewerIds),
    }),
    [candidateEmail, positionId, stageName, meetingType, selectedInterviewerIds]
  );

  const canSave =
    candidateEmail.trim().includes("@") &&
    positionId.length > 0 &&
    selectedInterviewerIds.size > 0;

  const toggleInterviewer = useCallback((id: string) => {
    setSelectedInterviewerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Candidate email */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="candidate-email" className="text-caption">
          Candidate email
        </Label>
        <Input
          id="candidate-email"
          type="email"
          placeholder="candidate@example.com"
          value={candidateEmail}
          onChange={(e) => setCandidateEmail(e.target.value)}
        />
        {candidateResults && candidateResults.length > 0 && (
          <div className="flex flex-col rounded-md border bg-popover text-caption">
            {candidateResults.map((c) => (
              <button
                key={c._id}
                type="button"
                className="px-2 py-1 text-left hover:bg-accent truncate"
                onClick={() => setCandidateEmail(c.email)}
              >
                {c.name} — {c.email}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Position */}
      <div className="flex flex-col gap-1">
        <Label className="text-caption">Position</Label>
        <Select value={positionId} onValueChange={setPositionId}>
          <SelectTrigger>
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {(positions ?? []).map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {stageName && (
          <p className="text-caption text-muted-foreground">
            Stage: {stageName.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
          </p>
        )}
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

      {/* Interviewers */}
      {members.length > 0 && (
        <div className="flex flex-col gap-1">
          <Label className="text-caption">Interviewers</Label>
          <div className="flex flex-wrap gap-1">
            {members.map((m) => (
              <button
                key={m._id}
                type="button"
                onClick={() => toggleInterviewer(m._id)}
                className={`rounded-full px-2 py-0.5 text-caption border transition-colors ${
                  selectedInterviewerIds.has(m._id)
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
