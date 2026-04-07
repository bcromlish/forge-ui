/**
 * Single activity entry card for the audit log viewer.
 * Renders timestamp, actor, entity badge, and action description.
 *
 * @see convex/schema.ts for the activity table shape
 */
"use client";

import { useTranslations } from "next-intl";
// TODO: Replace with prop-based API
// import { useFormattedDistance } from "@/hooks/useFormattedDate";
import { Badge } from "../../primitives/badge";
import { Card, CardContent } from "../../patterns/card";
import { User } from "lucide-react";

/** Shape of an activity entry from the Convex query. */
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
}

/** Map entity types to badge variants for visual distinction. */
function entityBadgeVariant(
  entityType: string
): "default" | "secondary" | "outline" {
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

/** Format an action string for display (e.g., "status_changed" -> "Status Changed"). */
function formatAction(action: string): string {
  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * A single row in the audit log. Shows relative time, entity type badge,
 * action description, and entity reference.
 */
export function ActivityEntry({ entry }: ActivityEntryProps) {
  const t = useTranslations("auditLog");
  const relativeTime = useFormattedDistance(entry.createdAt, {
    addSuffix: true,
  });

  const entityLabel =
    t(`entities.${entry.entityType}` as Parameters<typeof t>[0]) ||
    entry.entityType;

  return (
    <Card className="py-3">
      <CardContent className="flex items-start gap-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="size-4 text-muted-foreground" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={entityBadgeVariant(entry.entityType)}>
              {entityLabel}
            </Badge>
            <span className="text-body font-medium">
              {formatAction(entry.action)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-caption text-muted-foreground">
              {relativeTime}
            </span>
            {!entry.performedBy && (
              <span className="text-caption text-muted-foreground">
                {t("systemAction")}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
