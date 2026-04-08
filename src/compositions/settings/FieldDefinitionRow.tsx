/**
 * Inline editable row for a single custom field definition.
 * Pure composition -- all data and callbacks via props.
 */
import type { FieldDefinition, FieldType } from "../../types/domain";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";
import { Label } from "../../primitives/label";
import { Switch } from "../../primitives/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../primitives/select";
import { Trash2 } from "lucide-react";

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" }, { value: "number", label: "Number" }, { value: "boolean", label: "Boolean" },
  { value: "select", label: "Select" }, { value: "multiSelect", label: "Multi Select" },
  { value: "date", label: "Date" }, { value: "url", label: "URL" }, { value: "email", label: "Email" },
];

function hasOptions(fieldType: FieldType): boolean { return fieldType === "select" || fieldType === "multiSelect"; }

export interface FieldDefinitionRowProps {
  definition: FieldDefinition & { _id: string };
  onUpdate: (data: Partial<FieldDefinition>) => void;
  onRemove: () => void;
  labels: { fieldName: string; fieldType: string; required: string; options: string; description: string; removeField: string };
}

export function FieldDefinitionRow({ definition, onUpdate, onRemove, labels }: FieldDefinitionRowProps) {
  return (
    <div className="flex flex-col gap-3 border rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 flex flex-col gap-1.5">
          <Label className="text-caption">{labels.fieldName}</Label>
          <Input value={definition.fieldName} onChange={(e) => onUpdate({ fieldName: e.target.value })} placeholder={labels.fieldName} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-caption">{labels.fieldType}</Label>
          <Select value={definition.fieldType} onValueChange={(v) => onUpdate({ fieldType: v as FieldType })}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{FIELD_TYPES.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5 items-center">
          <Label className="text-caption">{labels.required}</Label>
          <Switch checked={definition.isRequired} onCheckedChange={(checked) => onUpdate({ isRequired: checked === true })} />
        </div>
        <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive mt-6" onClick={onRemove} aria-label={labels.removeField}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {hasOptions(definition.fieldType) && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-caption">{labels.options}</Label>
          <Input value={definition.options?.join(", ") ?? ""} onChange={(e) => onUpdate({ options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="Option 1, Option 2, Option 3" />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <Label className="text-caption">{labels.description}</Label>
        <Input value={definition.description ?? ""} onChange={(e) => onUpdate({ description: e.target.value || undefined })} placeholder={labels.description} />
      </div>
    </div>
  );
}
