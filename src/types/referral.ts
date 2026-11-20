import type {
  ReferralStatus,
  ReferralRecord,
  AmbassadorReferralProfile,
  ReferralEvaluationCriteria,
  ReferralStorageData,
} from "@/lib/referral";

export type {
  ReferralStatus,
  ReferralRecord,
  AmbassadorReferralProfile,
  ReferralEvaluationCriteria,
  ReferralStorageData,
};

export type ReferralFormValues = {
  ambassadorEmail: string;
  applicantEmail: string;
  applicantName: string;
  applicationId: string | null;
};

export type ReferralAction =
  | { type: "set-profile"; profile: AmbassadorReferralProfile }
  | { type: "add-referral"; referral: ReferralRecord }
  | { type: "update-referral"; id: string; changes: Partial<ReferralRecord> }
  | { type: "set-storage"; data: ReferralStorageData };

export type ReferralState = {
  referrals: ReferralRecord[];
  ambassadorProfile: AmbassadorReferralProfile | null;
  storage: ReferralStorageData;
  isLoading: boolean;
  error: string | null;
};
