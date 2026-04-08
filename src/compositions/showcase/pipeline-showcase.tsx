/**
 * Interactive pipeline showcase.
 * All data and actions provided via props -- no internal fixtures or reducers.
 */
"use client";

import { ListPageLayout } from "../../layouts/list-page-layout";
import { EmptyState } from "../../patterns/empty-state";
import { StatusBadge } from "../../patterns/status-badge";
import { Briefcase } from "lucide-react";

/** A position entry for the pipeline showcase. */
export interface ShowcasePosition {
  _id: string;
  title: string;
  status: string;
  [key: string]: unknown;
}

/** Props for {@link PipelineShowcase}. */
interface PipelineShowcaseProps {
  /** Positions to display. */
  positions: ShowcasePosition[];
  /** Called when a position's status changes. */
  onStatusChange?: (positionId: string, status: string) => void;
  /** Called when a position is deleted. */
  onDelete?: (positionId: string) => void;
  /** Render function for a single position card. */
  renderPositionCard?: (
    position: ShowcasePosition,
    handlers: { onStatusChange?: (positionId: string, status: string) => void; onDelete?: (positionId: string) => void }
  ) => React.ReactNode;
}

export function PipelineShowcase({
  positions,
  onStatusChange,
  onDelete,
  renderPositionCard,
}: PipelineShowcaseProps) {
  const statusCounts = positions.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <ListPageLayout
      title="Pipeline Showcase"
      actions={
        <div className="flex gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center gap-1">
              <StatusBadge status={status} />
              <span className="text-caption text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      }
    >
      {positions.length === 0 ? (
        <EmptyState
          icon={<Briefcase />}
          title="All positions removed"
          description="Refresh the page to reset the demo data."
        />
      ) : (
        positions.map((position) =>
          renderPositionCard ? (
            <div key={position._id}>
              {renderPositionCard(position, { onStatusChange, onDelete })}
            </div>
          ) : (
            <div key={position._id} className="rounded-lg border p-4">
              <p className="text-body font-medium">{position.title}</p>
              <StatusBadge status={position.status} />
            </div>
          )
        )
      )}
    </ListPageLayout>
  );
}
