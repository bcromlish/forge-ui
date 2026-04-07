/**
 * Date range preset selector — toggle buttons for analytics time filtering.
 * Supports 30/60/90 day windows and all-time view.
 *
 * @see app/(auth)/analytics/page.tsx for usage context
 */
"use client";

import { useTranslations } from "next-intl";
import { Button } from "../../primitives/button";
import { cn } from "../../lib/utils";

/** Preset date range options in days (0 = all time). */
type DatePreset = 30 | 60 | 90 | 0;

/** Props for DateRangeSelector. */
interface DateRangeSelectorProps {
  activePreset: DatePreset;
  onPresetChange: (preset: DatePreset) => void;
}

/** Label keys matching analytics.dateRange namespace. */
type DateRangeLabelKey = "last30" | "last60" | "last90" | "allTime";

/** Ordered list of available presets. */
const PRESETS: Array<{ value: DatePreset; labelKey: DateRangeLabelKey }> = [
  { value: 30, labelKey: "last30" },
  { value: 60, labelKey: "last60" },
  { value: 90, labelKey: "last90" },
  { value: 0, labelKey: "allTime" },
];

/** Toggle button group for selecting analytics date range presets. */
export function DateRangeSelector({
  activePreset,
  onPresetChange,
}: DateRangeSelectorProps) {
  const t = useTranslations("analytics.dateRange");

  return (
    <div className="flex gap-2">
      {PRESETS.map(({ value, labelKey }) => (
        <Button
          key={value}
          variant={activePreset === value ? "default" : "outline"}
          size="sm"
          className={cn(
            activePreset !== value && "text-muted-foreground"
          )}
          onClick={() => onPresetChange(value)}
        >
          {t(labelKey)}
        </Button>
      ))}
    </div>
  );
}
