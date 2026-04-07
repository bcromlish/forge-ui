import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Extended twMerge that registers our 14 custom typography utilities in the
 * font-size class group. Without this, tailwind-merge's text-color catch-all
 * validator claims `text-body`, `text-caption`, etc. as color classes, causing
 * `cn("text-body text-muted-foreground")` to strip the typography class entirely.
 *
 * The `{ text: [...] }` format tells tailwind-merge these are `text-*` prefixed
 * classes belonging to the font-size group. Literal string values take priority
 * over the text-color group's catch-all validator.
 *
 * @see app/styles/typography.css for the 14 semantic type utilities
 * @see https://github.com/dcastil/tailwind-merge/blob/main/docs/recipes.md
 */
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-1",
            "display-2",
            "display-3",
            "title-1",
            "title-2",
            "title-3",
            "subtitle-1",
            "subtitle-2",
            "body",
            "body-bold",
            "caption",
            "caption-bold",
            "signal-1",
            "signal-2",
          ],
        },
      ],
    },
  },
});

/** Merge Tailwind classes with conflict resolution. Combines clsx + tailwind-merge. */
export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
