import type { ApplicationEnvelope, SubmissionResult } from "@/types/application";

const RAW_WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";
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
export const IS_SUBMISSION_CONFIGURED =
  RAW_WEB3FORMS_KEY.trim() !== "" || APPLICATION_ENDPOINT !== null;

function readReference(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const record = payload as Record<string, unknown>;
  for (const key of ["reference", "id", "submissionId"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

/** Submit via Web3Forms and return a typed result. Never logs applicant data. */
async function submitViaWeb3Forms(
  payload: Record<string, unknown>,
): Promise<SubmissionResult> {
  const key = RAW_WEB3FORMS_KEY.trim();
  if (!key) return { ok: false, reason: "not-configured" };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), resolveTimeout());

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: key,
        ...payload,
      }),
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
      const json = await response.json();
      if (json && typeof json === "object") {
        for (const k of ["reference", "id", "submissionId"]) {
          const v = json[k];
          if (typeof v === "string" && v.trim()) {
            reference = v.trim();
            break;
          }
        }
      }
    } catch {
      // ignore – reference is optional
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

/** Map our ApplicationData envelope onto the fields Web3Forms expects. */
function mapToWeb3Forms(envelope: ApplicationEnvelope): Record<string, unknown> {
  const app = envelope.application;
  return {
    fullName: app.fullName ?? "",
    email: app.email ?? "",
    phone: "",
    referral_code: envelope.referralCode ?? "",
    message:
      `Full name: ${app.fullName ?? ""}\n` +
      `Email: ${app.email ?? ""}\n` +
      `Country: ${app.country ?? ""}\n` +
      `City: ${app.city ?? ""}\n` +
      `Region: ${app.region ?? ""}\n` +
      `Age: ${app.age ?? ""}\n` +
      `Education: ${app.educationLevel ?? ""}\n` +
      `Field of study: ${app.fieldOfStudy ?? ""}\n` +
      `Year/grade: ${app.yearOrGrade ?? ""}\n` +
      `Experience: ${app.experienceLevel ?? ""}\n` +
      `Languages/tech: ${app.languages ?? ""}\n` +
      `Previous projects: ${app.previousProjects ?? ""}\n` +
      `GitHub: ${app.github ?? ""}\n` +
      `LinkedIn: ${app.linkedin ?? ""}\n` +
      `Portfolio: ${app.portfolio ?? ""}\n` +
      `Why The First 100: ${app.motivation ?? ""}\n` +
      `Learning goals: ${app.learningGoals ?? ""}\n` +
      `Contribution: ${app.contribution ?? ""}\n` +
      `Weekly time: ${app.weeklyTime ?? ""}\n` +
      `Preferred language: ${app.preferredLanguage ?? ""}\n` +
      `Time zone: ${app.timezone ?? ""}\n` +
      `Referral code: ${envelope.referralCode ?? "none"}\n` +
      `Consent: true`,
  };
}

/**
 * Sends one application.
 *
 * Submits directly to Web3Forms when an access key is configured, otherwise
 * POSTs the envelope to the configured endpoint. Never throws and never logs
 * the applicant's data.
 */
export async function submitApplication(
  envelope: ApplicationEnvelope,
): Promise<SubmissionResult> {
  const web3Key = RAW_WEB3FORMS_KEY.trim();
  if (web3Key) {
    const payload = mapToWeb3Forms(envelope);
    return submitViaWeb3Forms(payload);
  }

  const endpoint = resolveEndpoint();
  if (!endpoint) {
    // No submission method configured — be honest, do not fake success.
    return { ok: false, reason: "not-configured" };
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
