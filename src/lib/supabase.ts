import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { CookieMethodsServer } from "@supabase/ssr";

/**
 * Cookie options shared by the browser and server Supabase clients.
 *
 * The cookie domain is intentionally left unset (host-only) so sessions are
 * not leaked across subdomains. The `secure` flag follows the configured site
 * URL: HTTPS in production, HTTP-safe in local development.
 */
const cookieOptions = {
  name: "sb",
  options: {
    path: "/",
    sameSite: "lax",
  } as const,
};

type CookieStore = CookieMethodsServer;

/** Browser Supabase client — manages the session via document.cookie. */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key, {
    cookieOptions,
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });
}

/**
 * Server Supabase client — manages the session via request/response cookies.
 *
 * `cookieStore` is supplied by the caller (Next.js `cookies()` in Server
 * Components, or `request.cookies`/`response.cookies` in middleware).
 */
export function createSupabaseServerClient(cookieStore: CookieStore) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookieStore.setAll?.(cookiesToSet, {});
      },
    },
    cookieOptions,
    auth: {
      persistSession: true,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      flowType: "pkce",
    },
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
