import { Search, X } from "lucide-react";
import { Input } from "../primitives/input";
import { Button } from "../primitives/button";
import { cn } from "../lib/utils";

/** Props for {@link SearchInput}. */
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

/**
 * Search input with search icon and clear button.
 * Accepts controlled `value`/`onChange`. Debounce is the caller's responsibility.
 */
export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-8"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon-xs"
          className="absolute right-1.5 top-1/2 -translate-y-1/2"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
