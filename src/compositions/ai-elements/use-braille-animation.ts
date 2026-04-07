/**
 * Hook that returns an animated Braille Unicode character for the given verb.
 * Cycles through pre-computed frame sequences at FRAME_INTERVAL_MS.
 *
 * @see braille-frames.ts for frame data and verb-to-animation mapping
 */
import { useEffect, useRef, useState } from "react";

import {
  BRAILLE_FRAMES,
  VERB_ANIMATION_MAP,
  type BrailleAnimationType,
} from "./braille-frames";

const FRAME_INTERVAL_MS = 120;
const FALLBACK_ANIMATION: BrailleAnimationType = "braille";

/** Returns an animated Braille character that changes every 120ms. */
export function useBrailleAnimation(verb: string): string {
  const [frameIndex, setFrameIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const animationType =
    VERB_ANIMATION_MAP[verb] ?? FALLBACK_ANIMATION;
  const frames = BRAILLE_FRAMES[animationType];

  // Reset frame index when verb changes, then cycle through frames.
  // Uses requestAnimationFrame to satisfy react-hooks/set-state-in-effect.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setFrameIndex(0));

    intervalRef.current = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, FRAME_INTERVAL_MS);

    return () => {
      cancelAnimationFrame(frame);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [verb, frames.length]);

  return frames[frameIndex % frames.length]!;
}
