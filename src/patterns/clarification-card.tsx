"use client";

/**
 * ClarificationCard — Multi-step clarification flow for AI chat/copilot UIs.
 *
 * Mirrors the Claude Code clarification pattern: numbered pagination (1 of N),
 * divider-separated option rows, "Other" custom-input link, single Next/Done
 * button, and an X dismiss control.
 */
import { useCallback, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";

import { Button } from "../primitives/button";
import { cn } from "../lib/utils";

/** A single selectable option within a clarification step. */
export interface ClarificationOption {
  /** Short label displayed as the option title. */
  label: string;
  /** Longer explanation shown below the label. */
  description: string;
  /** Marks this option as the AI-recommended choice. */
  recommended?: boolean;
}

/** One step in a multi-step clarification flow. */
export interface ClarificationStep {
  /** Unique identifier for this step. */
  id: string;
  /** Short label for the step indicator (1-2 words). */
  label: string;
  /** Context/question displayed at the top of the card. */
  question: string;
  /** Selectable options (max 3 recommended). */
  options: ClarificationOption[];
}

/** Answer for a single step — either a selected option or custom text. */
export type StepAnswer =
  | { type: "option"; index: number }
  | { type: "custom"; text: string };

/** Resolved answers keyed by step ID. */
export type ClarificationAnswers = Record<string, string>;

/** Props for {@link ClarificationCard}. */
export interface ClarificationCardProps {
  /** The clarification steps to present. */
  steps: ClarificationStep[];
  /** Called with all resolved answers when the user completes the flow. */
  onComplete: (answers: ClarificationAnswers) => void;
  /** Called when the user dismisses the card via the X button. */
  onDismiss?: () => void;
  /** Optional class name override. */
  className?: string;
}

/**
 * Multi-step clarification card for AI chat interfaces.
 * Presents questions with selectable options, numbered pagination,
 * and an "Other" custom-input fallback — matching the Claude Code pattern.
 */
export function ClarificationCard({
  steps,
  onComplete,
  onDismiss,
  className,
}: ClarificationCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StepAnswer>>({});
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customText, setCustomText] = useState("");

  const step = steps[currentIndex];
  const isLast = currentIndex === steps.length - 1;
  const currentAnswer = step ? answers[step.id] : undefined;
  const hasAnswer = currentAnswer !== undefined;

  const selectOption = useCallback(
    (index: number) => {
      if (!step) return;
      setAnswers((prev: Record<string, StepAnswer>) => ({
        ...prev,
        [step.id]: { type: "option" as const, index },
      }));
      setShowCustomInput(false);
      setCustomText("");
    },
    [step],
  );

  const activateCustomInput = useCallback(() => {
    setShowCustomInput(true);
    if (step) {
      setAnswers((prev: Record<string, StepAnswer>) => {
        const next = { ...prev };
        delete next[step.id];
        return next;
      });
    }
  }, [step]);

  const commitCustomText = useCallback(() => {
    if (!step || !customText.trim()) return;
    setAnswers((prev: Record<string, StepAnswer>) => ({
      ...prev,
      [step.id]: { type: "custom" as const, text: customText.trim() },
    }));
  }, [step, customText]);

  const resolvedAnswers = useMemo(() => {
    const result: ClarificationAnswers = {};
    for (const s of steps) {
      const answer = answers[s.id];
      if (!answer) continue;
      result[s.id] =
        answer.type === "option"
          ? s.options[answer.index]?.label ?? ""
          : answer.text;
    }
    return result;
  }, [steps, answers]);

  const goNext = useCallback(() => {
    if (isLast) {
      onComplete(resolvedAnswers);
    } else {
      setCurrentIndex((i) => i + 1);
      setShowCustomInput(false);
      setCustomText("");
    }
  }, [isLast, onComplete, resolvedAnswers]);

  if (!step) return null;

  return (
    <div
      data-slot="clarification-card"
      className={cn(
        "bg-card text-card-foreground flex w-full max-w-md flex-col rounded-lg border shadow-sm",
        className,
      )}
    >
      {/* Pagination header */}
      <div className="flex items-center justify-between px-6 pt-4">
        {steps.length > 1 ? (
          <Pagination
            current={currentIndex}
            total={steps.length}
            onPrev={() => {
              setCurrentIndex((i) => Math.max(0, i - 1));
              setShowCustomInput(false);
              setCustomText("");
            }}
            onNext={() => {
              setCurrentIndex((i) => Math.min(steps.length - 1, i + 1));
              setShowCustomInput(false);
              setCustomText("");
            }}
          />
        ) : (
          <div />
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      {/* Question */}
      <div className="px-6 pb-3 pt-2">
        <h3 data-slot="clarification-question" className="text-title-3">
          {step.question}
        </h3>
      </div>

      {/* Option rows — divider-separated */}
      <div role="listbox" aria-label={step.question}>
        {step.options.map((option, i) => (
          <OptionRow
            key={i}
            option={option}
            selected={
              currentAnswer?.type === "option" && currentAnswer.index === i
            }
            onSelect={() => selectOption(i)}
            isLast={false}
          />
        ))}

        {/* "Other" custom input row */}
        <div className="border-t">
          {showCustomInput ? (
            <div className="px-6 py-3">
              <textarea
                data-slot="clarification-custom-input"
                className="bg-muted/50 text-body min-h-16 w-full resize-none rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Type your answer…"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                onBlur={commitCustomText}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    commitCustomText();
                  }
                }}
                autoFocus
              />
            </div>
          ) : (
            <button
              type="button"
              data-slot="clarification-other"
              role="option"
              aria-selected={currentAnswer?.type === "custom"}
              onClick={activateCustomInput}
              className={cn(
                "w-full px-6 py-3 text-left transition-colors",
                currentAnswer?.type === "custom"
                  ? "bg-primary/5"
                  : "hover:bg-muted/50",
              )}
            >
              <span className="text-body text-muted-foreground">
                {currentAnswer?.type === "custom"
                  ? currentAnswer.text
                  : "Other"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Footer with Next/Done */}
      <div className="flex justify-end px-6 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goNext}
          disabled={!hasAnswer}
        >
          {isLast ? "Done" : "Next"}
          {!isLast && <ChevronRightIcon className="size-4" />}
        </Button>
      </div>
    </div>
  );
}

/** Props for the internal option row. */
interface OptionRowProps {
  option: ClarificationOption;
  selected: boolean;
  onSelect: () => void;
  isLast: boolean;
}

/** A single divider-separated option row. */
function OptionRow({ option, selected, onSelect }: OptionRowProps) {
  return (
    <button
      type="button"
      data-slot="clarification-option"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col gap-0.5 border-t px-6 py-3 text-left transition-colors",
        selected ? "bg-primary/5" : "hover:bg-muted/50",
      )}
    >
      <span className="text-body-bold">
        {option.label}
        {option.recommended && (
          <span className="text-body text-muted-foreground">
            {" "}
            (Recommended)
          </span>
        )}
      </span>
      <span className="text-caption text-muted-foreground">
        {option.description}
      </span>
    </button>
  );
}

/** Props for the pagination control. */
interface PaginationProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

/** Numbered pagination: ‹ 1 of 3 › */
function Pagination({ current, total, onPrev, onNext }: PaginationProps) {
  return (
    <div
      data-slot="clarification-pagination"
      className="flex items-center gap-2"
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={current === 0}
        aria-label="Previous question"
        className="rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
      >
        <ChevronLeftIcon className="size-4" />
      </button>
      <span className="text-caption text-muted-foreground">
        {current + 1} of {total}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={current === total - 1}
        aria-label="Next question"
        className="rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
      >
        <ChevronRightIcon className="size-4" />
      </button>
    </div>
  );
}
