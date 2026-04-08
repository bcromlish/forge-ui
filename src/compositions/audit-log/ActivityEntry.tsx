/**
 * Single activity entry card for the audit log viewer.
 * Renders timestamp, actor, entity badge, and action description.
 */
"use client";

import { Badge } from "../../primitives/badge";
import { Card, CardContent } from "../../patterns/card";
import { User } from "lucide-react";

/** Shape of an activity entry. */
export interface ActivityEntryData {
  _id: string;
  entityType: string;
  entityId: string;
  action: string;
  performedBy?: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
}

/** Props for {@link ActivityEntry}. */
interface ActivityEntryProps {
  entry: ActivityEntryData;
  /** Pre-formatted relative time string (e.g., "5 minutes ago"). */
  relativeTime: string;
  /** Optional entity type label resolver. Defaults to the raw entityType. */
  resolveEntityLabel?: (entityType: string) => string;
  /** Label for system-initiated actions. */
  systemActionLabel?: string;
}

function entityBadgeVariant(entityType: string): "default" | "secondary" | "outline" {
  switch (entityType) {
    case "position":
    case "requisition":
      return "default";
    case "candidate":
    case "application":
      return "secondary";
    default:
      return "outline";
  }
}

function formatAction(action: string): string {
  return action.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export function ActivityEntry({
  entry,
  relativeTime,
  resolveEntityLabel = (t) => t,
  systemActionLabel = "System action",
}: ActivityEntryProps) {
  const entityLabel = resolveEntityLabel(entry.entityType);

  return (
    <Card className="py-3">
      <CardContent className="flex items-start gap-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="size-4 text-muted-foreground" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={entityBadgeVariant(entry.entityType)}>{entityLabel}</Badge>
            <span className="text-body font-medium">{formatAction(entry.action)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-caption text-muted-foreground">{relativeTime}</span>
            {!entry.performedBy && (
              <span className="text-caption text-muted-foreground">{systemActionLabel}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
