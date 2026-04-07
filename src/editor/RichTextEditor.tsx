"use client";

import { useRef, useCallback, useMemo, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
import { cn } from "../lib/utils";
import { EditorToolbar } from "./EditorToolbar";
import { EditorFooter } from "./EditorFooter";
import { EditorBubbleMenu } from "./EditorBubbleMenu";
import {
  buildSlashItems,
  createSlashCommandExtension,
  SlashCommandRenderer,
} from "./SlashCommandMenu";

/** Props for {@link RichTextEditor}. */
interface RichTextEditorProps {
  /** Tiptap JSON to initialize the editor with. */
  initialContent?: Record<string, unknown> | null;
  /** Called on every content change with the current Tiptap JSON. */
  onChange: (json: Record<string, unknown>) => void;
  /** Placeholder text shown when the editor is empty. */
  placeholder?: string;
}

/**
 * Headless Tiptap rich text editor with a shadcn/ui toolbar, bubble menu,
 * slash commands, image upload, character count, and markdown paste support.
 * Outputs Tiptap JSON via onChange — the parent form handles submission.
 * Uses `immediatelyRender: false` for Next.js SSR compatibility.
 *
 * @see components/editor/EditorToolbar.tsx for the toolbar
 * @see lib/domain/content.ts for server-side HTML/text derivation
 */
export function RichTextEditor({
  initialContent,
  onChange,
  placeholder = "Start typing, or press / for commands...",
}: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const triggerImageUpload = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  /* Stable slash items — the image callback is captured in a ref-reading
     closure so it's only invoked on user interaction, never during render. */
  const slashItems = useMemo(
    () => buildSlashItems(),
    []
  );

  const slashExtension = useMemo(
    () => createSlashCommandExtension(slashItems),
    [slashItems]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
        },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-md",
        },
      }),
      Markdown.configure({
        transformPastedText: true,
        transformCopiedText: false,
      }),
      slashExtension,
    ],
    content: initialContent ?? undefined,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      onChange(e.getJSON() as Record<string, unknown>);
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-24 px-3 py-2",
      },
    },
  });

  /* Listen for image upload requests from slash command menu */
  useEffect(() => {
    const handler = () => imageInputRef.current?.click();
    window.addEventListener("editor-image-upload", handler);
    return () => window.removeEventListener("editor-image-upload", handler);
  }, []);

  const handleImageFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      const allowed = new Set([
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ]);
      if (!allowed.has(file.type) || file.size > 5 * 1024 * 1024) return;

      const reader = new FileReader();
      reader.onload = () => {
        editor
          .chain()
          .focus()
          .setImage({ src: reader.result as string, alt: file.name })
          .run();
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div
      className={cn(
        "rounded-md border bg-background",
        "focus-within:ring-ring/50 focus-within:ring-2 focus-within:border-ring"
      )}
    >
      <EditorToolbar
        editor={editor}
        onImageUpload={triggerImageUpload}
      />
      <div className="prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none">
        <EditorContent editor={editor} />
        <EditorBubbleMenu
          editor={editor}
          onLinkClick={() => {
            /* The toolbar link popover handles this — bubble menu just toggles */
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            }
          }}
        />
      </div>
      <EditorFooter editor={editor} />
      <SlashCommandRenderer />

      {/* Hidden file input for image uploads */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleImageFile}
      />
    </div>
  );
}
