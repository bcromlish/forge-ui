"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Toggle } from "../primitives/toggle";
import { Bold, Italic, Underline, Code, Link } from "lucide-react";

/** Props for {@link EditorBubbleMenu}. */
interface EditorBubbleMenuProps {
  editor: Editor;
  onLinkClick: () => void;
}

/**
 * Floating toolbar that appears when text is selected.
 * Shows inline formatting options (bold, italic, underline, code, link).
 */
export function EditorBubbleMenu({
  editor,
  onLinkClick,
}: EditorBubbleMenuProps) {
  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 rounded-lg border bg-background p-1 shadow-md"
    >
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Underline"
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        aria-label="Inline code"
      >
        <Code className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={onLinkClick}
        aria-label="Link"
      >
        <Link className="h-4 w-4" />
      </Toggle>
    </BubbleMenu>
  );
}
