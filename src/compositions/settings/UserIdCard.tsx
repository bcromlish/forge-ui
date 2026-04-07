"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Check } from "lucide-react";
import { Button } from "../../primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../patterns/card";

/** Props for {@link UserIdCard}. */
interface UserIdCardProps {
  /** The user's Convex document ID. */
  userId: string;
}

/**
 * Read-only user ID display with copy-to-clipboard button.
 * Shows a brief check icon after successful copy.
 */
export function UserIdCard({ userId }: UserIdCardProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("settings.profile.userId");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may not be available in all contexts
    }
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <code className="flex-1 rounded-md bg-muted px-3 py-2 text-caption font-mono truncate">
            {userId}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            aria-label={t("copyAriaLabel")}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
