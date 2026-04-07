/**
 * Braille Unicode animation frame data.
 *
 * Each animation type is a sequence of Braille characters (U+2800–U+28FF)
 * that cycle to create a visual effect. Each character encodes 8 dots in
 * a 2×4 grid via bitmask:
 *
 * ```
 * dot1(0x01) dot4(0x08)
 * dot2(0x02) dot5(0x10)
 * dot3(0x04) dot6(0x20)
 * dot7(0x40) dot8(0x80)
 * ```
 *
 * @see use-braille-animation.ts for the hook that cycles through frames
 */

/** All supported animation type names. */
export type BrailleAnimationType =
  | "orbit"
  | "scan"
  | "rain"
  | "snake"
  | "breathe"
  | "pulse"
  | "fillSweep"
  | "columns"
  | "cascade"
  | "sparkle"
  | "checkerboard"
  | "waveRows"
  | "helix"
  | "diagonalSwipe"
  | "braille";

/** Helper: convert a dot bitmask to a Braille character. */
const b = (mask: number): string => String.fromCharCode(0x2800 + mask);

// --- Frame sequences for each animation type ---

/** Single dot orbiting the 8 positions clockwise. */
const orbit = [
  b(0x01), b(0x02), b(0x04), b(0x40),
  b(0x80), b(0x20), b(0x10), b(0x08),
];

/** Horizontal rows scanning top to bottom, then restarting. */
const scan = [
  b(0x09), b(0x12), b(0x24), b(0xc0),
  b(0x24), b(0x12), b(0x09),
];

/** Dots falling from top rows to bottom rows. */
const rain = [
  b(0x09), b(0x12), b(0x09 | 0x24), b(0x12 | 0xc0),
  b(0x24), b(0xc0), b(0x00),
];

/** Dot snaking through all 8 positions sequentially. */
const snake = [
  b(0x01), b(0x03), b(0x07), b(0x47),
  b(0xc7), b(0xe7), b(0xf7), b(0xff),
  b(0xfe), b(0xfc), b(0xf8), b(0xb8),
  b(0x38), b(0x18), b(0x08), b(0x00),
];

/** Expanding from center then contracting. */
const breathe = [
  b(0x00), b(0x12), b(0x12 | 0x09),
  b(0x1b | 0x24), b(0x3f | 0xc0), b(0xff),
  b(0x3f | 0xc0), b(0x1b | 0x24), b(0x12 | 0x09),
  b(0x12), b(0x00),
];

/** All dots flashing on and off. */
const pulse = [
  b(0xff), b(0xdb), b(0x81), b(0x00),
  b(0x81), b(0xdb), b(0xff),
];

/** Left column fills, then right, then clears left, then right. */
const fillSweep = [
  b(0x01), b(0x03), b(0x07), b(0x47),
  b(0x4f), b(0x5f), b(0x7f), b(0xff),
  b(0xfe), b(0xfc), b(0xf8), b(0xb8),
  b(0x38), b(0x18), b(0x08), b(0x00),
];

/** Left column fills then right column fills. */
const columns = [
  b(0x00), b(0x01), b(0x03), b(0x07), b(0x47),
  b(0x4f), b(0x5f), b(0x7f), b(0xff),
  b(0x47 | 0xb8), b(0xb8), b(0x00),
];

/** Alternating checkerboard patterns. */
const checkerboard = [
  b(0x09 | 0x24), b(0x12 | 0xc0),
  b(0x00), b(0x12 | 0xc0), b(0x09 | 0x24),
  b(0xff), b(0x09 | 0x24),
];

/** Diagonal wave sweeping across. */
const cascade = [
  b(0x01), b(0x0a), b(0x14 | 0x01), b(0xa0 | 0x0a),
  b(0x40 | 0x14), b(0xa0), b(0x40), b(0x00),
];

/** Random-looking sparkle pattern (pre-computed for determinism). */
const sparkle = [
  b(0x21), b(0x88), b(0x14), b(0x42),
  b(0x81), b(0x28), b(0x50), b(0x05),
  b(0xa0), b(0x12), b(0x48), b(0x09),
];

/** Rows undulating like a wave. */
const waveRows = [
  b(0x09), b(0x09 | 0x12), b(0x12 | 0x24),
  b(0x24 | 0xc0), b(0xc0 | 0x24), b(0x24 | 0x12),
  b(0x12 | 0x09), b(0x09),
];

/** Double helix rotating pattern. */
const helix = [
  b(0x09), b(0x80 | 0x02 | 0x08), b(0x40 | 0x04 | 0x10),
  b(0xc0 | 0x24), b(0x40 | 0x10 | 0x04), b(0x80 | 0x08 | 0x02),
  b(0x09),
];

/** Diagonal line sweeping across the grid. */
const diagonalSwipe = [
  b(0x01), b(0x02 | 0x08), b(0x04 | 0x10 | 0x01),
  b(0x20 | 0x02 | 0x08), b(0x40 | 0x04 | 0x10),
  b(0x80 | 0x20), b(0x40), b(0x80), b(0x00),
];

/** Random dots appearing/disappearing (fallback). */
const braille = [
  b(0x15), b(0x2a), b(0xd1), b(0x4e),
  b(0x93), b(0x68), b(0xb4), b(0x57),
  b(0xa2), b(0xcd), b(0x1e), b(0xe3),
];

/** Frame sequences indexed by animation type. */
export const BRAILLE_FRAMES: Record<BrailleAnimationType, readonly string[]> = {
  orbit,
  scan,
  rain,
  snake,
  breathe,
  pulse,
  fillSweep,
  columns,
  cascade,
  sparkle,
  checkerboard,
  waveRows,
  helix,
  diagonalSwipe,
  braille,
} as const;

/**
 * Maps each verb string to a Braille animation type.
 * Verbs not listed here fall back to "braille".
 */
export const VERB_ANIMATION_MAP: Record<string, BrailleAnimationType> = {
  // search context
  "Searching records": "orbit",
  "Looking up data": "rain",
  "Gathering information": "snake",
  "Scanning database": "scan",
  "Reviewing matches": "orbit",
  "Analyzing results": "columns",
  "Cross-referencing": "snake",
  "Filtering records": "rain",
  "Examining details": "scan",
  "Compiling findings": "fillSweep",

  // action context
  "Preparing update": "waveRows",
  "Validating changes": "checkerboard",
  "Processing request": "pulse",
  "Applying modifications": "helix",
  "Checking permissions": "scan",
  "Confirming details": "checkerboard",
  "Staging changes": "columns",
  "Verifying data": "checkerboard",
  "Finalizing action": "diagonalSwipe",
  "Building request": "fillSweep",

  // generate context
  "Composing response": "cascade",
  "Drafting content": "sparkle",
  "Formulating answer": "helix",
  "Structuring document": "columns",
  "Organizing thoughts": "breathe",
  "Polishing draft": "sparkle",
  "Refining output": "sparkle",
  "Assembling report": "fillSweep",
  "Crafting summary": "cascade",
  "Preparing document": "waveRows",

  // default context
  "Thinking": "breathe",
  "Analyzing": "pulse",
  "Considering": "breathe",
  "Processing": "pulse",
  "Reviewing context": "orbit",
  "Evaluating options": "waveRows",
  "Formulating response": "cascade",
  "Researching": "snake",
  "Deliberating": "diagonalSwipe",
  "Reasoning": "helix",
};
