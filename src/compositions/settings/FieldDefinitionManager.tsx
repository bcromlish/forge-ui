/**
 * Manager component for custom field definitions.
 * Pure composition -- all data and callbacks via props.
 */
import type { FieldDefinition, FieldType, CustomFieldEntityType } from "../../types/domain";
import { Button } from "../../primitives/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../primitives/tabs";
import { FieldDefinitionRow } from "./FieldDefinitionRow";
import { Plus, FileText } from "lucide-react";

export interface CreateFieldDefinitionInput {
  entityType: CustomFieldEntityType;
  fieldName: string;
  fieldType: FieldType;
  options?: string[];
  isRequired: boolean;
  description?: string;
}

export interface FieldDefinitionManagerProps {
  definitions: (FieldDefinition & { _id: string })[];
  entityTypes: CustomFieldEntityType[];
  selectedEntityType: CustomFieldEntityType;
  onEntityTypeChange: (type: CustomFieldEntityType) => void;
  onAdd: (data: CreateFieldDefinitionInput) => Promise<void>;
  onUpdate: (id: string, data: Partial<FieldDefinition>) => void;
  onRemove: (id: string) => void;
  labels: FieldDefinitionManagerLabels;
}

export interface FieldDefinitionManagerLabels {
  title: string; description: string; addField: string; removeField: string;
  fieldName: string; fieldType: string; required: string; options: string;
  fieldDescription: string; emptyTitle: string; emptyDescription: string;
  entityTypes: Record<string, string>;
}

function defaultField(entityType: CustomFieldEntityType): CreateFieldDefinitionInput {
  return { entityType, fieldName: "", fieldType: "text", isRequired: false };
}

export function FieldDefinitionManager({
  definitions, entityTypes, selectedEntityType, onEntityTypeChange, onAdd, onUpdate, onRemove, labels,
}: FieldDefinitionManagerProps) {
  const rowLabels = { fieldName: labels.fieldName, fieldType: labels.fieldType, required: labels.required, options: labels.options, description: labels.fieldDescription, removeField: labels.removeField };

  return (
    <div className="flex flex-col gap-6">
      <div className="block-section">
        <h2 className="text-title-2">{labels.title}</h2>
        <p className="text-body text-muted-foreground">{labels.description}</p>
      </div>
      <Tabs value={selectedEntityType} onValueChange={(v) => onEntityTypeChange(v as CustomFieldEntityType)}>
        <TabsList className="flex-wrap">
          {entityTypes.map((type) => (<TabsTrigger key={type} value={type}>{labels.entityTypes[type] ?? type}</TabsTrigger>))}
        </TabsList>
        {entityTypes.map((type) => (
          <TabsContent key={type} value={type}>
            <FieldDefinitionList
              definitions={definitions} entityType={type} isActive={type === selectedEntityType}
              onAdd={onAdd} onUpdate={onUpdate} onRemove={onRemove} rowLabels={rowLabels} labels={labels}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface FieldDefinitionListProps {
  definitions: (FieldDefinition & { _id: string })[]; entityType: CustomFieldEntityType; isActive: boolean;
  onAdd: (data: CreateFieldDefinitionInput) => Promise<void>;
  onUpdate: (id: string, data: Partial<FieldDefinition>) => void;
  onRemove: (id: string) => void;
  rowLabels: { fieldName: string; fieldType: string; required: string; options: string; description: string; removeField: string };
  labels: FieldDefinitionManagerLabels;
}

function FieldDefinitionList({ definitions, entityType, isActive, onAdd, onUpdate, onRemove, rowLabels, labels }: FieldDefinitionListProps) {
  if (!isActive) return null;
  return (
    <div className="flex flex-col gap-4 mt-4">
      {definitions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground" /><h3 className="text-title-3">{labels.emptyTitle}</h3>
          <p className="text-body text-muted-foreground">{labels.emptyDescription}</p>
        </div>
      ) : (
        definitions.map((def) => (
          <FieldDefinitionRow key={def._id} definition={def} onUpdate={(data) => onUpdate(def._id, data)} onRemove={() => onRemove(def._id)} labels={rowLabels} />
        ))
      )}
      <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => onAdd(defaultField(entityType))}>
        <Plus className="h-3 w-3 mr-1" />{labels.addField}
      </Button>
    </div>
  );
}
