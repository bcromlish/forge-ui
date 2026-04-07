import { Badge } from "../primitives/badge";
import { cn } from "../lib/utils";

/** Status values supported by the StatusBadge component. */
export type StatusBadgeStatus =
  | "draft"
  | "active"
  | "paused"
  | "closed"
  | "archived"
  | "pending_approval"
  | "approved"
  | "partially_filled"
  | "filled"
  | "cancelled"
  | "hired"
  | "rejected"
  | "withdrawn"
  | "on_hold"
  | "pending_schedule"
  | "scheduled"
  | "completed"
  | "no_show"
  | "sent"
  | "accepted"
  | "declined"
  | "expired"
  | "submitted"
  | "revised"
  | "candidate_requested"
  | "rescheduled"
  | "viewed"
  | "countered"
  | "advanced"
  | "published";

const STATUS_STYLES: Record<string, string> = {
  // Pipeline/position statuses
  draft: "bg-status-draft/15 text-status-draft border-status-draft/25",
  active: "bg-status-active/15 text-status-active border-status-active/25",
  paused: "bg-status-paused/15 text-status-paused border-status-paused/25",
  closed: "bg-status-closed/15 text-status-closed border-status-closed/25",
  archived: "bg-status-archived/15 text-status-archived border-status-archived/25",
  // Requisition statuses
  pending_approval: "bg-status-paused/15 text-status-paused border-status-paused/25",
  approved: "bg-status-active/15 text-status-active border-status-active/25",
  partially_filled: "bg-status-paused/15 text-status-paused border-status-paused/25",
  filled: "bg-status-active/15 text-status-active border-status-active/25",
  cancelled: "bg-status-closed/15 text-status-closed border-status-closed/25",
  // Application statuses
  hired: "bg-status-active/15 text-status-active border-status-active/25",
  rejected: "bg-status-closed/15 text-status-closed border-status-closed/25",
  withdrawn: "bg-status-archived/15 text-status-archived border-status-archived/25",
  on_hold: "bg-status-paused/15 text-status-paused border-status-paused/25",
  // Interview statuses
  pending_schedule: "bg-status-draft/15 text-status-draft border-status-draft/25",
  scheduled: "bg-status-active/15 text-status-active border-status-active/25",
  completed: "bg-status-active/15 text-status-active border-status-active/25",
  no_show: "bg-status-closed/15 text-status-closed border-status-closed/25",
  // Offer statuses
  sent: "bg-status-paused/15 text-status-paused border-status-paused/25",
  accepted: "bg-status-active/15 text-status-active border-status-active/25",
  declined: "bg-status-closed/15 text-status-closed border-status-closed/25",
  expired: "bg-status-archived/15 text-status-archived border-status-archived/25",
  viewed: "bg-status-paused/15 text-status-paused border-status-paused/25",
  countered: "bg-status-paused/15 text-status-paused border-status-paused/25",
  // Evaluation statuses
  submitted: "bg-status-active/15 text-status-active border-status-active/25",
  revised: "bg-status-paused/15 text-status-paused border-status-paused/25",
  // Additional interview statuses
  candidate_requested: "bg-status-paused/15 text-status-paused border-status-paused/25",
  rescheduled: "bg-status-paused/15 text-status-paused border-status-paused/25",
  // Form statuses
  published: "bg-status-active/15 text-status-active border-status-active/25",
  // Stage outcome
  advanced: "bg-status-active/15 text-status-active border-status-active/25",
};

/** Format a status string for display: "pending_approval" → "Pending Approval". */
function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Props for {@link StatusBadge}. */
interface StatusBadgeProps {
  status: StatusBadgeStatus;
  className?: string;
}

/**
 * Semantic status badge using `--status-*` design tokens.
 * Maps any entity lifecycle status to a consistent color scheme.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  return (
    <Badge variant="outline" className={cn(styles, className)}>
      {formatStatus(status)}
    </Badge>
  );
}
