"use client";

import { useState, useCallback } from "react";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../patterns/card";

const DEFAULT_MAX_NAME_LENGTH = 64;

interface ProfileFormProps {
  currentName: string;
  /** Save handler -- receives the new name. */
  onSave: (name: string) => Promise<void>;
  /** Maximum name length. Defaults to 64. */
  maxNameLength?: number;
  /** Labels for i18n. */
  labels?: {
    title?: string; description?: string; placeholder?: string; maxLength?: string;
    save?: string; saving?: string;
  };
}

export function ProfileForm({
  currentName, onSave, maxNameLength = DEFAULT_MAX_NAME_LENGTH, labels = {},
}: ProfileFormProps) {
  const [name, setName] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = name.trim() !== currentName;
  const isValid = name.trim().length >= 1 && name.trim().length <= maxNameLength;

  const handleSave = useCallback(async () => {
    if (!isDirty || !isValid) return;
    setIsSaving(true);
    try { await onSave(name.trim()); } finally { setIsSaving(false); }
  }, [name, isDirty, isValid, onSave]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{labels.title ?? "Display Name"}</CardTitle>
        <CardDescription>{labels.description ?? "Your public display name."}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={maxNameLength} placeholder={labels.placeholder ?? "Your name"} disabled={isSaving} />
          <p className="text-caption text-muted-foreground">{labels.maxLength ?? `Maximum ${maxNameLength} characters.`}</p>
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <Button onClick={handleSave} disabled={!isDirty || !isValid || isSaving} size="sm">
          {isSaving ? (labels.saving ?? "Saving...") : (labels.save ?? "Save")}
        </Button>
      </CardFooter>
    </Card>
  );
}
