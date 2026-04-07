import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "../lib/utils"

/**
 * Keyboard-key base styles shared across all variants.
 * Adds tactile press animation, snappy transitions, and non-selectable text.
 */
const keyBase = [
  "inline-flex items-center justify-center gap-2 whitespace-nowrap",
  "rounded-md text-sm font-medium",
  "transition-[transform,box-shadow] duration-100 ease-out",
  "active:scale-[0.98] active:translate-y-px",
  "select-none cursor-default",
  "disabled:pointer-events-none disabled:opacity-50",
  "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  "shrink-0 [&_svg]:shrink-0",
  "outline-none",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  "aria-invalid:border-destructive",
].join(" ")

const keyboardButtonVariants = cva(keyBase, {
  variants: {
    variant: {
      default: [
        "bg-primary text-primary-foreground",
        "border border-black/15 dark:border-white/10",
        "shadow-[0_2px_0_0_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.1),inset_0_1px_0_0_rgba(255,255,255,0.1)]",
        "active:shadow-[0_0_0_0_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.1)]",
        "hover:brightness-110",
        "dark:shadow-[0_2px_0_0_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)]",
        "dark:active:shadow-[0_0_0_0_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.3)]",
      ].join(" "),
      destructive: [
        "bg-destructive text-white",
        "border border-black/15 dark:border-white/10",
        "shadow-[0_2px_0_0_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.15)]",
        "active:shadow-[0_0_0_0_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.12)]",
        "hover:bg-destructive/90",
        "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        "dark:bg-destructive/60",
        "dark:shadow-[0_2px_0_0_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.08)]",
        "dark:active:shadow-[0_0_0_0_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,0,0,0.3)]",
      ].join(" "),
      outline: [
        "border bg-background text-foreground",
        "shadow-[0_2px_0_0_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.5)]",
        "active:shadow-[0_0_0_0_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.06)]",
        "hover:bg-accent hover:text-accent-foreground",
        "dark:bg-input/30 dark:border-input",
        "dark:shadow-[0_2px_0_0_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.04)]",
        "dark:active:shadow-[0_0_0_0_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.2)]",
        "dark:hover:bg-input/50",
      ].join(" "),
      secondary: [
        "bg-secondary text-secondary-foreground",
        "border border-black/8 dark:border-white/10",
        "shadow-[0_2px_0_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.7)]",
        "active:shadow-[0_0_0_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.06)]",
        "hover:bg-secondary/80",
        "dark:shadow-[0_2px_0_0_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.05)]",
        "dark:active:shadow-[0_0_0_0_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.3)]",
      ].join(" "),
      ghost: [
        "hover:bg-accent hover:text-accent-foreground",
        "hover:shadow-[0_2px_0_0_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.06),inset_0_1px_0_0_rgba(255,255,255,0.5)]",
        "active:shadow-[0_0_0_0_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.06)]",
        "dark:hover:bg-accent/50",
        "dark:hover:shadow-[0_2px_0_0_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.04)]",
        "dark:active:shadow-[0_0_0_0_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.2)]",
      ].join(" "),
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
      sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9",
      "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
      "icon-sm": "size-8",
      "icon-lg": "size-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

/** Rounding overrides for keyboard-row edge keys. */
const edgeClasses: Record<string, string> = {
  left: "rounded-l-lg rounded-r-sm",
  right: "rounded-r-lg rounded-l-sm",
}

/**
 * Mac-style keyboard key button — experimental.
 *
 * Same API as `Button` but with 3D key visual treatment: layered shadows for
 * depth, an inset top-edge highlight, and a tactile press animation.
 */
function KeyboardButton({
  className,
  variant = "default",
  size = "default",
  edge,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof keyboardButtonVariants> & {
    /** Asymmetric rounding for keyboard-row edge keys. */
    edge?: "left" | "right"
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="keyboard-button"
      data-variant={variant}
      data-size={size}
      className={cn(
        keyboardButtonVariants({ variant, size }),
        edge && edgeClasses[edge],
        className
      )}
      {...props}
    />
  )
}

export { KeyboardButton, keyboardButtonVariants }
