"use client";

import type { ComponentProps } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../primitives/collapsible";
import { cn } from "../../lib/utils";
import { BookIcon, ChevronDownIcon } from "lucide-react";
import { createContext, useContext } from "react";

/** Context flag indicating children are inside a Sources (Collapsible) parent. */
const SourcesContext = createContext(false);

/** Returns true when the component is rendered inside a Sources wrapper. */
const useInsideSources = () => useContext(SourcesContext);

export type SourcesProps = ComponentProps<"div">;

export const Sources = ({ className, ...props }: SourcesProps) => (
  <SourcesContext.Provider value={true}>
    <Collapsible
      className={cn("not-prose mb-4 text-primary text-caption", className)}
      {...props}
    />
  </SourcesContext.Provider>
);

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  count: number;
};

export const SourcesTrigger = ({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) => {
  const insideSources = useInsideSources();

  const inner = children ?? (
    <>
      <p className="font-medium">Used {count} sources</p>
      <ChevronDownIcon className="h-4 w-4" />
    </>
  );

  // Outside a Collapsible parent, render as a plain div
  if (!insideSources) {
    return (
      <div
        className={cn("flex items-center gap-2", className)}
        {...(props as ComponentProps<"div">)}
      >
        {inner}
      </div>
    );
  }

  return (
    <CollapsibleTrigger
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {inner}
    </CollapsibleTrigger>
  );
};

export type SourcesContentProps = ComponentProps<typeof CollapsibleContent>;

export const SourcesContent = ({
  className,
  ...props
}: SourcesContentProps) => {
  const insideSources = useInsideSources();

  // Outside a Collapsible parent, render as a plain div
  if (!insideSources) {
    return (
      <div
        className={cn("mt-3 flex w-fit flex-col gap-2", className)}
        {...(props as ComponentProps<"div">)}
      />
    );
  }

  return (
    <CollapsibleContent
      className={cn(
        "mt-3 flex w-fit flex-col gap-2",
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
        className
      )}
      {...props}
    />
  );
};

export type SourceProps = ComponentProps<"a">;

export const Source = ({ href, title, children, ...props }: SourceProps) => (
  <a
    className="flex items-center gap-2"
    href={href}
    rel="noreferrer"
    target="_blank"
    {...props}
  >
    {children ?? (
      <>
        <BookIcon className="h-4 w-4" />
        <span className="block font-medium">{title}</span>
      </>
    )}
  </a>
);
