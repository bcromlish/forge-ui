"use client";

import { useRef, useCallback } from "react";
import type { Editor } from "@tiptap/react";

/** Props for {@link ImageUploadButton}. */
interface ImageUploadButtonProps {
  editor: Editor;
  children: React.ReactNode;
}

/** Max file size for image uploads (5 MB). */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/** Allowed MIME types for image uploads. */
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

/**
 * Wraps its children with a hidden file input. When triggered,
 * converts the selected image to a data URL and inserts it into
 * the Tiptap editor via the Image extension.
 *
 * Uses data URLs for the prototype — production would upload
 * to Convex file storage and reference by URL.
 */
export function ImageUploadButton({
  editor,
  children,
}: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!ALLOWED_TYPES.has(file.type)) {
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;
        editor
          .chain()
          .focus()
          .setImage({ src, alt: file.name })
          .run();
      };
      reader.readAsDataURL(file);

      // Reset so the same file can be re-selected
      e.target.value = "";
    },
    [editor]
  );

  const triggerUpload = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />
      <span onClick={triggerUpload} role="presentation">
        {children}
      </span>
    </>
  );
}

/**
 * Programmatically trigger the image upload dialog.
 * Exported for use by the slash command menu.
 */
export function createImageUploadTrigger(
  inputRef: React.RefObject<HTMLInputElement | null>
): () => void {
  return () => inputRef.current?.click();
}
