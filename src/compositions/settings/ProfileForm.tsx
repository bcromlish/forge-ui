"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../patterns/card";
// TODO: Replace with prop-based API
// import { useUpdateProfile } from "@/features/users/hooks-current";
// TODO: Replace with prop-based API
// import { MAX_NAME_LENGTH } from "@/features/users/domain";

/** Props for {@link ProfileForm}. */
interface ProfileFormProps {
  /** Current user display name. */
  currentName: string;
}

/**
 * Editable display name form with save button.
 * Validates 1-64 character limit and shows toast on success/failure.
 */
export function ProfileForm({ currentName }: ProfileFormProps) {
  const [name, setName] = useState(currentName);
  const [isSaving, setIsSaving] = useState(false);
  const updateProfile = useUpdateProfile();
  const t = useTranslations("settings.profile.displayName");
  const tCommon = useTranslations("common");

  const isDirty = name.trim() !== currentName;
  const isValid = name.trim().length >= 1 && name.trim().length <= MAX_NAME_LENGTH;

  const handleSave = useCallback(async () => {
    if (!isDirty || !isValid) return;

    setIsSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      toast.success(t("success"));
    } catch (err) {
      const message = err instanceof Error ? err.message : t("error");
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }, [name, isDirty, isValid, updateProfile, t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
            placeholder={t("placeholder")}
            disabled={isSaving}
          />
          <p className="text-caption text-muted-foreground">
            {t("maxLength", { max: MAX_NAME_LENGTH })}
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <Button
          onClick={handleSave}
          disabled={!isDirty || !isValid || isSaving}
          size="sm"
        >
          {isSaving ? tCommon("saving") : tCommon("save")}
        </Button>
      </CardFooter>
    </Card>
  );
}
