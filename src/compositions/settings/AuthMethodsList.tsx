"use client";

import { useTranslations } from "next-intl";
import { Mail, CheckCircle, Github } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../patterns/card";
import { Badge } from "../../primitives/badge";
// TODO: Replace with prop-based API
// import type { AuthMethod } from "@/types/auth";

/** Props for {@link AuthMethodsList}. */
interface AuthMethodsListProps {
  /** Connected authentication methods to display. */
  methods: AuthMethod[];
  /** Optional error message shown as a warning banner. */
  error?: string;
}

/** Maps provider names to icon components. */
function getProviderIcon(method: AuthMethod) {
  if (method.type === "email") {
    return <Mail className="h-4 w-4 shrink-0" />;
  }
  if (method.providerName === "GitHub") {
    return <Github className="h-4 w-4 shrink-0" />;
  }
  // Generic OAuth icon for other providers
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-caption font-bold">
      {method.providerName.charAt(0)}
    </span>
  );
}

/**
 * Displays connected sign-in methods as a card list.
 * Shows provider icon, name, account identifier, and verification status.
 * Read-only for now -- managing connections happens in WorkOS dashboard.
 */
export function AuthMethodsList({ methods, error }: AuthMethodsListProps) {
  const t = useTranslations("settings.authentication");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("signInMethods")}</CardTitle>
        <CardDescription>
          {t("signInMethodsDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2">
            <p className="text-caption text-destructive">
              {t("loadError")}
            </p>
          </div>
        )}
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
              {getProviderIcon(method)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body font-medium">{method.providerName}</p>
              <p className="text-caption text-muted-foreground truncate">
                {method.identifier}
              </p>
            </div>
            {method.verified && (
              <Badge variant="secondary" className="gap-1 shrink-0">
                <CheckCircle className="h-3 w-3" />
                {t("verified")}
              </Badge>
            )}
          </div>
        ))}
        {methods.length === 0 && (
          <p className="text-body text-muted-foreground py-4 text-center">
            {t("noMethods")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
