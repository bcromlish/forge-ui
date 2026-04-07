"use client";

import { useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../primitives/popover";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import { Label } from "../primitives/label";
import { Link, Unlink } from "lucide-react";
import { Toggle } from "../primitives/toggle";
import { ToolbarTooltip } from "./ToolbarTooltip";

/** Props for {@link LinkPopover}. */
interface LinkPopoverProps {
  editor: Editor;
}

/**
 * Inline popover for adding/editing/removing links in the editor.
 * Replaces the old window.prompt() approach with a proper UI.
 */
export function LinkPopover({ editor }: LinkPopoverProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const isActive = editor.isActive("link");

  const handleOpen = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        const existingHref = editor.getAttributes("link").href as
          | string
          | undefined;
        setUrl(existingHref ?? "");
      }
      setOpen(nextOpen);
    },
    [editor]
  );

  const handleApply = useCallback(() => {
    if (!url.trim()) return;
    const href = normalizeUrl(url.trim());
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href })
      .run();
    setOpen(false);
    setUrl("");
  }, [editor, url]);

  const handleRemove = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    setOpen(false);
    setUrl("");
  }, [editor]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleApply();
      }
    },
    [handleApply]
  );

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <ToolbarTooltip label="Link" shortcut="⌘K">
        <PopoverTrigger asChild>
          <Toggle
            size="sm"
            pressed={isActive}
            onPressedChange={() => setOpen(true)}
            aria-label="Link"
          >
            <Link className="h-4 w-4" />
          </Toggle>
        </PopoverTrigger>
      </ToolbarTooltip>
      <PopoverContent className="w-64" align="start" sideOffset={8}>
        <div className="flex flex-col gap-3">
          <Label htmlFor="link-url" className="text-caption font-medium">
            URL
          </Label>
          <Input
            id="link-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com"
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleApply} disabled={!url.trim()}>
              {isActive ? "Update" : "Apply"}
            </Button>
            {isActive && (
              <Button size="sm" variant="outline" onClick={handleRemove}>
                <Unlink className="mr-1 h-3 w-3" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Prefix with https:// if no protocol is present. */
function normalizeUrl(url: string): string {
  if (/^https?:\/\//i.test(url) || url.startsWith("mailto:")) return url;
  return `https://${url}`;
}
