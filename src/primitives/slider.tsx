"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "../lib/utils"

/** Formats a slider value array into a display string. */
type FormatValueFn = (values: number[]) => string

/** Props extending Radix Slider with optional inline value display. */
interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  /** Show the current value to the right of the slider track. */
  showValue?: boolean
  /** Custom formatter for the displayed value. Receives the value array. */
  formatValue?: FormatValueFn
}

/** Default formatter: joins values with an en-dash for ranges, single value otherwise. */
function defaultFormat(values: number[]): string {
  return values.length > 1 ? values.join(" \u2013 ") : String(values[0] ?? "")
}

/**
 * Slider primitive with optional real-time value display.
 *
 * Set `showValue` to render the current value to the right of the track.
 * Provide `formatValue` to customize how the number(s) are displayed.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  showValue = false,
  formatValue,
  onValueChange,
  ...props
}: SliderProps) {
  const initialValues = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  /* Track live values for the inline display (uncontrolled mode). */
  const [liveValues, setLiveValues] = React.useState(initialValues)

  /* Keep live values in sync when controlled value changes. */
  React.useEffect(() => {
    if (Array.isArray(value)) setLiveValues(value)
  }, [value])

  const handleValueChange = React.useCallback(
    (next: number[]) => {
      setLiveValues(next)
      onValueChange?.(next)
    },
    [onValueChange]
  )

  const formatter = formatValue ?? defaultFormat

  const sliderRoot = (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      onValueChange={handleValueChange}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: initialValues.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )

  if (!showValue) return sliderRoot

  return (
    <div data-slot="slider-with-value" className="flex items-center gap-3">
      {sliderRoot}
      <span
        data-slot="slider-value"
        className="text-muted-foreground text-caption min-w-[3ch] shrink-0 text-right tabular-nums"
      >
        {formatter(liveValues)}
      </span>
    </div>
  )
}

export { Slider }
export type { SliderProps, FormatValueFn }
