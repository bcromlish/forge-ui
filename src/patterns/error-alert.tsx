import { cn } from "../lib/utils";

/** Props for {@link ErrorAlert}. */
interface ErrorAlertProps {
  /** Error message to display. Renders nothing when empty/undefined. */
  message?: string;
  className?: string;
}

/**
 * Inline error banner for action failures.
 * Renders nothing when message is falsy — safe to include unconditionally.
 */
export function ErrorAlert({ message, className }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        "bg-destructive/10 border border-destructive/25 text-destructive px-4 py-2 rounded-md text-body",
        className
      )}
    >
      {message}
    </div>
  );
}
