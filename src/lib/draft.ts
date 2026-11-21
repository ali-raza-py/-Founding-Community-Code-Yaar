import { EMPTY_APPLICATION } from "@/lib/application";
import type { ApplicationData } from "@/types/application";

const DRAFT_KEY = "codeyaar.first100.application-draft.v1";
const SUBMITTED_KEY = "codeyaar.first100.submitted.v1";

const DRAFT_FIELDS = Object.keys(EMPTY_APPLICATION) as (keyof ApplicationData)[];

function isApplicationData(value: unknown): value is ApplicationData {
  if (typeof value !== "object" || value === null) return false;
  return DRAFT_FIELDS.every(
    (field) =>
      typeof (value as Record<string, unknown>)[field] === "string" ||
      typeof (value as Record<string, unknown>)[field] === "number",
  );
}

/** Stores only the data fields. Consent and submission ids are never persisted. */
export function saveDraft(values: ApplicationData): void {
  if (typeof window === "undefined") return;
  try {
    const draft: ApplicationData = { ...EMPTY_APPLICATION, ...values };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage can be unavailable (private mode, quota). Drafts are best-effort.
  }
}

export function loadDraft(): ApplicationData | null {
  if (typeof window === "undefined") return null;
  try {
    return parseDraft(window.localStorage.getItem(DRAFT_KEY));
  } catch {
    return null;
  }
}

function parseDraft(raw: string | null): ApplicationData | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isApplicationData(parsed)) return null;
    return { ...EMPTY_APPLICATION, ...parsed };
  } catch {
    return null;
  }
}

/*
 * External-store adapter for React's useSyncExternalStore. Reading the draft in
 * an effect would cause a cascading render, so the form subscribes instead and
 * lets React decide when the stored value is ready. The cached snapshot keeps
 * object identity stable across renders while the raw value is unchanged.
 */
let cachedRaw: string | null = null;
let cachedDraft: ApplicationData | null = null;
let hasSnapshot = false;

export function getDraftSnapshot(): ApplicationData | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
  if (hasSnapshot && raw === cachedRaw) return cachedDraft;
  cachedRaw = raw;
  cachedDraft = parseDraft(raw);
  hasSnapshot = true;
  return cachedDraft;
}

export function getServerDraftSnapshot(): null {
  return null;
}

/** Drafts only change from this tab, so there is nothing to subscribe to. */
export function subscribeToDraft(): () => void {
  return () => {};
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Ignore: nothing to clear, or storage is unavailable.
  }
}

/** Prevents showing a blank form again after a successful submission in this tab. */
export function markSubmittedThisSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SUBMITTED_KEY, "true");
  } catch {
    // Ignore.
  }
}

export function wasSubmittedThisSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SUBMITTED_KEY) === "true";
  } catch {
    return false;
  }
}
