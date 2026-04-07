"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitives/avatar";
import { Button } from "../../primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../patterns/card";
// import {
//   useGenerateAvatarUploadUrl,
//   useUpdateAvatar,
//   useRemoveAvatar,
// TODO: Replace with prop-based API
// } from "@/features/users/hooks-current";
// TODO: Replace with prop-based API
// import { validateAvatarUpload } from "@/features/users/domain";

/** Props for {@link ProfileAvatar}. */
interface ProfileAvatarProps {
  /** User's display name (used for initials fallback). */
  name: string;
  /** User's email (fallback if name is empty). */
  email: string;
  /** Optional avatar image URL. */
  avatarUrl?: string;
  /** Whether the user has an uploaded avatar (vs WorkOS-provided). */
  hasUploadedAvatar?: boolean;
}

/** Get initials from a name or email. Falls back to first letter of email. */
function getInitials(nameOrEmail: string): string {
  if (nameOrEmail.includes("@")) {
    return nameOrEmail[0]?.toUpperCase() ?? "?";
  }
  return nameOrEmail
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Interactive avatar card with upload/remove support.
 * Uses Convex file storage for uploads with client-side validation.
 */
export function ProfileAvatar({
  name,
  email,
  avatarUrl,
  hasUploadedAvatar,
}: ProfileAvatarProps) {
  const t = useTranslations("settings.profile.avatar");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const generateUploadUrl = useGenerateAvatarUploadUrl();
  const updateAvatar = useUpdateAvatar();
  const removeAvatar = useRemoveAvatar();

  const displayName = name || email;
  const initials = getInitials(displayName);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be re-selected
    e.target.value = "";

    const validation = validateAvatarUpload({
      size: file.size,
      type: file.type,
    });
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await response.json();
      await updateAvatar({ storageId });
      toast.success(t("uploadSuccess"));
    } catch {
      toast.error(t("uploadError"));
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemove() {
    setIsRemoving(true);
    try {
      await removeAvatar();
      toast.success(t("removeSuccess"));
    } catch {
      toast.error(t("removeError"));
    } finally {
      setIsRemoving(false);
    }
  }

  const isBusy = isUploading || isRemoving;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar size="xl">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
              <AvatarFallback name={displayName}>
                {initials}
              </AvatarFallback>
            </Avatar>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
            >
              <Camera className="mr-2 h-4 w-4" />
              {t("changePhoto")}
            </Button>
            {hasUploadedAvatar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={isBusy}
              >
                {isRemoving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {t("removePhoto")}
              </Button>
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
          disabled={isBusy}
        />
      </CardContent>
    </Card>
  );
}
