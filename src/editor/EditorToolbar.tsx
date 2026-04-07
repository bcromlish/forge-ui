"use client";

import type { Editor } from "@tiptap/react";
import { Toggle } from "../primitives/toggle";
import { Separator } from "../primitives/separator";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { ToolbarTooltip } from "./ToolbarTooltip";
import { LinkPopover } from "./LinkPopover";

/** Props for {@link EditorToolbar}. */
interface EditorToolbarProps {
  editor: Editor;
  /** Trigger the image upload file dialog. */
  onImageUpload?: () => void;
}

/**
 * Formatting toolbar for the Tiptap rich text editor.
 * Built with shadcn/ui Toggle primitives, lucide-react icons,
 * and Tooltip wrappers showing keyboard shortcuts.
 */
export function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b px-1 py-1">
      {/* Text formatting */}
      <ToolbarTooltip label="Bold" shortcut="⌘B">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
      </ToolbarTooltip>
      <ToolbarTooltip label="Italic" shortcut="⌘I">
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
      </ToolbarTooltip>
      <ToolbarTooltip label="Underline" shortcut="⌘U">
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
        >
          <Underline className="h-4 w-4" />
        </Toggle>
      </ToolbarTooltip>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Headings */}
      <ToolbarTooltip label="Heading 2">
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
      </ToolbarTooltip>
      <ToolbarTooltip label="Heading 3">
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
      </ToolbarTooltip>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Lists */}
      <ToolbarTooltip label="Bullet List" shortcut="⌘⇧8">
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          aria-label="Bullet list"
        >
          <List className="h-4 w-4" />
        </Toggle>
      </ToolbarTooltip>
      <ToolbarTooltip label="Numbered List" shortcut="⌘⇧7">
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          aria-label="Ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
      </ToolbarTooltip>

      {/* Blockquote */}
      <ToolbarTooltip label="Blockquote" shortcut="⌘⇧B">
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
          aria-label="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
      </ToolbarTooltip>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Link */}
      <LinkPopover editor={editor} />

      {/* Image */}
      {onImageUpload && (
        <ToolbarTooltip label="Image">
          <Toggle
            size="sm"
            pressed={false}
            onPressedChange={onImageUpload}
            aria-label="Upload image"
          >
            <ImageIcon className="h-4 w-4" />
          </Toggle>
        </ToolbarTooltip>
      )}

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Undo/Redo */}
      <ToolbarTooltip label="Undo" shortcut="⌘Z">
        <Toggle
          size="sm"
          pressed={false}
          disabled={!editor.can().undo()}
          onPressedChange={() => editor.chain().focus().undo().run()}
          aria-label="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </Toggle>
      </ToolbarTooltip>
      <ToolbarTooltip label="Redo" shortcut="⌘⇧Z">
        <Toggle
          size="sm"
          pressed={false}
          disabled={!editor.can().redo()}
          onPressedChange={() => editor.chain().focus().redo().run()}
          aria-label="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </Toggle>
      </ToolbarTooltip>
    </div>
  );
}
