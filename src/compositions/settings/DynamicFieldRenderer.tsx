/**
 * Renders dynamic form fields based on field definitions.
 * Maps each FieldType to the appropriate shadcn/ui input primitive.
 * Pure composition -- all data and callbacks via props.
 */
import type { FieldDefinition, FieldType } from "../../types/domain";
import { Input } from "../../primitives/input";
import { Label } from "../../primitives/label";
import { Switch } from "../../primitives/switch";
import { Checkbox } from "../../primitives/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../primitives/select";

export interface DynamicFieldRendererProps {
  definitions: FieldDefinition[];
  values: Record<string, unknown>;
  onChange: (fieldName: string, value: unknown) => void;
}

export function DynamicFieldRenderer({ definitions, values, onChange }: DynamicFieldRendererProps) {
  if (definitions.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      {definitions.map((def) => (
        <DynamicField key={def.fieldName} definition={def} value={values[def.fieldName]} onChange={(value) => onChange(def.fieldName, value)} />
      ))}
    </div>
  );
}

interface DynamicFieldProps { definition: FieldDefinition; value: unknown; onChange: (value: unknown) => void; }

function DynamicField({ definition, value, onChange }: DynamicFieldProps) {
  const { fieldName, fieldType, isRequired, description, options } = definition;
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={`field-${fieldName}`}>{fieldName}{isRequired && <span className="text-destructive ml-0.5">*</span>}</Label>
      {description && <p className="text-caption text-muted-foreground">{description}</p>}
      <FieldInput fieldName={fieldName} fieldType={fieldType} value={value} options={options} onChange={onChange} />
    </div>
  );
}

interface FieldInputProps { fieldName: string; fieldType: FieldType; value: unknown; options?: string[]; onChange: (value: unknown) => void; }

function FieldInput({ fieldName, fieldType, value, options, onChange }: FieldInputProps) {
  const id = `field-${fieldName}`;
  switch (fieldType) {
    case "text": return <Input id={id} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} />;
    case "number": return <Input id={id} type="number" value={typeof value === "number" ? value : ""} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)} />;
    case "boolean": return <Switch id={id} checked={value === true} onCheckedChange={(checked) => onChange(checked === true)} />;
    case "select": return (
      <Select value={typeof value === "string" ? value : ""} onValueChange={(v) => onChange(v)}>
        <SelectTrigger id={id}><SelectValue placeholder="Select..." /></SelectTrigger>
        <SelectContent>{(options ?? []).map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
      </Select>
    );
    case "multiSelect": return <MultiSelectField value={value} options={options} onChange={onChange} />;
    case "date": return <Input id={id} type="date" value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} />;
    case "url": return <Input id={id} type="url" value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} placeholder="https://..." />;
    case "email": return <Input id={id} type="email" value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)} placeholder="name@example.com" />;
  }
}

interface MultiSelectFieldProps { value: unknown; options?: string[]; onChange: (value: unknown) => void; }

function MultiSelectField({ value, options, onChange }: MultiSelectFieldProps) {
  const selected = Array.isArray(value) ? (value as string[]) : [];
  function toggleOption(opt: string) {
    const next = selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt];
    onChange(next);
  }
  return (
    <div className="flex flex-col gap-2">
      {(options ?? []).map((opt) => (
        <label key={opt} className="flex items-center gap-2"><Checkbox checked={selected.includes(opt)} onCheckedChange={() => toggleOption(opt)} /><span className="text-body">{opt}</span></label>
      ))}
    </div>
  );
}
