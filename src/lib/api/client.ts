import type {
  AdminApplicationItem,
  AdminParticipantItem,
  AdminProfile,
  AdminReferralItem,
  AdminTaskItem,
  ApiClientError,
  ApiResponse,
  Announcement,
  ApplicationListItem,
  AuthSessionResponse,
  EmailConfig,
  EmailDetail,
  EmailListItem,
  EmailStats,
  EmailTemplate,
  PaginatedResponse,
  ParticipantRecord,
  ReferralRecord,
  ReferralRegistration,
  ReferralRegisterRequest,
  ReferralLookupResponse,
  SubmitApplicationRequest,
  SubmitApplicationResponse,
  TaskRecord,
  TestEmailRequest,
  TestEmailResponse,
  SendEmailRequest,
  SendEmailResponse,
} from "./types";
import { COMMUNITY_API_URL, API_TIMEOUT_MS, IS_API_CONFIGURED } from "./config";
import {
  classifyError,
  extractErrorMessage,
  notConfiguredError,
  networkError,
  timeoutError,
} from "./errors";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

/** Result of an API call. */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiClientError };

/** Options for a request. */
interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  authToken?: string;
  timeoutMs?: number;
}

/** Centralized API client for the Code Yaar Community Worker backend.
 *
 * - Centralized base URL from NEXT_PUBLIC_COMMUNITY_API_URL
 * - Bearer token support from Supabase Auth session
 * - Request timeout via AbortController
 * - Structured error handling (never logs tokens or sensitive data)
 * - No credential cookies; CORS handled by the Worker
 */
export class CommunityApiClient {
  private readonly baseUrl: string | null;
  private readonly defaultTimeoutMs: number;

  constructor() {
    this.baseUrl = COMMUNITY_API_URL;
    this.defaultTimeoutMs = API_TIMEOUT_MS;
  }

  /** Returns true if the API base URL is configured. */
  isConfigured(): boolean {
    return IS_API_CONFIGURED && this.baseUrl !== null;
  }

  private buildUrl(path: string): string {
    if (!this.baseUrl) throw new Error("API base URL not configured");
    return `${this.baseUrl}${path}`;
  }

  private buildHeaders(
    options: RequestOptions
  ): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (options.body && options.method !== "GET") {
      headers["Content-Type"] = "application/json";
    }

    if (options.authToken) {
      headers["Authorization"] = `Bearer ${options.authToken}`;
    }

    Object.assign(headers, options.headers);

    return headers;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /** Generic request handler. */
  async request<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<ApiResult<T>> {
    if (!this.isConfigured()) {
      return { ok: false, error: notConfiguredError() };
    }

    const url = this.buildUrl(path);
    const timeoutMs = options.timeoutMs ?? this.defaultTimeoutMs;

    const init: RequestInit = {
      method: options.method ?? "GET",
      headers: this.buildHeaders(options),
    };

    if (options.body && options.method !== "GET") {
      init.body = JSON.stringify(options.body);
    }

    let response: Response;
    try {
      response = await this.fetchWithTimeout(url, init, timeoutMs);
    } catch (error) {
      const aborted =
        error instanceof DOMException && error.name === "AbortError";
      return {
        ok: false,
        error: aborted ? timeoutError() : networkError(),
      };
    }

    if (!response.ok) {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = null;
      }
      const code =
        body && typeof body === "object" && "error" in body
          ? (body as { error?: { code?: unknown } }).error?.code
          : undefined;
      const message =
        body && typeof body === "object" && "error" in body
          ? extractErrorMessage(body)
          : undefined;
      return {
        ok: false,
        error: classifyError(response.status, code as string | undefined, message),
      };
    }

    let data: T;
    try {
      const json = (await response.json()) as ApiResponse<T>;
      data = json.data as T;
    } catch {
      return {
        ok: false,
        error: classifyError(500, "INVALID_RESPONSE", "Invalid API response"),
      };
    }

