/**
 * ActiveOrgProvider -- manages which organization is currently active in the UI.
 * Accepts organizations as a prop instead of fetching from Convex.
 * Persists selection in localStorage and provides switchOrg() for instant switching.
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

const STORAGE_KEY = "forge-ui:activeOrgId";

/** Minimal organization shape with membership context. */
export interface OrgWithMembership {
  _id: string;
  name: string;
  [key: string]: unknown;
}

export interface ActiveOrgContextValue {
  /** The active organization's ID. Undefined while loading. */
  organizationId: string | undefined;
  /** The full active organization object. Undefined while loading. */
  organization: OrgWithMembership | undefined;
  /** All organizations the user belongs to (active memberships). */
  memberships: OrgWithMembership[];
  /** Switch the active organization. Updates localStorage + context immediately. */
  switchOrg: (orgId: string) => void;
  /** True while memberships are still loading. */
  isLoading: boolean;
}

export const ActiveOrgContext = createContext<ActiveOrgContextValue | null>(
  null
);

/** Props for {@link ActiveOrgProvider}. */
interface ActiveOrgProviderProps {
  children: React.ReactNode;
  /** Organizations the user belongs to. Undefined means loading. */
  organizations: OrgWithMembership[] | undefined;
  /** Route to redirect to when user has no organizations. */
  onboardingRoute?: string;
}

export function ActiveOrgProvider({
  children,
  organizations,
  onboardingRoute = "/onboarding",
}: ActiveOrgProviderProps) {
  const router = useRouter();
  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ?? undefined;
  });

  const validOrgs = useMemo(
    () => (organizations ? organizations.filter(Boolean) : []),
    [organizations]
  );

  const activeOrgId = useMemo(() => {
    if (organizations === undefined) return selectedOrgId;
    if (validOrgs.length === 0) return undefined;
    const isValid = selectedOrgId && validOrgs.some((o) => o._id === selectedOrgId);
    return isValid ? selectedOrgId : validOrgs[0]!._id;
  }, [organizations, selectedOrgId, validOrgs]);

  const lastPersistedRef = useRef<string | undefined>(selectedOrgId);
  useEffect(() => {
    if (organizations === undefined) return;
    if (validOrgs.length === 0) {
      router.replace(onboardingRoute);
      return;
    }
    if (activeOrgId && activeOrgId !== lastPersistedRef.current) {
      lastPersistedRef.current = activeOrgId;
      localStorage.setItem(STORAGE_KEY, activeOrgId);
    }
  }, [organizations, validOrgs, activeOrgId, router, onboardingRoute]);

  const switchOrg = useCallback((orgId: string) => {
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
      isLoading: organizations === undefined,
    }),
    [activeOrgId, organization, validOrgs, switchOrg, organizations]
  );

  return (
    <ActiveOrgContext.Provider value={value}>
      {children}
    </ActiveOrgContext.Provider>
  );
}
