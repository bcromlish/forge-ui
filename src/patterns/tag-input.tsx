"use client";

import { useState, useCallback } from "react";
import { Badge } from "../primitives/badge";
import { Input } from "../primitives/input";
import { cn } from "../lib/utils";
import { X } from "lucide-react";

/** Props for {@link TagInput}. */
export interface TagInputProps {
  /** Current list of tags. */
  value: string[];
  /** Called when tags are added or removed. */
  onChange: (tags: string[]) => void;
  /** Placeholder shown when input is empty. */
  placeholder?: string;
  /** HTML id for the underlying input element. */
  id?: string;
  className?: string;
}

/**
 * Tag-style input where users type text and press Enter to add tags.
 * Tags are displayed as removable badges above the input.
 * Domain-agnostic — works for skills, education, certifications, etc.
 */
export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter...",
  id,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed) return;
      // Prevent duplicates (case-insensitive)
      if (value.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return;
      onChange([...value, trimmed]);
    },
    [value, onChange]
  );

  const removeTag = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
      setInputValue("");
    }
    // Remove last tag on Backspace when input is empty
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((tag, index) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-0.5 hover:text-destructive"
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Input
        id={id}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}