    return { ok: true, data };
  }

  /** GET helper. */
  async get<T>(
    path: string,
    authToken?: string,
    timeoutMs?: number
  ): Promise<ApiResult<T>> {
    return this.request<T>(path, { method: "GET", authToken, timeoutMs });
  }

  /** POST helper. */
  async post<T>(
    path: string,
    body: unknown,
    authToken?: string,
    timeoutMs?: number,
    headers?: Record<string, string>
  ): Promise<ApiResult<T>> {
    return this.request<T>(path, { method: "POST", body, authToken, timeoutMs, headers });
  }

  /** PATCH helper. */
  async patch<T>(
    path: string,
    body: unknown,
    authToken?: string,
    timeoutMs?: number
  ): Promise<ApiResult<T>> {
    return this.request<T>(path, { method: "PATCH", body, authToken, timeoutMs });
  }

  async delete<T>(
    path: string,
    authToken?: string,
    timeoutMs?: number
  ): Promise<ApiResult<T>> {
    return this.request<T>(path, { method: "DELETE", authToken, timeoutMs });
  }

  // ------------------------------------------------------------------
  // Domain-specific methods
  // ------------------------------------------------------------------

  async health(): Promise<ApiResult<{ status: string; service: string }>> {
    return this.get<{ status: string; service: string }>("/api/v1/health");
  }

  async session(authToken: string): Promise<ApiResult<AuthSessionResponse>> {
    return this.get<AuthSessionResponse>(`/api/v1/auth/session`, authToken);
  }

  async logout(authToken: string): Promise<ApiResult<Record<string, never>>> {
    return this.post<Record<string, never>>(`/api/v1/auth/logout`, {}, authToken);
  }

  async submitApplication(
    request: SubmitApplicationRequest
  ): Promise<ApiResult<SubmitApplicationResponse>> {
    return this.post<SubmitApplicationResponse>(
      "/api/v1/applications",
      request
    );
  }

  async getMyApplications(
    authToken: string
  ): Promise<ApiResult<ApplicationListItem[] | null>> {
    return this.get<ApplicationListItem[] | null>(
      "/api/v1/applications/mine",
      authToken
    );
  }

  async getMyParticipant(
    authToken: string
  ): Promise<ApiResult<ParticipantRecord | null>> {
    return this.get<ParticipantRecord | null>(
      "/api/v1/participants/me",
      authToken
    );
  }

  async getMyReferrals(
    authToken: string
  ): Promise<ApiResult<ReferralRecord | null>> {
    return this.get<ReferralRecord | null>(
      "/api/v1/referrals/me",
      authToken
    );
  }

  async registerReferral(
    request: ReferralRegisterRequest
  ): Promise<ApiResult<ReferralRecord>> {
    return this.post<ReferralRecord>("/api/v1/referrals/register", request);
  }

  /**
   * Public lookup of a referral code to validate it and resolve the owning
   * ambassador's name before an application is submitted. No auth required.
   */
  async getReferralLookup(
    code: string
  ): Promise<ApiResult<ReferralLookupResponse>> {
    return this.get<ReferralLookupResponse>(
      `/api/v1/referrals/lookup?code=${encodeURIComponent(code)}`
    );
  }

  async getAnnouncements(
    authToken: string,
    targetProgramId?: string
  ): Promise<ApiResult<Announcement[]>> {
    const path = targetProgramId
      ? `/api/v1/announcements?targetProgramId=${encodeURIComponent(targetProgramId)}`
      : "/api/v1/announcements";
    return this.get<Announcement[]>(path, authToken);
  }

  async getMyTasks(
    authToken: string
  ): Promise<ApiResult<TaskRecord[]>> {
    return this.get<TaskRecord[]>(`/api/v1/tasks/mine`, authToken);
  }

  // Admin methods (require admin or super_admin role)
  async getAdminApplications(
    authToken: string,
    params?: {
      page?: number;
      pageSize?: number;
      search?: string;
      programId?: string;
      status?: string;
      referred?: "all" | "referred" | "direct";
      sortBy?: string;
      sortDir?: "asc" | "desc";
    }
  ): Promise<ApiResult<PaginatedResponse<AdminApplicationItem>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.programId) searchParams.set("programId", params.programId);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.referred && params.referred !== "all") searchParams.set("referred", params.referred);
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortDir) searchParams.set("sortDir", params.sortDir);

    const path = `/api/v1/admin/applications${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    return this.get<PaginatedResponse<AdminApplicationItem>>(path, authToken);
  }

  async getAdminApplication(
    authToken: string,
    id: string
  ): Promise<ApiResult<AdminApplicationItem>> {
    return this.get<AdminApplicationItem>(
      `/api/v1/admin/applications/${encodeURIComponent(id)}`,
      authToken
    );
  }

  async updateApplicationStatus(
    authToken: string,
    id: string,
    application_status: string
  ): Promise<ApiResult<AdminApplicationItem>> {
    return this.patch<AdminApplicationItem>(
      `/api/v1/admin/applications/${encodeURIComponent(id)}/status`,
      { application_status },
      authToken
    );
  }

  async getAdminParticipants(
    authToken: string,
    params?: {
      page?: number;
      pageSize?: number;
      search?: string;
      programId?: string;
      status?: string;
    }
  ): Promise<ApiResult<PaginatedResponse<ParticipantRecord>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.programId) searchParams.set("programId", params.programId);
    if (params?.status) searchParams.set("status", params.status);

    const path = `/api/v1/admin/participants${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    return this.get<PaginatedResponse<ParticipantRecord>>(path, authToken);
  }

  async getAdminReferrals(
    authToken: string,
    params?: { page?: number; pageSize?: number }
  ): Promise<ApiResult<PaginatedResponse<ReferralRecord>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));

    const path = `/api/v1/admin/referrals${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    return this.get<PaginatedResponse<ReferralRecord>>(path, authToken);
  }

  async createAdminAnnouncement(
    authToken: string,
    body: { title: string; content: string; target_program_id?: string; published?: boolean }
  ): Promise<ApiResult<Announcement>> {
    return this.post<Announcement>(
      "/api/v1/admin/announcements",
      body,
      authToken
    );
  }

  async createAdminTask(
    authToken: string,
    body: {
      title: string;
      description: string;
      program_id: string;
      assigned_to: string;
      due_date: string;
      status?: string;
    }
  ): Promise<ApiResult<TaskRecord>> {
    return this.post<TaskRecord>("/api/v1/admin/tasks", body, authToken);
  }

  async getAdminPrograms(
    authToken: string
  ): Promise<ApiResult<Array<{ id: string; name: string; slug: string; program_type?: string; status?: string }>>> {
    return this.get<Array<{ id: string; name: string; slug: string; program_type?: string; status?: string }>>(
      "/api/v1/admin/programs",
      authToken
    );
  }

  async getAdminTasks(
    authToken: string,
    params?: {
      page?: number;
      pageSize?: number;
      search?: string;
      programId?: string;
      status?: string;
      sortBy?: string;
      sortDir?: "asc" | "desc";
    }
  ): Promise<ApiResult<PaginatedResponse<TaskRecord>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.programId) searchParams.set("programId", params.programId);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortDir) searchParams.set("sortDir", params.sortDir);

    const path = `/api/v1/admin/tasks${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    return this.get<PaginatedResponse<TaskRecord>>(path, authToken);
  }

  async getAdminTask(
    authToken: string,
    id: string
  ): Promise<ApiResult<TaskRecord>> {
    return this.get<TaskRecord>(`/api/v1/admin/tasks/${encodeURIComponent(id)}`, authToken);
  }

  async updateAdminTask(
    authToken: string,
    id: string,
    body: {
      title?: string;
      description?: string;
      program_id?: string;
      assigned_to?: string;
      due_date?: string | null;
      status?: string;
    }
  ): Promise<ApiResult<TaskRecord>> {
    return this.patch<TaskRecord>(
      `/api/v1/admin/tasks/${encodeURIComponent(id)}`,
      body,
      authToken
    );
  }

  async completeAdminTask(
    authToken: string,
    id: string
  ): Promise<ApiResult<TaskRecord>> {
    return this.post<TaskRecord>(
      `/api/v1/admin/tasks/${encodeURIComponent(id)}/complete`,
      {},
      authToken
    );
  }

  async deleteAdminTask(
    authToken: string,
    id: string
  ): Promise<ApiResult<null>> {
    return this.delete<null>(
      `/api/v1/admin/tasks/${encodeURIComponent(id)}`,
      authToken
    );
  }

  async getAdminStats(
    authToken: string
  ): Promise<ApiResult<{ applications: number; participants: number | null }>> {
    return this.get<{ applications: number; participants: number | null }>(
      "/api/v1/admin/stats",
      authToken
    );
  }

  async getAdminProfiles(
    authToken: string
  ): Promise<ApiResult<AdminProfile[]>> {
    return this.get<AdminProfile[]>("/api/v1/admin/profiles", authToken);
  }

  async updateAdminProfileRole(
    authToken: string,
    id: string,
    role: string
  ): Promise<ApiResult<AdminProfile>> {
    return this.patch<AdminProfile>(
      `/api/v1/admin/profiles/${encodeURIComponent(id)}/role`,
      { role },
      authToken
    );
  }

  // ------------------------------------------------------------------
  // Additional admin methods
  // ------------------------------------------------------------------

  async verifyAdminReferral(
    authToken: string,
    id: string
  ): Promise<ApiResult<ReferralRegistration>> {
    return this.patch<ReferralRegistration>(
      `/api/v1/admin/referrals/${encodeURIComponent(id)}/verify`,
      {},
      authToken
    );
  }

  async createAdminParticipant(
    authToken: string,
    body: {
      user_id: string;
      application_id: string;
      program_id: string;
      participant_status?: "active" | "inactive" | "suspended" | "graduated";
    }
  ): Promise<ApiResult<AdminParticipantItem>> {
    return this.post<AdminParticipantItem>(
      "/api/v1/admin/participants",
      body,
      authToken
    );
  }

  async updateAdminParticipant(
    authToken: string,
    id: string,
    body: { participant_status: "active" | "inactive" | "suspended" | "graduated" }
  ): Promise<ApiResult<AdminParticipantItem>> {
    return this.patch<AdminParticipantItem>(
      `/api/v1/admin/participants/${encodeURIComponent(id)}`,
      body,
      authToken
    );
  }

  // ------------------------------------------------------------------
  // Email management methods (Community API — Founding Community API repo)
  //
  // All paths match the backend router (registered under /api/v1/admin/email).
  // Backend rows use snake_case; they are transformed to the camelCase client
  // types here so components consume a stable shape.
  // ------------------------------------------------------------------

  private mapEmailListItem(row: any): EmailListItem {
    return {
      id: row.id,
      recipient: row.recipient,
      type: row.template_name ?? 'custom',
      subject: row.subject,
      status: row.status,
      provider: 'resend',
      messageId: row.provider_message_id ?? null,
      sentAt: row.sent_at,
    };
  }

  private mapEmailDetail(row: any): EmailDetail {
    return {
      id: row.id,
      recipient: row.recipient,
      type: row.template_name ?? 'custom',
      subject: row.subject,
      status: row.status,
      provider: 'resend',
      messageId: row.provider_message_id ?? null,
      createdAt: row.sent_at,
      acceptedAt: row.status === 'accepted' ? row.sent_at : null,
      deliveredAt: row.status === 'delivered' ? row.sent_at : null,
      failureReason: row.error ?? null,
    };
  }

  async getAdminEmailStats(
    authToken: string,
    params?: { from?: string; to?: string }
  ): Promise<ApiResult<EmailStats>> {
    const searchParams = new URLSearchParams();
    if (params?.from) searchParams.set('from', params.from);
    if (params?.to) searchParams.set('to', params.to);
    const path = `/api/v1/admin/email/stats${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.get<EmailStats>(path, authToken);
  }

  async getAdminEmails(
    authToken: string,
    params?: {
      page?: number;
      pageSize?: number;
      search?: string;
      type?: string;
      status?: string;
      from?: string;
      to?: string;
      sortBy?: string;
      sortDir?: "asc" | "desc";
    }
  ): Promise<ApiResult<PaginatedResponse<EmailListItem>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.type) searchParams.set("type", params.type);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.from) searchParams.set("from", params.from);
    if (params?.to) searchParams.set("to", params.to);
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortDir) searchParams.set("sortDir", params.sortDir);

    const path = `/api/v1/admin/email/history${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const res = await this.get<{ items: any[]; meta: PaginatedResponse<EmailListItem>["meta"] }>(path, authToken);
    if (!res.ok) return res as ApiResult<PaginatedResponse<EmailListItem>>;
    return {
      ok: true,
      data: {
        items: (res.data.items ?? []).map((row) => this.mapEmailListItem(row)),
        meta: res.data.meta,
      },
    };
  }

  async getAdminEmail(
    authToken: string,
    id: string
  ): Promise<ApiResult<EmailDetail>> {
    const res = await this.get<EmailDetail>(
      `/api/v1/admin/email/history/${encodeURIComponent(id)}`,
      authToken
    );
    if (!res.ok) return res as ApiResult<EmailDetail>;
    return { ok: true, data: this.mapEmailDetail(res.data) };
  }

  async postAdminEmailTest(
    authToken: string,
    request: TestEmailRequest
  ): Promise<ApiResult<TestEmailResponse>> {
    return this.post<TestEmailResponse>("/api/v1/admin/email/test", request, authToken);
  }

  async postAdminEmailRetry(
    authToken: string,
    id: string
  ): Promise<ApiResult<{ success: boolean; messageId: string | null }>> {
    return this.post<{ success: boolean; messageId: string | null }>(
      `/api/v1/admin/email/failed/${encodeURIComponent(id)}/retry`,
      {},
      authToken
    );
  }

  async getAdminEmailTemplates(
    authToken: string
  ): Promise<ApiResult<EmailTemplate[]>> {
    const res = await this.get<any[]>("/api/v1/admin/email/templates", authToken);
    if (!res.ok) return res as ApiResult<EmailTemplate[]>;
    return {
      ok: true,
      data: (res.data ?? []).map((row: any) => ({
        id: row.id,
        name: row.name,
        updatedAt: row.updated_at,
      } as unknown as EmailTemplate)),
    };
  }

  async getAdminEmailConfig(
    authToken: string
  ): Promise<ApiResult<EmailConfig>> {
    const res = await this.get<{
      resend_configured: boolean;
      from_email: string;
      from_name: string;
      webhook_configured: boolean;
    }>("/api/v1/admin/email/settings", authToken);
    if (!res.ok) return res as ApiResult<EmailConfig>;
    const data = res.data;
    return {
      ok: true,
      data: {
        provider: "resend",
        senderAddress: data.from_email ?? "noreply@contact.codeyaar.tech",
        senderName: data.from_name ?? "Code Yaar Founding Community",
        status: data.resend_configured ? "configured" : "not-configured",
        lastTestedAt: null,
      },
    };
  }

  async postAdminEmailSend(
    authToken: string,
    request: SendEmailRequest,
    idempotencyKey?: string
  ): Promise<ApiResult<SendEmailResponse>> {
    // Map frontend field names to backend schema field names:
    // recipients -> to, body -> html. The idempotency key is sent in the body
    // as `idempotency_key` to match the backend validator; sending it only as a
    // header would be ignored and the backend would fall back to a
    // recipient+subject-derived key, which can suppress legitimate re-sends.
    //
    // template_id is only forwarded when it is a real backend template UUID.
    // Frontend catalogue template IDs (e.g. "application-received") are not
    // UUIDs, and the backend validates template_id as a UUID, so sending a
    // catalogue slug here would fail with "Invalid template ID". Custom emails
    // and catalogue templates intentionally send no template_id.
    const templateId = request.templateId;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      templateId ?? ""
    );
    const payload: Record<string, unknown> = {
      to: request.recipients,
      subject: request.subject,
      html: request.body,
      idempotency_key: idempotencyKey ?? crypto.randomUUID(),
    };
    if (isUuid) {
      payload.template_id = templateId;
    }
    return this.post<SendEmailResponse>("/api/v1/admin/email/send", payload, authToken);
  }
}

/** Singleton client instance. */
export const communityApi = new CommunityApiClient();
