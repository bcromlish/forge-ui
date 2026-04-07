"use client";

import { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react";
import type { SuggestionProps } from "@tiptap/suggestion";
import type { SlashCommandItem } from "./slash-command-items";

// Re-export for consumers that import from this module
export { buildSlashItems, createSlashCommandExtension } from "./slash-command-items";
export type { SlashCommandItem } from "./slash-command-items";

/**
 * React component that renders the slash command dropdown.
 * Listens to events dispatched by the Suggestion plugin bridge
 * in slash-command-items.ts.
 */
export function SlashCommandRenderer() {
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<SlashCommandItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any -- Suggestion command accepts any props */
  const commandRef = useRef<((props: any) => void) | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleEvent = useCallback((e: Event) => {
    const { type, props, event } = (e as CustomEvent).detail;

    if (type === "start" || type === "update") {
      const suggestionProps = props as SuggestionProps;
      setItems(suggestionProps.items as SlashCommandItem[]);
      setSelectedIndex(0);
      commandRef.current = suggestionProps.command;

      if (suggestionProps.clientRect) {
        const rect = suggestionProps.clientRect();
        if (rect) {
          setCoords({ top: rect.bottom + 4, left: rect.left });
        }
      }
      setVisible(true);
    } else if (type === "keydown") {
      const kbd = event as KeyboardEvent;
      setSelectedIndex((prev) => {
        if (kbd.key === "ArrowDown") return Math.min(prev + 1, items.length - 1);
        if (kbd.key === "ArrowUp") return Math.max(prev - 1, 0);
        return prev;
      });
      if (kbd.key === "Enter") {
        setItems((current) => {
          setSelectedIndex((idx) => {
            const item = current[idx];
            if (item && commandRef.current) {
              commandRef.current(item);
            }
            return idx;
          });
          return current;
        });
      }
    } else if (type === "exit") {
      setVisible(false);
      setItems([]);
      setSelectedIndex(0);
    }
  }, [items.length]);

  useEffect(() => {
    window.addEventListener("slash-menu", handleEvent);
    return () => window.removeEventListener("slash-menu", handleEvent);
  }, [handleEvent]);

  useLayoutEffect(() => {
    if (menuRef.current && visible) {
      const el = menuRef.current.children[selectedIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, visible]);

  if (!visible || items.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 max-h-64 w-48 overflow-y-auto rounded-lg border bg-popover p-1 shadow-md"
      style={{ top: coords.top, left: coords.left }}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={item.title}
            type="button"
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-body ${
              index === selectedIndex
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            }`}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => {
              commandRef.current?.(item);
              setVisible(false);
            }}
          >
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="flex flex-col items-start">
              <span className="text-body font-medium">{item.title}</span>
              <span className="text-caption text-muted-foreground">
                {item.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
