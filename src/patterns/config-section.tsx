import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../primitives/accordion";
import { cn } from "../lib/utils";

/**
 * Props for {@link ConfigSection}.
 *
 * @see ConfigSection for collapsible folder sections in config panels
 */
export interface ConfigSectionProps {
  /** Section heading text. */
  title: string;
  /** Whether the section starts expanded. Defaults to true. */
  defaultOpen?: boolean;
  /** Section content — typically a stack of ConfigRow components. */
  children: ReactNode;
  /** Additional CSS classes for the outer wrapper. */
  className?: string;
}

/**
 * Collapsible folder section for config panels — DialKit-inspired.
 * Wraps Accordion primitives with compact styling.
 */
export function ConfigSection({
  title,
  defaultOpen = true,
  children,
  className,
}: ConfigSectionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? "section" : undefined}
      className={cn(className)}
    >
      <AccordionItem value="section" className="border-b-0">
        <AccordionTrigger className="py-2 text-caption-bold hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent className="pb-3">
          <div className="space-y-3">{children}</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
