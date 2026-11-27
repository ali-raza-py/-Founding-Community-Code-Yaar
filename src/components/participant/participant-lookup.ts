"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { type AdminParticipantItem } from "@/lib/api/types";
import { normalizeParticipant, participantValue } from "@/lib/participant";

export interface ParticipantLookupEntry {
  id?: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
}

export interface ParticipantSelectorOption {
  id: string;
  userId: string;
  name: string;
  email: string;
  programme: string | null;
  programmeSlug: string | null;
  programId: string | null;
  status: string | null;
}

export interface UseParticipantLookupReturn {
  profiles: ParticipantLookupEntry[];
  profilesByUserId: Map<string, ParticipantLookupEntry>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Loads the profiles lookup once and provides consistent participant identity
 * resolution across the Admin Panel. This ensures the directory, profile page,
 * task selector, and all other pages display the same name/email/role.
 */
export function useParticipantLookup(): UseParticipantLookupReturn {
  const { accessToken, isAuthenticated, isAdmin } = useAuth();
  const [profiles, setProfiles] = useState<ParticipantLookupEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfiles = useCallback(async () => {
    if (!accessToken || !isAuthenticated || !isAdmin) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await communityApi.getAdminProfiles(accessToken);
      if (res.ok && Array.isArray(res.data)) {
        setProfiles(
          res.data.map((p) => ({
            id: p.id,
            full_name: p.full_name ?? null,
            email: p.email ?? null,
            role: p.role ?? null,
          })),
        );
      } else if (!res.ok) {
        setError(res.error.message || "Failed to load profiles.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profiles.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, isAuthenticated, isAdmin]);

  useEffect(() => {
    // Defer the asynchronous lookup until after this render commits.
    const timeoutId = window.setTimeout(() => void loadProfiles(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadProfiles]);

  const profilesByUserId = useMemo(() => {
    const map = new Map<string, ParticipantLookupEntry>();
    for (const p of profiles) {
      if (p.id) map.set(p.id, p);
    }
    return map;
  }, [profiles]);

  return {
    profiles,
    profilesByUserId,
    isLoading,
    error,
    refetch: loadProfiles,
  };
}

/**
 * Convert raw admin participant items into selector-friendly options with
 * deduplication by user_id (a person in both programmes appears once).
 */
export function buildSelectorOptions(
  participants: AdminParticipantItem[],
  profilesByUserId: Map<string, ParticipantLookupEntry>,
): ParticipantSelectorOption[] {
  const seenMemberships = new Set<string>();
  const options: ParticipantSelectorOption[] = [];

  for (const p of participants) {
    // A person may legitimately be active in more than one programme. Keep
    // each membership so filtering by programme never drops the matching row.
    const membershipKey = `${p.program_id}|${p.user_id}`;
    if (seenMemberships.has(membershipKey)) continue;
    seenMemberships.add(membershipKey);

    const np = normalizeParticipant(
      {
        ...p,
        full_name: p.full_name ?? undefined,
        email: p.email ?? undefined,
        profiles: p.profiles ?? undefined,
        programs: p.programs
          ? { name: p.programs.name ?? null, slug: p.programs.slug ?? null }
          : null,
      },
      profilesByUserId,
    );

    options.push({
      // Task assignments reference auth.users.id, not participants.id. The
      // latter is only a programme-membership row and causes backend UUID
      // validation/eligibility failures when submitted as assigned_to.
      id: p.user_id,
      userId: p.user_id,
      name: np.displayName || "Not provided",
      email: np.email || "No email",
      programme: np.programme,
      programmeSlug: np.programmeSlug,
      programId: p.program_id ?? null,
      status: np.status,
    });
  }

  return options.sort((a, b) => a.name.localeCompare(b.name));
}

export { participantValue, normalizeParticipant };
