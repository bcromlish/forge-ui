"use client";

import { Mail, CheckCircle, Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../patterns/card";
import { Badge } from "../../primitives/badge";
import type { AuthMethod } from "../../types/domain";

interface AuthMethodsListProps {
  methods: AuthMethod[];
  error?: string;
  labels?: { title?: string; description?: string; verified?: string; noMethods?: string; loadError?: string };
}

function getProviderIcon(method: AuthMethod) {
  if (method.type === "email") return <Mail className="h-4 w-4 shrink-0" />;
  if (method.providerName === "GitHub") return <Github className="h-4 w-4 shrink-0" />;
  return <span className="flex h-4 w-4 shrink-0 items-center justify-center text-caption font-bold">{method.providerName.charAt(0)}</span>;
}

export function AuthMethodsList({ methods, error, labels = {} }: AuthMethodsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{labels.title ?? "Sign-in Methods"}</CardTitle>
        <CardDescription>{labels.description ?? "Manage your connected authentication methods."}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2">
            <p className="text-caption text-destructive">{labels.loadError ?? "Failed to load authentication methods."}</p>
          </div>
        )}
        {methods.map((method) => (
          <div key={method.id} className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">{getProviderIcon(method)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-body font-medium">{method.providerName}</p>
              <p className="text-caption text-muted-foreground truncate">{method.identifier}</p>
            </div>
            {method.verified && (
              <Badge variant="secondary" className="gap-1 shrink-0"><CheckCircle className="h-3 w-3" />{labels.verified ?? "Verified"}</Badge>
            )}
          </div>
        ))}
        {methods.length === 0 && (
          <p className="text-body text-muted-foreground py-4 text-center">{labels.noMethods ?? "No authentication methods connected."}</p>
        )}
      </CardContent>
    </Card>
  );
}
