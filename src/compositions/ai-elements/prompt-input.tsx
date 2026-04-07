"use client";

import type { FileUIPart, SourceDocumentUIPart } from "ai";
import type {
  ChangeEventHandler,
  ComponentProps,
  FormEvent,
  FormEventHandler,
  HTMLAttributes,
} from "react";

import { InputGroup, InputGroupAddon } from "../../patterns/input-group";
import { cn } from "../../lib/utils";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AttachmentsContext, ReferencedSourcesContext } from "./prompt-input-provider";
import {
  convertBlobUrlToDataUrl,
  LocalAttachmentsContext,
  LocalReferencedSourcesContext,
  useOptionalPromptInputController,
} from "./prompt-input-provider";
import { filesToParts, revokeFileUrls, validateAndPrepareFiles } from "./prompt-input-file-utils";

// Re-exports — provider
export {
  PromptInputProvider, usePromptInputController, useProviderAttachments,
  usePromptInputAttachments, usePromptInputReferencedSources,
} from "./prompt-input-provider";
export type {
  AttachmentsContext, TextInputContext, PromptInputControllerProps,
  PromptInputProviderProps, ReferencedSourcesContext,
} from "./prompt-input-provider";

// Re-exports — textarea
export { PromptInputTextarea } from "./prompt-input-textarea";
export type { PromptInputTextareaProps } from "./prompt-input-textarea";

// Re-exports — actions
export {
  PromptInputActionAddAttachments, PromptInputButton,
  PromptInputActionMenu, PromptInputActionMenuTrigger,
  PromptInputActionMenuContent, PromptInputActionMenuItem, PromptInputSubmit,
} from "./prompt-input-actions";
export type {
  PromptInputActionAddAttachmentsProps, PromptInputButtonProps,
  PromptInputButtonTooltip, PromptInputActionMenuProps,
  PromptInputActionMenuTriggerProps, PromptInputActionMenuContentProps,
  PromptInputActionMenuItemProps, PromptInputSubmitProps,
} from "./prompt-input-actions";

// Re-exports — controls
export {
  PromptInputSelect, PromptInputSelectTrigger, PromptInputSelectContent,
  PromptInputSelectItem, PromptInputSelectValue,
  PromptInputHoverCard, PromptInputHoverCardTrigger, PromptInputHoverCardContent,
  PromptInputTabsList, PromptInputTab, PromptInputTabLabel,
  PromptInputTabBody, PromptInputTabItem,
  PromptInputCommand, PromptInputCommandInput, PromptInputCommandList,
  PromptInputCommandEmpty, PromptInputCommandGroup, PromptInputCommandItem,
  PromptInputCommandSeparator,
} from "./prompt-input-controls";
export type {
  PromptInputSelectProps, PromptInputSelectTriggerProps,
  PromptInputSelectContentProps, PromptInputSelectItemProps,
  PromptInputSelectValueProps, PromptInputHoverCardProps,
  PromptInputHoverCardTriggerProps, PromptInputHoverCardContentProps,
  PromptInputTabsListProps, PromptInputTabProps, PromptInputTabLabelProps,
  PromptInputTabBodyProps, PromptInputTabItemProps,
  PromptInputCommandProps, PromptInputCommandInputProps,
  PromptInputCommandListProps, PromptInputCommandEmptyProps,
  PromptInputCommandGroupProps, PromptInputCommandItemProps,
  PromptInputCommandSeparatorProps,
} from "./prompt-input-controls";

// ============================================================================
// Types
// ============================================================================

export interface PromptInputMessage {
  text: string;
  files: FileUIPart[];
}

