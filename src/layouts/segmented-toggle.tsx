"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";

/** A single item in the segmented toggle. */
export interface SegmentedToggleItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

/** Props for {@link SegmentedToggle}. */
export interface SegmentedToggleProps {
  /** The items to render as toggle segments. */
  items: SegmentedToggleItem[];
  /** The currently selected value. */
  value: string;
  /** Callback fired when the selected value changes. */
  onValueChange: (value: string) => void;
  className?: string;
}

/**
 * A rounded pill segmented toggle for tab-based navigation.
 * Supports keyboard navigation (arrow keys, Home, End) and
 * smooth sliding indicator animation. WAI-ARIA tablist pattern.
 */
export function SegmentedToggle({
  items,
  value,
  onValueChange,
  className,
}: SegmentedToggleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  const updateIndicator = useCallback(() => {
    const activeEl = itemRefs.current.get(value);
    const container = containerRef.current;
    if (!activeEl || !container) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    setIndicatorStyle({
      left: activeRect.left - containerRect.left,
      width: activeRect.width,
    });
  }, [value]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;

    switch (e.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % items.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + items.length) % items.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const nextItem = items[nextIndex]!;
    onValueChange(nextItem.value);
    itemRefs.current.get(nextItem.value)?.focus();
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      className={cn(
        "relative inline-flex items-center rounded-full bg-muted p-1",
        className
      )}
    >
      {/* Sliding indicator */}
      <div
        className="absolute top-1 h-[calc(100%-0.5rem)] rounded-full bg-card shadow-sm dark:shadow-none transition-all duration-200 ease-out"
        style={indicatorStyle}
        aria-hidden
      />

      {items.map((item, index) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            ref={(el) => {
              if (el) itemRefs.current.set(item.value, el);
            }}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onValueChange(item.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "relative z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-body font-medium transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/80"
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
