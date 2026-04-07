/**
 * Source breakdown pie chart — shows candidate distribution by source.
 * Uses recharts PieChart with responsive container.
 *
 * @see hooks/useAnalytics.ts for the data source hook
 */
"use client";

import { useTranslations } from "next-intl";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
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

/** Color palette for pie chart segments. */
const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
];

/** Source key mapping for i18n lookup — matches candidates.sources namespace. */
type SourceKey =
  | "applied"
  | "sourced"
  | "referral"
  | "agency"
  | "careersPage"
  | "linkedin"
  | "jobBoard"
  | "internal"
  | "other";

const SOURCE_KEYS: Record<string, SourceKey | undefined> = {
  applied: "applied",
  sourced: "sourced",
  referral: "referral",
  agency: "agency",
  careers_page: "careersPage",
  linkedin: "linkedin",
  job_board: "jobBoard",
  internal: "internal",
  other: "other",
};

/** Source effectiveness entry from the analytics query. */
interface SourceEntry {
  source: string;
  total: number;
  hired: number;
  rate: number;
}

/** Chart data with display name added. */
interface ChartEntry extends SourceEntry {
  name: string;
}

/** Props for SourceBreakdown chart. */
interface SourceBreakdownProps {
  data: SourceEntry[] | undefined;
}

/** Loading skeleton for the source breakdown card. */
export function SourceBreakdownSkeleton() {
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

/** Pie chart showing candidate distribution and hire rates by source. */
export function SourceBreakdown({ data }: SourceBreakdownProps) {
  const t = useTranslations("analytics.sources");
  const tSources = useTranslations("candidates.sources");

  if (!data) return <SourceBreakdownSkeleton />;

  const chartData: ChartEntry[] = data.map((item) => {
    const key = SOURCE_KEYS[item.source];
    return { ...item, name: key ? tSources(key) : item.source };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                >
                  {chartData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index.toString()}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => (
                    <SourceTooltip
                      active={active}
                      payload={payload as TooltipPayload}
                      totalLabel={t("total")}
                      hiredLabel={t("hired")}
                    />
                  )}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Tooltip payload shape for the source chart. */
type TooltipPayload = Array<{
  payload: ChartEntry;
}>;

/** Custom tooltip showing hired count and total. */
function SourceTooltip({
  active,
  payload,
  totalLabel,
  hiredLabel,
}: {
  active?: boolean;
  payload?: TooltipPayload;
  totalLabel: string;
  hiredLabel: string;
}) {
  if (!active || !payload?.[0]) return null;
  const { name, total, hired } = payload[0].payload;
  return (
    <div className="rounded-md border bg-popover p-3 shadow-sm">
      <p className="text-body font-medium">{name}</p>
      <p className="text-caption text-muted-foreground">
        {totalLabel}: {total}
      </p>
      <p className="text-caption text-muted-foreground">
        {hiredLabel}: {hired}
      </p>
    </div>
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
