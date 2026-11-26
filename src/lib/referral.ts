/**
 * Referral helpers for the Code Yaar Global Ambassador Programme.
 *
 * Backed by the Code Yaar Community API. Each approved ambassador has a
 * unique referral code owned by their participant record
 * (`referrals.participant_id -> participants.id -> profiles.id`). The public
 * application form validates referral codes server-side and attributes
 * applications to the referring ambassador.
 *
 * No codes are hardcoded here. Codes are generated server-side and resolved
 * through the API.
 */

export const REQUIRED_REFERRALS = 5;

export const COHORT_REFERRAL_KEY = "codeyaar.cohort-referral.v1";

/** Production application route that accepts a ?ref= referral parameter. */
export const APPLICATION_ROUTE = "/apply";

/** Builds the shareable referral URL for the founding cohort application. */
export function buildReferralUrl(referralCode: string): string {
  const base =
    typeof window !== "undefined" ? window.location.origin : "https://contact.codeyaar.tech";
  return `${base}${APPLICATION_ROUTE}?ref=${encodeURIComponent(referralCode)}`;
}

/** Extracts a referral code from a URL query string. Validation is server-side. */
export function extractReferralCode(search: string): string | null {
  try {
    const params = new URLSearchParams(search);
    const code = params.get("ref");
    if (!code || code.trim() === "") return null;
    return code.trim();
  } catch {
    return null;
  }
}

interface MyReferral {
  id: string;
  participant_id: string;
  referral_code: string;
  total_registrations: number;
  verified_registrations: number;
  created_at: string;
  ambassador_name: string | null;
  ambassador_email: string | null;
  registrations?: Array<{
    id: string;
    registered_email: string;
    verification_status: string;
    created_at: string;
  }>;
}

/** Fetch the current authenticated ambassador's referral record from the API. */
export async function getMyReferral(
  accessToken: string
): Promise<{ ok: boolean; data: MyReferral | null; error?: string }> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_COMMUNITY_API_URL ?? "https://codeyaar-community-api.codeyaar-education.workers.dev"}/api/v1/referrals/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) {
      if (res.status === 404) return { ok: true, data: null };
      return { ok: false, data: null, error: `HTTP ${res.status}` };
    }
    const body = (await res.json()) as {
      success?: boolean;
      data?: MyReferral;
      error?: string;
    };
    if (!body?.success) return { ok: false, data: null, error: body.error ?? "Lookup failed" };
    return { ok: true, data: body.data ?? null };
  } catch (err) {
    return {
      ok: false,
      data: null,
      error: err instanceof Error ? err.message : "Lookup failed",
    };
  }
}
