"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "../../primitives/checkbox";
import { Label } from "../../primitives/label";
import { ScrollArea } from "../../primitives/scroll-area";
// TODO: Replace with prop-based API
// import { WORKSPACES } from "@/features/organizations/domain/workspaces";
import { WORKSPACE_ICON_MAP } from "../../layouts/workspace-icons";
import { Briefcase } from "lucide-react";

/** Props for {@link WorkspaceAccessEditor}. */
interface WorkspaceAccessEditorProps {
  /** Currently selected workspace IDs. */
  selected: string[];
  /** Callback when selection changes. */
  onChange: (workspaceIds: string[]) => void;
  /** If true, all checkboxes are disabled (e.g., for owners who get all access). */
  disabled?: boolean;
}

/**
 * Multi-select workspace picker with checkboxes.
 * Displays all 13 workspaces with icons, labels, and descriptions.
 * Used in EditMemberDialog and InviteMemberDialog for workspace selection.
 */
export function WorkspaceAccessEditor({
  selected,
  onChange,
  disabled = false,
}: WorkspaceAccessEditorProps) {
  const tWs = useTranslations("navigation.workspaces");
  const tDesc = useTranslations("navigation.workspaceDescriptions");

  const selectedSet = new Set(selected);

  const handleToggle = useCallback(
    (workspaceId: string, checked: boolean) => {
      if (checked) {
        onChange([...selected, workspaceId]);
      } else {
        onChange(selected.filter((id) => id !== workspaceId));
      }
    },
    [selected, onChange]
  );

  const handleSelectAll = useCallback(() => {
    const allIds = WORKSPACES.map((ws) => ws.id);
    onChange(allIds);
  }, [onChange]);

  const handleDeselectAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  const allSelected = WORKSPACES.every((ws) => selectedSet.has(ws.id));
  const noneSelected = selected.length === 0;

  return (
    <div className="space-y-3">
      {!disabled && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={allSelected}
            className="text-caption text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
          >
            {tWs("selectAll" as never) ?? "Select All"}
          </button>
          <button
            type="button"
            onClick={handleDeselectAll}
            disabled={noneSelected}
            className="text-caption text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
          >
            {tWs("deselectAll" as never) ?? "Deselect All"}
          </button>
        </div>
      )}
      <ScrollArea className="h-64">
        <div className="space-y-1 pr-3">
          {WORKSPACES.map((ws) => {
            const Icon = WORKSPACE_ICON_MAP[ws.iconName] ?? Briefcase;
            const isChecked = selectedSet.has(ws.id);

            return (
              <label
                key={ws.id}
                className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-accent"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleToggle(ws.id, checked === true)
                  }
                  disabled={disabled}
                />
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="grid min-w-0 gap-0.5">
                  <Label className="cursor-pointer text-body font-medium">
                    {tWs(ws.label as never)}
                  </Label>
                  <span className="truncate text-caption text-muted-foreground">
                    {tDesc(ws.label as never)}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
