/**
 * Referral helpers for the Code Yaar Global Ambassador Programme.
 *
 * This is a frontend-only site with no backend. Referral codes are manually
 * assigned by the Code Yaar team and configured in this file. The referral
 * URL flow (?ref= capture) is preserved here.
 */

/** Required number of qualified referrals for the ambassador referral stage. */
export const REQUIRED_REFERRALS = 5;

/** Referral code prefix. */
export const REFERRAL_CODE_PREFIX = "CY26";

/** Session storage key for the captured referral code. */
export const COHORT_REFERRAL_KEY = "codeyaar.cohort-referral.v1";

/**
 * Manually assigned ambassador referral codes.
 *
 * These are configured by the Code Yaar team. Each entry maps an ambassador
 * email to their assigned referral code. Add new ambassadors here as they
 * are shortlisted.
 */
export const AMBASSADOR_REFERRAL_CODES: Record<string, string> = {
  // Example:
  // "ali@example.com": "CY26-ALI482",
};

/** Builds a referral URL for the founding cohort application. */
export function buildReferralUrl(referralCode: string): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://community.codeyaar.tech";
  return `${base}/cohort/apply?ref=${encodeURIComponent(referralCode)}`;
}

/** Extracts a referral code from a URL query string. */
export function extractReferralCode(search: string): string | null {
  const params = new URLSearchParams(search);
  const code = params.get("ref");
  if (!code) return null;
  // Validate format: CY26-XXXXXX
  if (!/^CY26-[A-Z0-9]{6}$/i.test(code)) return null;
  return code.toUpperCase();
}