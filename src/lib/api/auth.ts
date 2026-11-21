"use client";

import { useCallback, useEffect, useState } from "react";
import { communityApi } from "@/lib/api/client";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

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
}

/** Hook to manage Supabase Auth session and verify it against the Community API.
 *
 * The frontend relies on Supabase Auth for login/signup. The access token is
 * sent to the Community API as a Bearer token; the backend verifies it
 * server-side and resolves the role from the trusted profiles table.
 */
export function useAuth(): AuthState & { signOut: () => Promise<void> } {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    isSuperAdmin: false,
  });

  const supabase = createSupabaseBrowserClient();

  const verifySession = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setState({
        user: null,
        accessToken: null,
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false,
        isSuperAdmin: false,
      });
      return;
    }

    // Verify with the Community API backend.
    const result = await communityApi.session(session.access_token);
    if (result.ok) {
      setState({
        user: result.data.user,
        accessToken: session.access_token,
        isLoading: false,
        isAuthenticated: true,
        isAdmin:
          result.data.user.role === "admin" ||
          result.data.user.role === "super_admin",
        isSuperAdmin: result.data.user.role === "super_admin",
      });
    } else {
      // Session invalid or expired.
      setState({
        user: null,
        accessToken: null,
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false,
        isSuperAdmin: false,
      });
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    // Call backend logout first (if authenticated).
    if (state.accessToken) {
      try {
        await communityApi.logout(state.accessToken);
      } catch {
        // Ignore backend logout errors; still clear local session.
      }
    }

    // Sign out of Supabase (clears browser session).
    await supabase.auth.signOut();

    setState({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,
      isAdmin: false,
      isSuperAdmin: false,
    });
  }, [state.accessToken, supabase]);

  useEffect(() => {
    const checkSession = async () => {
      await verifySession();
    };
    checkSession();

    // Listen for auth state changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: string) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          void verifySession();
        } else if (event === "SIGNED_OUT") {
          setState({
            user: null,
            accessToken: null,
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false,
            isSuperAdmin: false,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [verifySession, supabase]);

  return { ...state, signOut };
}
