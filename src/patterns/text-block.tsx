"use client";

import type { HTMLAttributes } from "react";

import { Button } from "../primitives/button";
import { cn } from "../lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Props for the copy button used within {@link TextBlock}. */
interface TextBlockCopyButtonProps {
  text: string;
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  className?: string;
}

/** Props for {@link TextBlock}. */
export interface TextBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onCopy" | "onError"> {
  /** Plain text content to display and make copyable. */
  text: string;
  /** Optional label shown in a header bar above the text. */
  label?: string;
  /** Called after text is successfully copied. */
  onCopy?: () => void;
  /** Called if clipboard write fails. */
  onError?: (error: Error) => void;
}

// ---------------------------------------------------------------------------
// Copy Button (internal)
// ---------------------------------------------------------------------------

function TextBlockCopyButton({
  text,
  onCopy,
  onError,
  timeout = 2000,
  className,
}: TextBlockCopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number>(0);

  const copyToClipboard = useCallback(async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      if (!isCopied) {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        onCopy?.();
        timeoutRef.current = window.setTimeout(
          () => setIsCopied(false),
          timeout
        );
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }, [text, onCopy, onError, timeout, isCopied]);

  useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current);
    },
    []
  );

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      className={cn("shrink-0", className)}
      onClick={copyToClipboard}
      size="icon-xs"
      variant="ghost"
      aria-label={isCopied ? "Copied" : "Copy to clipboard"}
    >
      <Icon size={14} />
    </Button>
  );
}

// ---------------------------------------------------------------------------
// TextBlock
// ---------------------------------------------------------------------------

/**
 * Displays plain text in a monospace block with a copy-to-clipboard button.
 * Use for suggested prompts, snippets, or any copiable text content.
 */
export function TextBlock({
  text,
  label,
  onCopy,
  onError,
  className,
  ...props
}: TextBlockProps) {
  return (
    <div
      className={cn(
        "group/text-block relative w-full overflow-hidden rounded-md border bg-muted/50",
        className
      )}
      {...props}
    >
      {label ? (
        <div className="flex items-center justify-between border-b bg-muted/80 px-3 py-2 text-muted-foreground text-caption">
          <span>{label}</span>
          <TextBlockCopyButton
            text={text}
            onCopy={onCopy}
            onError={onError}
            className="-my-1 -mr-1"
          />
        </div>
      ) : (
        <TextBlockCopyButton
          text={text}
          onCopy={onCopy}
          onError={onError}
          className="absolute top-1 right-1 opacity-0 transition-opacity group-hover/text-block:opacity-100 focus-visible:opacity-100"
        />
      )}
      <pre className="overflow-x-auto p-3 font-mono text-body whitespace-pre-wrap">
        {text}
      </pre>
    </div>
  );
}
