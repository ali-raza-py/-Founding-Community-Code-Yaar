export interface CommunityApiConfig {
  baseUrl: string | null;
  timeoutMs: number;
  isConfigured: boolean;
}

/** Consistent API response envelope from the Cloudflare Worker. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

/** Application submission request (matches backend validator). */
export interface SubmitApplicationRequest {
  program_id: string;
  applicant_name: string;
  email: string;
  phone?: string;
  institution: string;
  city: string;
  application_answers: Record<string, unknown>;
  referral_code?: string;
  turnstile_token: string;
}

/** Application submission response (201). */
export interface SubmitApplicationResponse {
  id: string;
  program_id: string;
  email: string;
  application_status: string;
  created_at: string;
}

/** Application list item (from GET /api/v1/applications/mine). */
export interface ApplicationListItem {
  id: string;
  program_id: string;
  applicant_name: string;
  email: string;
  phone: string | null;
  institution: string;
  city: string;
  application_answers: Record<string, unknown>;
  application_status: string;
  referral_code: string | null;
  created_at: string;
  updated_at: string;
  programs?: { name: string; slug: string } | null;
}

/** Auth session response (GET /api/v1/auth/session). */
export interface AuthSessionResponse {
  user: {
    id: string;
    email: string | null;
    role: "super_admin" | "admin" | "participant";
  };
}

/** Announcement (GET /api/v1/announcements). */
export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_program_id: string | null;
  published: boolean;
  created_by: string;
  created_at: string;
}

/** Referral registration request (POST /api/v1/referrals/register). */
export interface ReferralRegisterRequest {
  referral_code: string;
  registered_email: string;
  turnstile_token: string;
}

/** Referral record (GET /api/v1/referrals/me). */
export interface ReferralRecord {
  id: string;
  participant_id: string;
  referral_code: string;
  total_registrations: number;
  verified_registrations: number;
  created_at: string;
  registrations?: Array<{
    id: string;
    registered_email: string;
    verification_status: string;
    created_at: string;
  }>;
}

/** Participant record (GET /api/v1/participants/me). */
export interface ParticipantRecord {
  id: string;
  user_id: string;
  application_id: string | null;
  program_id: string;
  participant_status: string;
  joined_at: string;
  created_at: string;
  programs?: { name: string; slug: string } | null;
}

/** Task (GET /api/v1/tasks/mine). */
export interface TaskRecord {
  id: string;
  title: string;
  description: string;
  program_id: string;
  assigned_to: string;
  due_date: string | null;
  status: string;
  created_at: string;
}

/** Paginated list response. */
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/** Admin application list item. */
export interface AdminApplicationItem {
  id: string;
  program_id: string;
  applicant_name: string;
  email: string;
  phone: string | null;
  institution: string;
  city: string;
  application_answers: Record<string, unknown>;
  application_status: string;
  referral_code: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  programs?: { name: string; slug: string } | null;
}

/** Admin stats response. */
export interface AdminStats {
  applications: number;
  participants: number | null;
}

/** Admin profile record (GET /api/v1/admin/profiles). */
export interface AdminProfile {
  id: string;
  full_name: string;
  email: string;
  role: "super_admin" | "admin" | "participant";
  created_at: string;
  updated_at?: string;
}

/** Admin participant list item (GET /api/v1/admin/participants). */
export interface AdminParticipantItem {
  id: string;
  user_id: string;
  application_id: string | null;
  program_id: string;
  participant_status: string;
  joined_at: string;
  created_at: string;
  profiles?: { full_name: string; email: string; role: string } | null;
  programs?: { name: string; slug: string } | null;
}

/** Admin referral list item (GET /api/v1/admin/referrals). */
export interface AdminReferralItem {
  id: string;
  participant_id: string;
  referral_code: string;
  total_registrations: number;
  verified_registrations: number;
  created_at: string;
  updated_at?: string;
  participants?: {
    user_id: string;
    profiles: { full_name: string; email: string } | null;
  } | null;
}

/** Referral registration (for verification). */
export interface ReferralRegistration {
  id: string;
  referral_id: string;
  registered_email: string;
  verification_status: string;
  created_at: string;
}

/** Admin task record (POST /api/v1/admin/tasks, GET /api/v1/tasks/mine). */
export interface AdminTaskItem {
  id: string;
  title: string;
  description: string;
  program_id: string;
  assigned_to: string;
  due_date: string | null;
  status: string;
  created_at: string;
  updated_at?: string;
}

/** Application status values supported by the backend. */
export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "shortlisted"
  | "accepted"
  | "rejected"
  | "waitlisted";

/** Participant status values supported by the backend. */
export type ParticipantStatus = "active" | "inactive" | "suspended" | "graduated";

/** Task status values supported by the backend. */
export type TaskStatus = "pending" | "in_progress" | "completed" | "overdue";

/** Network/API error classification. */
export type ApiErrorReason =
  | "not-configured"
  | "network"
  | "timeout"
  | "unauthorized"
  | "forbidden"
  | "not-found"
  | "conflict"
  | "validation"
  | "rate-limited"
  | "server"
  | "unknown";

export interface ApiClientError {
  reason: ApiErrorReason;
  status?: number;
  code?: string;
  message: string;
}

/** Program configuration (configured via env since no GET /programs endpoint). */
export interface ProgramConfig {
  foundingCohort: string;
  ambassadorProgram: string;
}

export function getProgramConfig(): ProgramConfig {
  return {
    foundingCohort:
      process.env.NEXT_PUBLIC_PROGRAM_ID_FOUNDING_COHORT ?? "",
    ambassadorProgram:
      process.env.NEXT_PUBLIC_PROGRAM_ID_AMBASSADOR ?? "",
  };
}
