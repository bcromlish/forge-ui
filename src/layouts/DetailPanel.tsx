"use client";

import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../primitives/sheet";
import { ScrollArea } from "../primitives/scroll-area";

/** Props for {@link DetailPanel}. */
interface DetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Slide-out detail panel for viewing entity details.
 * Wraps shadcn Sheet with consistent title, subtitle, and scrollable content area.
 */
export function DetailPanel({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
}: DetailPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>{title}</SheetTitle>
          {subtitle && <SheetDescription>{subtitle}</SheetDescription>}
        </SheetHeader>
        <ScrollArea className="flex-1 px-6 py-4">{children}</ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
