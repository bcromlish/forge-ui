"use client";

import type { Editor } from "@tiptap/react";

/** Props for {@link EditorFooter}. */
interface EditorFooterProps {
  editor: Editor;
}

/**
 * Footer bar showing word and character counts.
 * Requires @tiptap/extension-character-count on the editor.
 */
export function EditorFooter({ editor }: EditorFooterProps) {
  const chars = editor.storage.characterCount?.characters() ?? 0;
  const words = editor.storage.characterCount?.words() ?? 0;

  return (
    <div className="flex items-center justify-end gap-3 border-t px-3 py-1 text-caption text-muted-foreground">
      <span>{words} {words === 1 ? "word" : "words"}</span>
      <span>{chars} {chars === 1 ? "character" : "characters"}</span>
    </div>
  );
}
