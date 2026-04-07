/**
 * Pipeline funnel bar chart — shows application counts grouped by status.
 * Uses recharts BarChart with responsive container.
 *
 * @see hooks/useAnalytics.ts for the data source hook
 */
"use client";

import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../patterns/card";
import { Skeleton } from "../../primitives/skeleton";

/** Color palette for chart status bars. */
const STATUS_COLORS: Record<string, string> = {
  active: "#3b82f6",
  hired: "#10b981",
  rejected: "#ef4444",
  withdrawn: "#f59e0b",
  on_hold: "#8b5cf6",
};

/** Status key mapping for i18n lookup — matches applications.statuses namespace. */
type StatusKey = "active" | "hired" | "rejected" | "withdrawn" | "onHold";
const STATUS_KEYS: Record<string, StatusKey | undefined> = {
  active: "active",
  hired: "hired",
  rejected: "rejected",
  withdrawn: "withdrawn",
  on_hold: "onHold",
};

/** Props for PipelineFunnel chart. */
interface PipelineFunnelProps {
  data:
    | { byStatus: Array<{ status: string; count: number }>; total: number }
    | undefined;
}

/** Loading skeleton for the pipeline funnel card. */
export function PipelineFunnelSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

/** Bar chart showing application counts by pipeline status. */
export function PipelineFunnel({ data }: PipelineFunnelProps) {
  const t = useTranslations("analytics.pipeline");
  const tStatus = useTranslations("applications.statuses");

  if (!data) return <PipelineFunnelSkeleton />;

  const chartData = data.byStatus.map((item) => {
    const key = STATUS_KEYS[item.status];
    return {
      ...item,
      label: key ? tStatus(key) : item.status,
      fill: STATUS_COLORS[item.status] ?? "#6b7280",
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <p className="text-caption text-muted-foreground">
          {t("total")}: {data.total}
        </p>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry) => (
                    <rect key={entry.status} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Empty state for when there's no chart data. */
function EmptyChart() {
  const t = useTranslations("analytics.empty");
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="text-body text-muted-foreground">{t("title")}</p>
    </div>
  );
}
