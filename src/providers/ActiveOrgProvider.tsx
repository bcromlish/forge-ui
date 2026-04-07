/**
 * ActiveOrgProvider — manages which organization is currently active in the UI.
 * Reads memberships via Convex, persists selection in localStorage, and provides
 * switchOrg() for instant client-side org switching.
 *
 * @see hooks/useActiveOrganization.ts for the consumer hook
 * @see convex/organizations.ts for listMyOrganizations query
 */
"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
// TODO: Replace with prop-based API
// import type { Id } from "@/convex/_generated/dataModel";
// TODO: Replace with prop-based API
// import { useMyOrganizations } from "@/features/organizations/hooks/useOrganization";

const STORAGE_KEY = "vidcruiter:activeOrgId";

export interface ActiveOrgContextValue {
  /** The active organization's ID. Undefined while loading. */
  organizationId: Id<"organizations"> | undefined;
  /** The full active organization object. Undefined while loading. */
  organization: OrgWithMembership | undefined;
  /** All organizations the user belongs to (active memberships). */
  memberships: OrgWithMembership[];
  /** Switch the active organization. Updates localStorage + context immediately. */
  switchOrg: (orgId: Id<"organizations">) => void;
  /** True while memberships are still loading from Convex. */
  isLoading: boolean;
}

/** Organization enriched with the user's membership role. */
type OrgWithMembership = NonNullable<
  Exclude<ReturnType<typeof useMyOrganizations>, undefined>[number]
>;

export const ActiveOrgContext = createContext<ActiveOrgContextValue | null>(
  null
);

export function ActiveOrgProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const orgs = useMyOrganizations();
  // Lazy initializer reads localStorage once on mount — avoids effect + cascading render
  const [selectedOrgId, setSelectedOrgId] = useState<
    Id<"organizations"> | undefined
  >(() => {
    if (typeof window === "undefined") return undefined;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (saved as Id<"organizations">) : undefined;
  });

  const validOrgs = useMemo(
    () => (orgs ? (orgs.filter(Boolean) as OrgWithMembership[]) : []),
    [orgs]
  );

  // Derive effective org ID: validate selection against loaded memberships.
  // Computed during render — no setState needed for the fallback case.
  const activeOrgId = useMemo(() => {
    if (orgs === undefined) return selectedOrgId; // still loading — trust localStorage
    if (validOrgs.length === 0) return undefined;
    const isValid = selectedOrgId && validOrgs.some((o) => o._id === selectedOrgId);
    return isValid ? selectedOrgId : validOrgs[0]!._id;
  }, [orgs, selectedOrgId, validOrgs]);

  // Persist fallback to localStorage (external system sync — no setState)
  const lastPersistedRef = useRef<string | undefined>(selectedOrgId);
  useEffect(() => {
    if (orgs === undefined) return;
    if (validOrgs.length === 0) {
      router.replace("/onboarding");
      return;
    }
    // Sync localStorage when the derived ID differs from what was last persisted
    if (activeOrgId && activeOrgId !== lastPersistedRef.current) {
      lastPersistedRef.current = activeOrgId;
      localStorage.setItem(STORAGE_KEY, activeOrgId);
    }
  }, [orgs, validOrgs, activeOrgId, router]);

  const switchOrg = useCallback((orgId: Id<"organizations">) => {
    setSelectedOrgId(orgId);
    lastPersistedRef.current = orgId;
    localStorage.setItem(STORAGE_KEY, orgId);
  }, []);

  const organization = useMemo(
    () => validOrgs.find((o) => o._id === activeOrgId),
    [validOrgs, activeOrgId]
  );

  const value = useMemo<ActiveOrgContextValue>(
    () => ({
      organizationId: activeOrgId,
      organization,
      memberships: validOrgs,
      switchOrg,
      isLoading: orgs === undefined,
    }),
    [activeOrgId, organization, validOrgs, switchOrg, orgs]
  );

  return (
    <ActiveOrgContext.Provider value={value}>
      {children}
    </ActiveOrgContext.Provider>
  );
}
