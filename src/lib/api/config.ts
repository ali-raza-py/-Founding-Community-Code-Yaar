import type { CommunityApiConfig } from "./types";

const RAW_API_URL = process.env.NEXT_PUBLIC_COMMUNITY_API_URL ?? "";
const RAW_TIMEOUT = process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? "20000";

const DEFAULT_TIMEOUT_MS = 20_000;

function resolveApiUrl(): string | null {
  const value = RAW_API_URL.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function resolveTimeout(): number {
  const parsed = Number.parseInt(RAW_TIMEOUT, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_TIMEOUT_MS;
  return Math.min(Math.max(parsed, 5_000), 60_000);
}

export const COMMUNITY_API_URL = resolveApiUrl();
export const IS_API_CONFIGURED = COMMUNITY_API_URL !== null;
export const API_TIMEOUT_MS = resolveTimeout();

export function getApiConfig(): CommunityApiConfig {
  return {
    baseUrl: COMMUNITY_API_URL,
    timeoutMs: API_TIMEOUT_MS,
    isConfigured: IS_API_CONFIGURED,
  };
}
