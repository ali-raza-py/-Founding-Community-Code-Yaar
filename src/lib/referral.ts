/**
 * Referral-based evaluation types for the Code Yaar Global Ambassador Programme.
 *
 * NOTE: This is a frontend-only site with no backend. All referral storage
 * functions below are client-side only (localStorage/sessionStorage) and are
 * intended for demonstration and local development. A real deployment requires
 * a backend service to generate, store, verify and audit referral records.
 */

export type ReferralStatus = "pending" | "verified" | "rejected" | "invalid";

export type ReferralRecord = {
  id: string;
  referralCode: string;
  ambassadorEmail: string;
  applicantEmail: string;
  applicantName: string;
  status: ReferralStatus;
  submittedAt: string;
  verifiedAt: string | null;
  rejectionReason: string | null;
  applicationId: string | null;
};

export type AmbassadorReferralProfile = {
  ambassadorEmail: string;
  referralCode: string;
  shortlistedAt: string | null;
  requiredReferrals: number;
  totalVisits: number;
  completedApplications: number;
  pendingReview: number;
  verifiedReferrals: number;
  rejectedReferrals: number;
  lastUpdated: string;
};

export type ReferralEvaluationCriteria = {
  communication: number; // 20 points
  leadership: number; // 20 points
  communityAccess: number; // 20 points
  reliability: number; // 15 points
  referralStage: number; // 15 points
  problemSolving: number; // 10 points
};

export type ReferralStorageData = {
  referrals: ReferralRecord[];
  ambassadorProfiles: Record<string, AmbassadorReferralProfile>;
};

/** Required number of qualified referrals for the ambassador referral stage. */
export const REQUIRED_REFERRALS = 5;

/** Referral code prefix. */
export const REFERRAL_CODE_PREFIX = "CY26";

/** LocalStorage keys. */
export const REFERRAL_STORAGE_KEY = "codeyaar.referrals.v1";
export const AMBASSADOR_PROFILE_KEY = "codeyaar.ambassador-profile.v1";
export const COHORT_REFERRAL_KEY = "codeyaar.cohort-referral.v1";

/** Generates a unique referral code: CY26 + 6 random alphanumeric chars. */
export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = REFERRAL_CODE_PREFIX + "-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

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

/** Reads referral data from localStorage. */
export function readReferralStorage(): ReferralStorageData {
  if (typeof window === "undefined") {
    return { referrals: [], ambassadorProfiles: {} };
  }
  try {
    const raw = window.localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!raw) return { referrals: [], ambassadorProfiles: {} };
    const parsed = JSON.parse(raw);
    return {
      referrals: Array.isArray(parsed.referrals) ? parsed.referrals : [],
      ambassadorProfiles:
        parsed.ambassadorProfiles && typeof parsed.ambassadorProfiles === "object"
          ? parsed.ambassadorProfiles
          : {},
    };
  } catch {
    return { referrals: [], ambassadorProfiles: {} };
  }
}

/** Writes referral data to localStorage. */
export function writeReferralStorage(data: ReferralStorageData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable (private mode, quota).
  }
}

/** Checks if a referral code is self-referral (ambassador email === applicant email). */
export function isSelfReferral(
  ambassadorEmail: string,
  applicantEmail: string,
): boolean {
  return ambassadorEmail.toLowerCase().trim() === applicantEmail.toLowerCase().trim();
}

/** Checks if an applicant email already has a referral record. */
export function hasExistingReferral(
  referrals: ReferralRecord[],
  applicantEmail: string,
): boolean {
  return referrals.some(
    (r) => r.applicantEmail.toLowerCase().trim() === applicantEmail.toLowerCase().trim(),
  );
}

/** Calculates remaining verified referrals needed. */
export function remainingReferrals(verified: number): number {
  return Math.max(0, REQUIRED_REFERRALS - verified);
}

/** Referral evaluation framework point values. */
export const REFERRAL_EVALUATION_WEIGHTS: ReferralEvaluationCriteria = {
  communication: 20,
  leadership: 20,
  communityAccess: 20,
  reliability: 15,
  referralStage: 15,
  problemSolving: 10,
} as const;

export const TOTAL_EVALUATION_POINTS = 100;
