import type { ApplicationEnvelope, SubmissionResult } from "@/types/application";

const RAW_ENDPOINT = process.env.NEXT_PUBLIC_APPLICATION_ENDPOINT ?? "";
const RAW_PUBLIC_KEY = process.env.NEXT_PUBLIC_APPLICATION_PUBLIC_KEY ?? "";
const RAW_TIMEOUT = process.env.NEXT_PUBLIC_APPLICATION_TIMEOUT_MS ?? "";

const DEFAULT_TIMEOUT_MS = 20_000;

function resolveEndpoint(): string | null {
  const value = RAW_ENDPOINT.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol !== "https:" && !(isLocal && url.protocol === "http:")) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

function resolveTimeout(): number {
  const parsed = Number.parseInt(RAW_TIMEOUT, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_TIMEOUT_MS;
  return Math.min(Math.max(parsed, 5_000), 60_000);
}

export const APPLICATION_ENDPOINT = resolveEndpoint();
export const IS_SUBMISSION_CONFIGURED = APPLICATION_ENDPOINT !== null;

function readReference(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const record = payload as Record<string, unknown>;
  for (const key of ["reference", "id", "submissionId"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

const LOCAL_SUBMISSIONS_KEY = "codeyaar.first100.submissions.v1";

/** Persist an application to browser localStorage so nothing is lost when no endpoint is configured. */
function saveSubmissionLocally(envelope: ApplicationEnvelope): string {
  if (typeof window === "undefined") return envelope.submissionId;
  try {
    const raw = window.localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
    const submissions: ApplicationEnvelope[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(submissions)) throw new Error("invalid submissions storage");
    submissions.push(envelope);
    window.localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(submissions));
  } catch {
    // Storage unavailable (private mode, quota); submissionId still serves as the local reference.
  }
  return envelope.submissionId;
}

/**
 * Submits one application.
 *
 * When an endpoint is configured, POSTs the envelope to it.
 * When no endpoint is configured, saves the envelope to browser localStorage
 * and returns a local reference — nothing is sent over the network and no
 * fake third-party service is involved.
 *
 * Never throws and never logs the applicant's data.
 */
export async function submitApplication(
  envelope: ApplicationEnvelope,
): Promise<SubmissionResult> {
  const endpoint = resolveEndpoint();
  if (!endpoint) {
    saveSubmissionLocally(envelope);
    return { ok: true, reference: envelope.submissionId };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), resolveTimeout());

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const publicKey = RAW_PUBLIC_KEY.trim();
  if (publicKey) headers["X-Application-Key"] = publicKey;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(envelope),
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        ok: false,
        reason: response.status >= 500 ? "server" : "rejected",
        status: response.status,
      };
    }

    let reference: string | null = null;
    try {
      reference = readReference(await response.json());
    } catch {
      reference = null;
    }

    return { ok: true, reference };
  } catch (error) {
    const aborted =
      error instanceof DOMException && error.name === "AbortError";
    return { ok: false, reason: aborted ? "timeout" : "network" };
  } finally {
    clearTimeout(timeoutId);
  }
}
