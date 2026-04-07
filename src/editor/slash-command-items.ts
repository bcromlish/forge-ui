/**
 * Slash command item definitions and Tiptap extension factory.
 * Separated from the React renderer for file-size compliance.
 *
 * @see components/editor/SlashCommandMenu.tsx for the React renderer
 */
import { Extension } from "@tiptap/core";
import type { Editor, Range } from "@tiptap/react";
import Suggestion, { type SuggestionProps } from "@tiptap/suggestion";
import {
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Image,
  type LucideIcon,
} from "lucide-react";

/** A single slash command item. */
export interface SlashCommandItem {
  title: string;
  description: string;
  icon: LucideIcon;
  command: (editor: Editor, range: Range) => void;
}

/** Build the default slash command items. */
export function buildSlashItems(): SlashCommandItem[] {
  return [
    {
      title: "Heading 2",
      description: "Large section heading",
      icon: Heading2,
      command: (editor, range) =>
        editor.chain().focus().deleteRange(range)
          .setNode("heading", { level: 2 }).run(),
    },
    {
      title: "Heading 3",
      description: "Small section heading",
      icon: Heading3,
      command: (editor, range) =>
        editor.chain().focus().deleteRange(range)
          .setNode("heading", { level: 3 }).run(),
    },
    {
      title: "Bullet List",
      description: "Unordered list",
      icon: List,
      command: (editor, range) =>
        editor.chain().focus().deleteRange(range)
          .toggleBulletList().run(),
    },
    {
      title: "Numbered List",
      description: "Ordered list",
      icon: ListOrdered,
      command: (editor, range) =>
        editor.chain().focus().deleteRange(range)
          .toggleOrderedList().run(),
    },
    {
      title: "Quote",
      description: "Block quote",
      icon: Quote,
      command: (editor, range) =>
        editor.chain().focus().deleteRange(range)
          .toggleBlockquote().run(),
    },
    {
      title: "Code Block",
      description: "Fenced code block",
      icon: Code,
      command: (editor, range) =>
        editor.chain().focus().deleteRange(range)
          .toggleCodeBlock().run(),
    },
    {
      title: "Divider",
      description: "Horizontal rule",
      icon: Minus,
      command: (editor, range) =>
        editor.chain().focus().deleteRange(range)
          .setHorizontalRule().run(),
    },
    {
      title: "Image",
      description: "Upload an image",
      icon: Image,
      command: (editor, range) => {
        editor.chain().focus().deleteRange(range).run();
        window.dispatchEvent(new CustomEvent("editor-image-upload"));
      },
    },
  ];
}

/** Handle for controlling the slash menu from the Suggestion plugin. */
interface SlashMenuHandle {
  onStart: (props: SuggestionProps) => void;
  onUpdate: (props: SuggestionProps) => void;
  onKeyDown: (event: KeyboardEvent) => boolean;
  onExit: () => void;
}

/** Creates a handle that communicates with the React renderer via a global event bus. */
function createSlashMenuHandle(): SlashMenuHandle {
  return {
    onStart: (props) => {
      window.dispatchEvent(
        new CustomEvent("slash-menu", { detail: { type: "start", props } })
      );
    },
    onUpdate: (props) => {
      window.dispatchEvent(
        new CustomEvent("slash-menu", { detail: { type: "update", props } })
      );
    },
    onKeyDown: (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter") {
        window.dispatchEvent(
          new CustomEvent("slash-menu", { detail: { type: "keydown", event } })
        );
        return true;
      }
      if (event.key === "Escape") {
        window.dispatchEvent(
          new CustomEvent("slash-menu", { detail: { type: "exit" } })
        );
        return true;
      }
      return false;
    },
    onExit: () => {
      window.dispatchEvent(
        new CustomEvent("slash-menu", { detail: { type: "exit" } })
      );
    },
  };
}

/**
 * Create the Tiptap extension that powers the "/" slash command menu.
 * Renders via a React portal managed by SlashCommandRenderer.
 */
export function createSlashCommandExtension(
  items: SlashCommandItem[]
): Extension {
  return Extension.create({
    name: "slashCommand",
    addOptions() {
      return { suggestion: {} };
    },
    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          char: "/",
          command: ({ editor, range, props }) => {
            const item = props as unknown as SlashCommandItem;
            item.command(editor, range);
          },
          items: ({ query }: { query: string }) => {
            return items.filter((item) =>
              item.title.toLowerCase().includes(query.toLowerCase())
            );
          },
          render: () => {
            let component: SlashMenuHandle | null = null;
            return {
              onStart: (props: SuggestionProps) => {
                component = createSlashMenuHandle();
                component.onStart(props);
              },
              onUpdate: (props: SuggestionProps) => {
                component?.onUpdate(props);
              },
              onKeyDown: (props: { event: KeyboardEvent }) => {
                return component?.onKeyDown(props.event) ?? false;
              },
              onExit: () => {
                component?.onExit();
                component = null;
              },
            };
          },
        }),
      ];
    },
  });
}
