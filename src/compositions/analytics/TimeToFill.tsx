/**
 * Time-to-fill metric card — large number display with supporting context.
 * Shows average days from application to hire with data points count.
 *
 * @see hooks/useAnalytics.ts for the data source hook
 */
"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../patterns/card";
import { Skeleton } from "../../primitives/skeleton";

/** Props for TimeToFill metric card. */
interface TimeToFillProps {
  data: { averageDays: number; dataPoints: number } | undefined;
}

/** Loading skeleton for the time-to-fill card. */
export function TimeToFillSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-24 w-32" />
      </CardContent>
    </Card>
  );
}

/** Large metric display showing average time-to-fill in days. */
export function TimeToFill({ data }: TimeToFillProps) {
  const t = useTranslations("analytics.timeToFill");

  if (!data) return <TimeToFillSkeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.dataPoints === 0 ? (
          <EmptyMetric />
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-title-1">{data.averageDays}</span>
              <span className="text-body text-muted-foreground">
                {t("days")}
              </span>
            </div>
            <p className="text-caption text-muted-foreground">
              {t("average")} &middot; {data.dataPoints} {t("dataPoints")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Empty state when no hired applications exist for the metric. */
function EmptyMetric() {
  const t = useTranslations("analytics.empty");
  return (
    <div className="flex h-24 items-center justify-center">
      <p className="text-body text-muted-foreground">{t("title")}</p>
    </div>
  );
}
