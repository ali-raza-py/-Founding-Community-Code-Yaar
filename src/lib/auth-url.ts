/**
 * Centralized, environment-driven authentication redirect URLs.
 *
 * Every production redirect destination derives from NEXT_PUBLIC_SITE_URL so
 * no production domain is hardcoded in components. Local development falls
 * back to http://localhost:3000 only when the env var is absent.
 */

import { SITE_URL } from "@/lib/constants";

const AUTH_CALLBACK_PATH = "/auth/callback";
const AUTH_SIGN_IN_PATH = "/auth/sign-in";

/** Absolute URL of the auth callback route (email verification handling). */
export function getAuthCallbackUrl(): string {
  return `${SITE_URL}${AUTH_CALLBACK_PATH}`;
}

/** Absolute URL of the sign-in route. */
export function getAuthSignInUrl(): string {
  return `${SITE_URL}${AUTH_SIGN_IN_PATH}`;
}

/** Origin of the configured site URL. */
export function getSiteOrigin(): string {
  return new URL(SITE_URL).origin;
}

/**
 * Returns a safe redirect destination, or null when it would escape the
 * application origin (open redirect).
 *
 * - Relative paths are returned as-is.
 * - Absolute URLs are accepted only when they share the configured site
 *   origin (localhost is allowed in development via the env var).
 */
export function validateRedirectDestination(to: string | null): string | null {
  if (!to) return null;

  // Relative path — always safe within this application.
  if (to.startsWith("/") && !to.startsWith("//")) return to;

  try {
    const url = new URL(to);
    if (url.origin === getSiteOrigin()) {
      return url.pathname + url.search + url.hash;
    }
  } catch {
    return null;
  }

  return null;
}
