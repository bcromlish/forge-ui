/**
 * Manager component for custom field definitions.
 * Shows entity type tabs, field list, and add/remove controls.
 * Pure composition — all data and callbacks via props.
 *
 * @see components/compositions/settings/FieldDefinitionRow.tsx
 * @see types/domain.ts for FieldDefinition, FieldType, CustomFieldEntityType
 */
// TODO: Replace with prop-based API
// import type { FieldDefinition, FieldType, CustomFieldEntityType } from "@/types/domain";
import { Button } from "../../primitives/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../primitives/tabs";
import { FieldDefinitionRow } from "./FieldDefinitionRow";
import { Plus, FileText } from "lucide-react";

/** Input shape for creating a new field definition. */
export interface CreateFieldDefinitionInput {
  entityType: CustomFieldEntityType;
  fieldName: string;
  fieldType: FieldType;
  options?: string[];
  isRequired: boolean;
  description?: string;
}

/** Props for {@link FieldDefinitionManager}. */
export interface FieldDefinitionManagerProps {
  /** Current field definitions for the selected entity type. */
  definitions: (FieldDefinition & { _id: string })[];
  /** Entity types available for selection. */
  entityTypes: CustomFieldEntityType[];
  /** Currently selected entity type. */
  selectedEntityType: CustomFieldEntityType;
  /** Callback when entity type tab changes. */
  onEntityTypeChange: (type: CustomFieldEntityType) => void;
  /** Callback to add a new field definition. */
  onAdd: (data: CreateFieldDefinitionInput) => Promise<void>;
  /** Callback to update a field definition. */
  onUpdate: (id: string, data: Partial<FieldDefinition>) => void;
  /** Callback to remove a field definition. */
  onRemove: (id: string) => void;
  /** i18n labels. */
  labels: FieldDefinitionManagerLabels;
}

/** i18n labels for the manager and child components. */
export interface FieldDefinitionManagerLabels {
  title: string;
  description: string;
  addField: string;
  removeField: string;
  fieldName: string;
  fieldType: string;
  required: string;
  options: string;
  fieldDescription: string;
  emptyTitle: string;
  emptyDescription: string;
  entityTypes: Record<string, string>;
}

/** Default field values for a newly added field definition. */
function defaultField(entityType: CustomFieldEntityType): CreateFieldDefinitionInput {
  return {
    entityType,
    fieldName: "",
    fieldType: "text",
    isRequired: false,
  };
}

/**
 * Full manager UI for custom field definitions.
 * Renders entity type tabs at top, list of editable field rows,
 * an "Add Field" button, and an empty state when no definitions exist.
 */
export function FieldDefinitionManager({
  definitions,
  entityTypes,
  selectedEntityType,
  onEntityTypeChange,
  onAdd,
  onUpdate,
  onRemove,
  labels,
}: FieldDefinitionManagerProps) {
  const rowLabels = {
    fieldName: labels.fieldName,
    fieldType: labels.fieldType,
    required: labels.required,
    options: labels.options,
    description: labels.fieldDescription,
    removeField: labels.removeField,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="block-section">
        <h2 className="text-title-2">{labels.title}</h2>
        <p className="text-body text-muted-foreground">{labels.description}</p>
      </div>

      <Tabs
        value={selectedEntityType}
        onValueChange={(v) => onEntityTypeChange(v as CustomFieldEntityType)}
      >
        <TabsList className="flex-wrap">
          {entityTypes.map((type) => (
            <TabsTrigger key={type} value={type}>
              {labels.entityTypes[type] ?? type}
            </TabsTrigger>
          ))}
        </TabsList>

        {entityTypes.map((type) => (
          <TabsContent key={type} value={type}>
            <FieldDefinitionList
              definitions={definitions}
              entityType={type}
              isActive={type === selectedEntityType}
              onAdd={onAdd}
              onUpdate={onUpdate}
              onRemove={onRemove}
              rowLabels={rowLabels}
              labels={labels}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal sub-component — field list with add button and empty state
// ---------------------------------------------------------------------------

/** Props for the internal field list. */
interface FieldDefinitionListProps {
  definitions: (FieldDefinition & { _id: string })[];
  entityType: CustomFieldEntityType;
  isActive: boolean;
  onAdd: (data: CreateFieldDefinitionInput) => Promise<void>;
  onUpdate: (id: string, data: Partial<FieldDefinition>) => void;
  onRemove: (id: string) => void;
  rowLabels: FieldDefinitionRowLabels;
  labels: FieldDefinitionManagerLabels;
}

/** Subset of labels forwarded to FieldDefinitionRow. */
type FieldDefinitionRowLabels = {
  fieldName: string;
  fieldType: string;
  required: string;
  options: string;
  description: string;
  removeField: string;
};

/** Renders the field list or empty state for a single entity type tab. */
function FieldDefinitionList({
  definitions,
  entityType,
  isActive,
  onAdd,
  onUpdate,
  onRemove,
  rowLabels,
  labels,
}: FieldDefinitionListProps) {
  if (!isActive) return null;

  return (
    <div className="flex flex-col gap-4 mt-4">
      {definitions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-title-3">{labels.emptyTitle}</h3>
          <p className="text-body text-muted-foreground">{labels.emptyDescription}</p>
        </div>
      ) : (
        definitions.map((def) => (
          <FieldDefinitionRow
            key={def._id}
            definition={def}
            onUpdate={(data) => onUpdate(def._id, data)}
            onRemove={() => onRemove(def._id)}
            labels={rowLabels}
          />
        ))
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => onAdd(defaultField(entityType))}
      >
        <Plus className="h-3 w-3 mr-1" />
        {labels.addField}
      </Button>
    </div>
  );
}
