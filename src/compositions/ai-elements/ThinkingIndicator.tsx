"use client";

/**
 * Rich thinking indicator with animated Braille character and cycling verb text.
 * Renders an animated Unicode Braille spinner + shimmering verb label.
 *
 * @see components/compositions/ai-elements/reasoning.tsx for integration
 */
import { memo } from "react";

import { Shimmer } from "./shimmer";
import { useBrailleAnimation } from "./use-braille-animation";
import { useCyclingVerb, type ThinkingContext } from "./use-cycling-verb";

export interface ThinkingIndicatorProps {
  /** Context hint for verb selection based on nearby tool parts. */
  context?: ThinkingContext;
}

/** Animated Braille character + shimmering cycling verb. */
export const ThinkingIndicator = memo(
  ({ context = "default" }: ThinkingIndicatorProps) => {
    const verb = useCyclingVerb(true, context);
    const brailleChar = useBrailleAnimation(verb);

    return (
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-block w-4 text-center font-mono text-ai-fg text-body"
        >
          {brailleChar}
        </span>
        <Shimmer duration={1.5}>{`${verb}...`}</Shimmer>
      </span>
    );
  },
);

ThinkingIndicator.displayName = "ThinkingIndicator";
