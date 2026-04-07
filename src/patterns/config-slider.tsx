"use client";

import { useCallback } from "react";
import { Slider } from "../primitives/slider";
import { Input } from "../primitives/input";
import { ConfigRow } from "./config-row";
import { cn } from "../lib/utils";

/**
 * Props for {@link ConfigSlider}.
 *
 * @see ConfigSlider for slider+numeric input in config panels
 */
export interface ConfigSliderProps {
  /** Field label displayed on the left. */
  label: string;
  /** Current numeric value. */
  value: number;
  /** Called when the value changes via slider drag or numeric input. */
  onChange: (value: number) => void;
  /** Minimum allowed value. */
  min: number;
  /** Maximum allowed value. */
  max: number;
  /** Step increment. Defaults to 1. */
  step?: number;
  /** Additional CSS classes for the outer wrapper. */
  className?: string;
}

/**
 * Slider with inline numeric value display for config panels — DialKit-inspired.
 * Combines a drag slider with a small editable numeric input.
 */
export function ConfigSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  className,
}: ConfigSliderProps) {
  const handleSliderChange = useCallback(
    (values: number[]) => {
      if (values[0] != null) onChange(values[0]);
    },
    [onChange],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = Number(e.target.value);
      if (!Number.isNaN(num)) {
        onChange(Math.min(max, Math.max(min, num)));
      }
    },
    [onChange, min, max],
  );

  return (
    <ConfigRow label={label} className={cn(className)}>
      <div className="flex items-center gap-3">
        <Slider
          value={[value]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          className="flex-1"
        />
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className="h-6 w-12 border-0 bg-transparent px-1 text-center text-caption shadow-none"
        />
      </div>
    </ConfigRow>
  );
}
