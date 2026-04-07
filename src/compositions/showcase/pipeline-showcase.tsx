"use client";

import { useReducer } from "react";
// TODO: Replace with prop-based API
// import { FIXTURE_POSITIONS } from "@/lib/fixtures";
// TODO: Replace with prop-based API
// import { pipelineReducer } from "@/lib/fixtures/reducers";
// TODO: Replace with prop-based API
// import { PositionCard } from "@/features/positions/components/PositionCard";
import { ListPageLayout } from "../../layouts/list-page-layout";
import { EmptyState } from "../../patterns/empty-state";
import { StatusBadge } from "../../patterns/status-badge";
import { Briefcase } from "lucide-react";
// TODO: Replace with prop-based API
// import type { PositionStatus } from "@/types/domain";

/**
 * Interactive pipeline showcase using fixture data + useReducer.
 * Demonstrates the full hiring pipeline UI without any Convex dependency.
 * Same components as the live app — different data source.
 */
export function PipelineShowcase() {
  const [positions, dispatch] = useReducer(pipelineReducer, FIXTURE_POSITIONS);

  function handleStatusChange(positionId: string, status: PositionStatus) {
    dispatch({ type: "CHANGE_STATUS", positionId, status });
  }

  function handleDelete(positionId: string) {
    dispatch({ type: "DELETE_POSITION", positionId });
  }

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
              <StatusBadge status={status as PositionStatus} />
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
        positions.map((position) => (
          <PositionCard
            key={position._id}
            position={position}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))
      )}
    </ListPageLayout>
  );
}
