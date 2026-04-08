"use client";

import { useRef, useState } from "react";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitives/avatar";
import { Button } from "../../primitives/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../patterns/card";

interface ProfileAvatarProps {
  name: string;
  email: string;
  avatarUrl?: string;
  hasUploadedAvatar?: boolean;
  /** Upload handler -- receives the selected File. Consumer handles storage. */
  onUpload?: (file: File) => Promise<void>;
  /** Remove handler -- consumer handles storage deletion. */
  onRemove?: () => Promise<void>;
  /** Validate a file before uploading. Return error string or null. */
  validateFile?: (file: { size: number; type: string }) => string | null;
  /** Labels for i18n. */
  labels?: {
    title?: string; description?: string; changePhoto?: string; removePhoto?: string;
    uploadSuccess?: string; uploadError?: string; removeSuccess?: string; removeError?: string;
  };
}

function getInitials(nameOrEmail: string): string {
  if (nameOrEmail.includes("@")) return nameOrEmail[0]?.toUpperCase() ?? "?";
  return nameOrEmail.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function ProfileAvatar({
  name, email, avatarUrl, hasUploadedAvatar, onUpload, onRemove, validateFile, labels = {},
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const displayName = name || email;
  const initials = getInitials(displayName);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;
    e.target.value = "";
    if (validateFile) {
      const error = validateFile({ size: file.size, type: file.type });
      if (error) return; // Consumer should handle validation error display
    }
    setIsUploading(true);
    try { await onUpload(file); } finally { setIsUploading(false); }
  }

  async function handleRemove() {
    if (!onRemove) return;
    setIsRemoving(true);
    try { await onRemove(); } finally { setIsRemoving(false); }
  }

  const isBusy = isUploading || isRemoving;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{labels.title ?? "Profile Photo"}</CardTitle>
        <CardDescription>{labels.description ?? "Upload or remove your profile photo."}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar size="xl">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
              <AvatarFallback name={displayName}>{initials}</AvatarFallback>
            </Avatar>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {onUpload && (
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isBusy}>
                <Camera className="mr-2 h-4 w-4" />{labels.changePhoto ?? "Change Photo"}
              </Button>
            )}
            {hasUploadedAvatar && onRemove && (
              <Button variant="ghost" size="sm" onClick={handleRemove} disabled={isBusy}>
                {isRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                {labels.removePhoto ?? "Remove Photo"}
              </Button>
            )}
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileChange} disabled={isBusy} />
      </CardContent>
    </Card>
  );
}
