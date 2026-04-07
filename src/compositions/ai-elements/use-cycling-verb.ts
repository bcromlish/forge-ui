/**
 * Hook that cycles through context-aware verbs while the AI is thinking.
 * Returns the current verb string, which changes every CYCLE_INTERVAL_MS.
 *
 * @see components/compositions/ai-elements/ThinkingIndicator.tsx for usage
 */
import { useEffect, useRef, useState } from "react";

/** Thinking context derived from tool parts in the current message. */
export type ThinkingContext = "search" | "action" | "generate" | "default";

const CYCLE_INTERVAL_MS = 2500;

const VERB_SETS: Record<ThinkingContext, string[]> = {
  search: [
    "Searching records",
    "Looking up data",
    "Gathering information",
    "Scanning database",
    "Reviewing matches",
    "Analyzing results",
    "Cross-referencing",
    "Filtering records",
    "Examining details",
    "Compiling findings",
  ],
  action: [
    "Preparing update",
    "Validating changes",
    "Processing request",
    "Applying modifications",
    "Checking permissions",
    "Confirming details",
    "Staging changes",
    "Verifying data",
    "Finalizing action",
    "Building request",
  ],
  generate: [
    "Composing response",
    "Drafting content",
    "Formulating answer",
    "Structuring document",
    "Organizing thoughts",
    "Polishing draft",
    "Refining output",
    "Assembling report",
    "Crafting summary",
    "Preparing document",
  ],
  default: [
    "Thinking",
    "Analyzing",
    "Considering",
    "Processing",
    "Reviewing context",
    "Evaluating options",
    "Formulating response",
    "Researching",
    "Deliberating",
    "Reasoning",
  ],
};

/** Cycles through context-aware verbs while streaming. Resets on stop. */
export function useCyclingVerb(
  isStreaming: boolean,
  context: ThinkingContext = "default",
): string {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const verbs = VERB_SETS[context];

  useEffect(() => {
    if (!isStreaming) return;

    // Reset to first verb immediately via a microtask to satisfy
    // react-hooks/set-state-in-effect (no synchronous setState in effect body).
    const frame = requestAnimationFrame(() => setIndex(0));

    intervalRef.current = setInterval(() => {
      setIndex((prev: number) => (prev + 1) % verbs.length);
    }, CYCLE_INTERVAL_MS);

    return () => {
      cancelAnimationFrame(frame);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isStreaming, verbs]);

  // verbs arrays are non-empty constants, safe to index
  return verbs[index % verbs.length]!;
}