export type PromptInputProps = Omit<HTMLAttributes<HTMLFormElement>, "onSubmit" | "onError"> & {
  accept?: string;
  multiple?: boolean;
  globalDrop?: boolean;
  syncHiddenInput?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  onError?: (err: { code: "max_files" | "max_file_size" | "accept"; message: string }) => void;
  onSubmit: (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

// ============================================================================
// Core PromptInput Form
// ============================================================================

export const PromptInput = ({
  className, accept, multiple, globalDrop, syncHiddenInput,
  maxFiles, maxFileSize, onError, onSubmit, children, ...props
}: PromptInputProps) => {
  const controller = useOptionalPromptInputController();
  const usingProvider = !!controller;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [items, setItems] = useState<(FileUIPart & { id: string })[]>([]);
  const files = usingProvider ? controller.attachments.files : items;
  const [referencedSources, setReferencedSources] = useState<(SourceDocumentUIPart & { id: string })[]>([]);

  const filesRef = useRef(files);
  useEffect(() => { filesRef.current = files; }, [files]);

  const validationOpts = useMemo(
    () => ({ accept, maxFiles, maxFileSize, onError }),
    [accept, maxFiles, maxFileSize, onError]
  );

  const addLocal = useCallback(
    (fileList: File[] | FileList) => {
      setItems((prev) => {
        const capped = validateAndPrepareFiles(fileList, { ...validationOpts, currentCount: prev.length });
        return capped.length > 0 ? [...prev, ...filesToParts(capped)] : prev;
      });
    },
    [validationOpts]
  );

  const removeLocal = useCallback(
    (id: string) => setItems((prev) => {
      const found = prev.find((f) => f.id === id);
      if (found?.url) { URL.revokeObjectURL(found.url); }
      return prev.filter((f) => f.id !== id);
    }),
    []
  );

  const addWithProviderValidation = useCallback(
    (fileList: File[] | FileList) => {
      const capped = validateAndPrepareFiles(fileList, { ...validationOpts, currentCount: files.length });
      if (capped.length > 0) { controller?.attachments.add(capped); }
    },
    [validationOpts, files.length, controller]
  );

  const clearAttachments = useCallback(
    () => usingProvider
      ? controller?.attachments.clear()
      : setItems((prev) => { revokeFileUrls(prev); return []; }),
    [usingProvider, controller]
  );
  const clearReferencedSources = useCallback(() => setReferencedSources([]), []);

  const add = usingProvider ? addWithProviderValidation : addLocal;
  const remove = usingProvider ? controller.attachments.remove : removeLocal;
  const openFileDialogLocal = useCallback(() => inputRef.current?.click(), []);
  const openFileDialog = usingProvider ? controller.attachments.openFileDialog : openFileDialogLocal;

  const clear = useCallback(() => { clearAttachments(); clearReferencedSources(); }, [clearAttachments, clearReferencedSources]);

  // Register file input with provider
  useEffect(() => {
    if (usingProvider) { controller.__registerFileInput(inputRef, () => inputRef.current?.click()); }
  }, [usingProvider, controller]);

  useEffect(() => {
    if (syncHiddenInput && inputRef.current && files.length === 0) { inputRef.current.value = ""; }
  }, [files, syncHiddenInput]);

  // Drag-drop on form
  useEffect(() => {
    const form = formRef.current;
    if (!form || globalDrop) { return; }
    const handler = makeDragDropHandlers(add);
    form.addEventListener("dragover", handler.dragOver);
    form.addEventListener("drop", handler.drop);
    return () => { form.removeEventListener("dragover", handler.dragOver); form.removeEventListener("drop", handler.drop); };
  }, [add, globalDrop]);

  // Global drag-drop
  useEffect(() => {
    if (!globalDrop) { return; }
    const handler = makeDragDropHandlers(add);
    document.addEventListener("dragover", handler.dragOver);
    document.addEventListener("drop", handler.drop);
    return () => { document.removeEventListener("dragover", handler.dragOver); document.removeEventListener("drop", handler.drop); };
  }, [add, globalDrop]);

  // Cleanup blob URLs on unmount
  useEffect(() => () => { if (!usingProvider) { revokeFileUrls(filesRef.current); } }, [usingProvider]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => { if (e.currentTarget.files) { add(e.currentTarget.files); } e.currentTarget.value = ""; },
    [add]
  );

  const attachmentsCtx = useMemo<AttachmentsContext>(
    () => ({ add, clear: clearAttachments, fileInputRef: inputRef, files: files.map((f) => ({ ...f })), openFileDialog, remove }),
    [files, add, remove, clearAttachments, openFileDialog]
  );

  const refsCtx = useMemo<ReferencedSourcesContext>(
    () => ({
      add: (incoming: SourceDocumentUIPart[] | SourceDocumentUIPart) => {
        const arr = Array.isArray(incoming) ? incoming : [incoming];
        setReferencedSources((prev) => [...prev, ...arr.map((s) => ({ ...s, id: nanoid() }))]);
      },
      clear: clearReferencedSources,
      remove: (id: string) => { setReferencedSources((prev) => prev.filter((s) => s.id !== id)); },
      sources: referencedSources,
    }),
    [referencedSources, clearReferencedSources]
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const text = usingProvider
        ? controller.textInput.value
        : ((new FormData(form)).get("message") as string) || "";
      if (!usingProvider) { form.reset(); }

      try {
        const convertedFiles: FileUIPart[] = await Promise.all(
          files.map(async (file) => {
            const item: FileUIPart = { filename: file.filename, mediaType: file.mediaType, type: file.type, url: file.url };
            if (item.url?.startsWith("blob:")) {
              const dataUrl = await convertBlobUrlToDataUrl(item.url);
              return { ...item, url: dataUrl ?? item.url };
            }
            return item;
          })
        );
        const result = onSubmit({ files: convertedFiles, text }, event);
        if (result instanceof Promise) {
          try { await result; clear(); if (usingProvider) { controller.textInput.clear(); } } catch { /* retry */ }
        } else { clear(); if (usingProvider) { controller.textInput.clear(); } }
      } catch { /* retry */ }
    },
    [usingProvider, controller, files, onSubmit, clear]
  );

  return (
    <LocalAttachmentsContext.Provider value={attachmentsCtx}>
      <LocalReferencedSourcesContext.Provider value={refsCtx}>
        <input accept={accept} aria-label="Upload files" className="hidden" multiple={multiple} onChange={handleChange} ref={inputRef} title="Upload files" type="file" />
        <form className={cn("w-full", className)} onSubmit={handleSubmit} ref={formRef} {...props}>
          <InputGroup className="overflow-hidden">{children}</InputGroup>
        </form>
      </LocalReferencedSourcesContext.Provider>
    </LocalAttachmentsContext.Provider>
  );
};

// ============================================================================
// Layout Components
// ============================================================================

export type PromptInputBodyProps = HTMLAttributes<HTMLDivElement>;
export const PromptInputBody = ({ className, ...props }: PromptInputBodyProps) => (
  <div className={cn("contents", className)} {...props} />
);

export type PromptInputHeaderProps = Omit<ComponentProps<typeof InputGroupAddon>, "align">;
export const PromptInputHeader = ({ className, ...props }: PromptInputHeaderProps) => (
  <InputGroupAddon align="block-end" className={cn("order-first flex-wrap gap-1", className)} {...props} />
);

export type PromptInputFooterProps = Omit<ComponentProps<typeof InputGroupAddon>, "align">;
export const PromptInputFooter = ({ className, ...props }: PromptInputFooterProps) => (
  <InputGroupAddon align="block-end" className={cn("justify-between gap-1", className)} {...props} />
);

export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>;
export const PromptInputTools = ({ className, ...props }: PromptInputToolsProps) => (
  <div className={cn("flex min-w-0 items-center gap-1", className)} {...props} />
);

// ============================================================================
// Helpers
// ============================================================================

function makeDragDropHandlers(addFn: (files: File[] | FileList) => void) {
  return {
    dragOver: (e: DragEvent) => { if (e.dataTransfer?.types?.includes("Files")) { e.preventDefault(); } },
    drop: (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) { e.preventDefault(); }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) { addFn(e.dataTransfer.files); }
    },
  };
}
