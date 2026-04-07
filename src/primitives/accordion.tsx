"use client"

import * as React from "react"
import { ChevronDownIcon, Plus, Minus } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "../lib/utils"

/** Visual variant for accordion items. */
type AccordionVariant = "default" | "outline" | "solid"

/** Indicator icon style for the trigger. */
type AccordionIndicator = "chevron" | "plus-minus"

interface AccordionContextValue {
  variant: AccordionVariant
  indicator: AccordionIndicator
}

const AccordionContext = React.createContext<AccordionContextValue>({
  variant: "default",
  indicator: "chevron",
})

/** Hook to read accordion variant/indicator from nearest Accordion root. */
function useAccordionContext() {
  return React.useContext(AccordionContext)
}

/** Props for the Accordion root — extends Radix with variant and indicator. */
type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root> & {
  /** Visual style: "default" (dividers), "outline" (bordered cards), "solid" (filled cards). */
  variant?: AccordionVariant
  /** Indicator icon: "chevron" (rotating arrow) or "plus-minus" (toggling +/−). */
  indicator?: AccordionIndicator
}

function Accordion({
  variant = "default",
  indicator = "chevron",
  className,
  ...props
}: AccordionProps) {
  return (
    <AccordionContext.Provider value={{ variant, indicator }}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        data-variant={variant}
        className={cn(
          variant !== "default" && "flex flex-col gap-3",
          className
        )}
        {...props}
      />
    </AccordionContext.Provider>
  )
}

const ITEM_VARIANTS: Record<AccordionVariant, string> = {
  default: "border-b last:border-b-0",
  outline: "rounded-lg border",
  solid: "rounded-lg bg-muted",
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const { variant } = useAccordionContext()
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(ITEM_VARIANTS[variant], className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const { variant, indicator } = useAccordionContext()
  const padded = variant !== "default"

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          indicator === "chevron" && "[&[data-state=open]>svg]:rotate-180",
          padded && "px-4",
          className
        )}
        {...props}
      >
        {children}
        {indicator === "chevron" ? (
          <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
        ) : (
          <>
            <Plus className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 [[data-state=open]>&]:hidden" />
            <Minus className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 [[data-state=closed]>&]:hidden" />
          </>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const { variant } = useAccordionContext()
  const padded = variant !== "default"

  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", padded && "px-4", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
export type { AccordionVariant, AccordionIndicator }
