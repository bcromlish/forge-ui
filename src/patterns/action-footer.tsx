import * as React from "react"

import { cn } from "../lib/utils"

/** Right-aligned button footer for dialogs and cards. Stacks on mobile, rows on desktop. */
function ActionFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="action-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

export { ActionFooter }
