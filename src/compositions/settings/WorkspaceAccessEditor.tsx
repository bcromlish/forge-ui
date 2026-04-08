"use client";

import { useCallback } from "react";
import { Checkbox } from "../../primitives/checkbox";
import { Label } from "../../primitives/label";
import { ScrollArea } from "../../primitives/scroll-area";
import { WORKSPACE_ICON_MAP } from "../../layouts/workspace-icons";
import { Briefcase } from "lucide-react";

/** Minimal workspace definition for the editor. */
export interface WorkspaceItem {
  id: string;
  label: string;
  iconName: string;
  description?: string;
}

interface WorkspaceAccessEditorProps {
  selected: string[];
  onChange: (workspaceIds: string[]) => void;
  disabled?: boolean;
  /** Workspace definitions to display. */
  workspaces?: WorkspaceItem[];
  /** Labels for i18n. */
  labels?: { selectAll?: string; deselectAll?: string };
  /** Optional label resolver. */
  resolveLabel?: (key: string) => string;
  /** Optional description resolver. */
  resolveDescription?: (key: string) => string;
}

export function WorkspaceAccessEditor({
  selected, onChange, disabled = false, workspaces = [],
  labels = {}, resolveLabel = (k) => k, resolveDescription = (k) => k,
}: WorkspaceAccessEditorProps) {
  const selectedSet = new Set(selected);

  const handleToggle = useCallback((workspaceId: string, checked: boolean) => {
    if (checked) onChange([...selected, workspaceId]);
    else onChange(selected.filter((id) => id !== workspaceId));
  }, [selected, onChange]);

  const handleSelectAll = useCallback(() => { onChange(workspaces.map((ws) => ws.id)); }, [onChange, workspaces]);
  const handleDeselectAll = useCallback(() => { onChange([]); }, [onChange]);

  const allSelected = workspaces.every((ws) => selectedSet.has(ws.id));
  const noneSelected = selected.length === 0;

  if (workspaces.length === 0) return null;

  return (
    <div className="space-y-3">
      {!disabled && (
        <div className="flex gap-3">
          <button type="button" onClick={handleSelectAll} disabled={allSelected}
            className="text-caption text-primary hover:underline disabled:text-muted-foreground disabled:no-underline">
            {labels.selectAll ?? "Select All"}
          </button>
          <button type="button" onClick={handleDeselectAll} disabled={noneSelected}
            className="text-caption text-primary hover:underline disabled:text-muted-foreground disabled:no-underline">
            {labels.deselectAll ?? "Deselect All"}
          </button>
        </div>
      )}
      <ScrollArea className="h-64">
        <div className="space-y-1 pr-3">
          {workspaces.map((ws) => {
            const Icon = WORKSPACE_ICON_MAP[ws.iconName] ?? Briefcase;
            const isChecked = selectedSet.has(ws.id);
            return (
              <label key={ws.id} className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-accent">
                <Checkbox checked={isChecked} onCheckedChange={(checked) => handleToggle(ws.id, checked === true)} disabled={disabled} />
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="grid min-w-0 gap-0.5">
                  <Label className="cursor-pointer text-body font-medium">{resolveLabel(ws.label)}</Label>
                  {ws.description && <span className="truncate text-caption text-muted-foreground">{resolveDescription(ws.description)}</span>}
                </div>
              </label>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
