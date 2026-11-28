import type { AdminParticipantItem } from "@/lib/api/types";

/** A single, consistent representation of a participant used by both the
 * participant listing table and the participant profile modal.
 *
 * It merges every available source for each field so the listing and the
 * modal never disagree:
 *   - embedded `profiles` on the participant row
 *   - a separate profiles lookup keyed by `user_id`
 *   - top-level `full_name`/`email` when the API returns them
 *
 * Fields that are genuinely absent are left as null/empty so the UI can
 * render "Not provided" instead of a raw UUID or an incorrect placeholder.
 */
export interface NormalizedParticipant {
  id: string;
  userId: string;
  applicationId: string | null;
  programId: string | null;
  programme: string | null;
  programmeSlug: string | null;
  displayName: string;
  email: string;
  role: string | null;
  status: string | null;
  joinedAt: string | null;
  createdAt: string | null;
}

export interface ParticipantProfileLookup {
  full_name: string | null;
  email: string | null;
  role: string | null;
}

export interface NormalizableParticipant
  extends Omit<
    AdminParticipantItem,
    "profiles" | "programs"
  > {
  full_name?: string | null;
  email?: string | null;
  profiles?: {
    full_name: string | null;
    email: string | null;
    role: string | null;
  } | null;
  programs?: { name: string | null; slug: string | null } | null;
}

export function normalizeParticipant(
  item: NormalizableParticipant,
  lookups?: Map<string, ParticipantProfileLookup>,
): NormalizedParticipant {
  const embedded = item.profiles ?? null;
  const lookup = lookups?.get(item.user_id) ?? null;

  return {
    id: item.id,
    userId: item.user_id,
    applicationId: item.application_id ?? null,
    programId: item.program_id ?? null,
    programme: item.programs?.name ?? null,
    programmeSlug: item.programs?.slug ?? null,
    displayName:
      item.full_name || embedded?.full_name || lookup?.full_name || "",
    email:
      item.email || embedded?.email || lookup?.email || "",
    role: embedded?.role ?? lookup?.role ?? null,
    status: item.participant_status ?? null,
    joinedAt: item.joined_at ?? null,
    createdAt: item.created_at ?? null,
  };
}

/** Render a normalized value, falling back to "Not provided" when absent. */
export function participantValue(value: string | null | undefined): string {
  if (value === null || value === undefined) return "Not provided";
  const trimmed = String(value).trim();
  return trimmed.length === 0 ? "Not provided" : trimmed;
}
