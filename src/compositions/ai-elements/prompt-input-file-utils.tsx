import type { FileUIPart } from "ai";

import { nanoid } from "nanoid";

/** Validate files against accept patterns and size/count limits. */
export function validateAndPrepareFiles(
  fileList: File[] | FileList,
  options: {
    accept?: string;
    maxFiles?: number;
    maxFileSize?: number;
    currentCount?: number;
    onError?: (err: { code: "max_files" | "max_file_size" | "accept"; message: string }) => void;
  }
): File[] {
  const { accept, maxFiles, maxFileSize, currentCount = 0, onError } = options;
  const incoming = [...fileList];

  // Filter by accept pattern
  const accepted = accept
    ? incoming.filter((f) => matchesAcceptPattern(f, accept))
    : incoming;
  if (incoming.length > 0 && accepted.length === 0) {
    onError?.({ code: "accept", message: "No files match the accepted types." });
    return [];
  }

  // Filter by size
  const sized = maxFileSize ? accepted.filter((f) => f.size <= maxFileSize) : accepted;
  if (accepted.length > 0 && sized.length === 0) {
    onError?.({ code: "max_file_size", message: "All files exceed the maximum size." });
    return [];
  }

  // Cap by count
  const capacity = typeof maxFiles === "number" ? Math.max(0, maxFiles - currentCount) : undefined;
  const capped = typeof capacity === "number" ? sized.slice(0, capacity) : sized;
  if (typeof capacity === "number" && sized.length > capacity) {
    onError?.({ code: "max_files", message: "Too many files. Some were not added." });
  }

  return capped;
}

/** Check if a file matches an accept pattern string (e.g. "image/*,application/pdf"). */
function matchesAcceptPattern(f: File, accept: string): boolean {
  if (!accept || accept.trim() === "") {
    return true;
  }
  const patterns = accept.split(",").map((s) => s.trim()).filter(Boolean);
  return patterns.some((pattern) => {
    if (pattern.endsWith("/*")) {
      return f.type.startsWith(pattern.slice(0, -1));
    }
    return f.type === pattern;
  });
}

/** Convert validated Files to FileUIPart items with blob URLs and generated IDs. */
export function filesToParts(files: File[]): (FileUIPart & { id: string })[] {
  return files.map((file) => ({
    filename: file.name,
    id: nanoid(),
    mediaType: file.type,
    type: "file" as const,
    url: URL.createObjectURL(file),
  }));
}

/** Revoke blob URLs for a list of file parts to prevent memory leaks. */
export function revokeFileUrls(files: { url?: string }[]): void {
  for (const f of files) {
    if (f.url) {
      URL.revokeObjectURL(f.url);
    }
  }
}
