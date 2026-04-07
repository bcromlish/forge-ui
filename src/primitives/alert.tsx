import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "../lib/utils"

/**
 * Maps color variants to their CSS custom property role prefix.
 * Each role resolves to 6 primitives defined in `app/styles/color-roles.css`:
 * fg, fg-muted, bg, bg-emphasis, border, border-emphasis.
 */
const ROLE_MAP: Record<string, string> = {
  info: "accent",
  success: "success",
  warning: "warning",
  destructive: "destructive",
  ai: "ai",
  neutral: "files",
}

/** Builds inline `--alert-*` CSS vars from color-roles for a given variant. */
function buildAlertVars(variant: string | undefined): React.CSSProperties | undefined {
  const role = variant ? ROLE_MAP[variant] : undefined
  if (!role) return undefined
  return {
    "--alert-fg": `var(--${role}-fg)`,
    "--alert-fg-muted": `var(--${role}-fg-muted)`,
    "--alert-bg": `var(--${role}-bg)`,
    "--alert-bg-emphasis": `var(--${role}-bg-emphasis)`,
    "--alert-border": `var(--${role}-border)`,
    "--alert-border-emphasis": `var(--${role}-border-emphasis)`,
  } as React.CSSProperties
}

const alertVariants = cva(
  "relative w-full rounded-md border px-4 py-3 text-body grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        info: "",
        success: "",
        warning: "",
        destructive: "",
        ai: "",
        neutral: "",
      },
      appearance: {
        soft: "bg-[var(--alert-bg)] text-[var(--alert-fg)] border-[var(--alert-border)] [&>svg]:text-[var(--alert-fg)]",
        solid:
          "bg-[var(--alert-bg-emphasis)] text-white border-transparent [&>svg]:text-white/90",
      },
    },
    defaultVariants: {
      variant: "neutral",
      appearance: "soft",
    },
  }
)

type AlertVariantProps = VariantProps<typeof alertVariants>

interface AlertProps extends React.ComponentProps<"div">, AlertVariantProps {
  /** Callback when dismiss button is clicked. Renders close button when set. */
  onClose?: () => void
  /** Override auto-detection of close button. `false` hides it even when `onClose` is set. */
  closable?: boolean
}

function Alert({
  className,
  variant = "neutral",
  appearance = "soft",
  onClose,
  closable,
  style,
  children,
  ...props
}: AlertProps) {
  const showClose = closable ?? !!onClose
  const roleVars = buildAlertVars(variant ?? undefined)

  return (
    <div
      data-slot="alert"
      data-appearance={appearance ?? undefined}
      role="alert"
      className={cn(
        alertVariants({ variant, appearance }),
        showClose && "pr-8",
        className
      )}
      style={roleVars ? { ...roleVars, ...style } : style}
      {...props}
    >
      {children}
      {showClose && <AlertClose onClick={onClose} />}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 text-body-bold",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-body col-start-2 grid justify-items-start gap-1 [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function AlertClose({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="alert-close"
      type="button"
      aria-label="Dismiss"
      className={cn(
        "absolute right-3 top-3 inline-flex size-4 items-center justify-center rounded-sm text-current opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      <X className="size-4" />
      <span className="sr-only">Dismiss</span>
    </button>
  )
}

/** Flex row container for action links inside an alert. */
function AlertActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-actions"
      className={cn("col-start-2 mt-2 flex items-center gap-3", className)}
      {...props}
    />
  )
}

interface AlertActionProps extends React.ComponentProps<"button"> {
  /** Merge props onto child element instead of rendering a `<button>`. */
  asChild?: boolean
}

/** Styled action link/button inside AlertActions. Supports `asChild` for custom elements. */
function AlertAction({ className, asChild, ...props }: AlertActionProps) {
  const sharedClass = cn(
    "text-body-bold underline underline-offset-4 hover:opacity-80 transition-opacity",
    className
  )
  if (asChild) {
    return (
      <Slot.Root data-slot="alert-action" className={sharedClass} {...props} />
    )
  }
  return (
    <button
      data-slot="alert-action"
      type="button"
      className={sharedClass}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertClose, AlertActions, AlertAction }
