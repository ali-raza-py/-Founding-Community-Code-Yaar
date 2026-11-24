"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { communityApi } from "@/lib/api/client";
import {
  createSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase";

export interface AuthUser {
  id: string;
  email: string | null;
  role: "super_admin" | "admin" | "participant";
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  backendUnavailable: boolean;
}

type AuthStateWithSignOut = AuthState & { signOut: () => Promise<void> };

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isSuperAdmin: false,
  backendUnavailable: false,
};

/** Hook to manage the Supabase Auth session and verify it against the Community API.
 *
 * One authoritative session lives in the cookie-backed Supabase browser client
 * (a singleton managed by @supabase/ssr). Every hook instance shares that same
 * session and the same auth state change events, so there is one authoritative
 * source of authentication state.
 *
 * The frontend relies on Supabase Auth for login/signup. The access token is
 * sent to the Community API as a Bearer token; the backend verifies it
 * server-side and resolves the role from the trusted profiles table.
 *
 * If the backend is unavailable, sign-in via Supabase still succeeds — the
 * user is treated as a participant with limited role info.
 */
export function useAuth(): AuthStateWithSignOut {
  const [state, setState] = useState<AuthState>(initialState);
  const mounted = useRef(true);

  // Stable Supabase client. @supabase/ssr's createBrowserClient is a singleton
  // in the browser, so every hook instance shares the same cookie-backed
  // session and the same auth state change events.
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const setAuthState = useCallback(
    (next: AuthState) => {
      if (!mounted.current) return;
      setState(next);
    },
    []
  );

  const verifySession = useCallback(async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setAuthState({ ...initialState, isLoading: false });
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setAuthState({
        ...initialState,
        isLoading: false,
        isAuthenticated: false,
      });
      return;
    }

    // Verify with the Community API backend to resolve the user's actual role.
    const result = await communityApi.session(session.access_token);
    if (result.ok) {
      setAuthState({
        user: result.data.user,
        accessToken: session.access_token,
        isLoading: false,
        isAuthenticated: true,
        isAdmin:
          result.data.user.role === "admin" ||
          result.data.user.role === "super_admin",
        isSuperAdmin: result.data.user.role === "super_admin",
        backendUnavailable: false,
      });
    } else {
      // Backend unavailable or verification failed — still allow sign-in
      // via Supabase, defaulting to participant role.
      setAuthState({
        user: {
          id: session.user?.id ?? "",
          email: session.user?.email ?? null,
          role: "participant",
        },
        accessToken: session.access_token,
        isLoading: false,
        isAuthenticated: true,
        isAdmin: false,
        isSuperAdmin: false,
        backendUnavailable: true,
      });
    }
  }, [supabase, setAuthState]);

  const signOut = useCallback(async () => {
    // Call backend logout first (if authenticated).
    if (state.accessToken) {
      try {
        await communityApi.logout(state.accessToken);
      } catch {
        // Ignore backend logout errors; still clear local session.
      }
    }

    // Sign out of Supabase (clears cookies and session).
    if (supabase) await supabase.auth.signOut();

    setAuthState({
      ...initialState,
      isLoading: false,
      isAuthenticated: false,
    });
  }, [state.accessToken, supabase, setAuthState]);

  useEffect(() => {
    mounted.current = true;

    const checkSession = async () => {
      await verifySession();
    };
    checkSession();

    // Listen for auth state changes on the single shared client.
    const authSubscription = supabase
      ? supabase.auth.onAuthStateChange((event: string) => {
          if (!mounted.current) return;
          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            void verifySession();
          } else if (event === "SIGNED_OUT") {
            setAuthState({
              ...initialState,
              isLoading: false,
              isAuthenticated: false,
            });
          }
        })
      : null;

    const subscription = authSubscription?.data?.subscription ?? null;

    return () => {
      mounted.current = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [verifySession, supabase, setAuthState]);

  return { ...state, signOut };
}

export { initialState };
