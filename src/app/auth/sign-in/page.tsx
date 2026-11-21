"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Stable Supabase client reference — created once, not on every render.
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError(null);

      if (!isSupabaseConfigured() || !supabase) {
        setError(
          "Authentication is not configured. Please contact the Code Yaar team.",
        );
        return;
      }

      setIsLoading(true);

      // Step 1: Authenticate with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !data?.session?.access_token) {
        setIsLoading(false);
        setError(
          signInError?.message ??
            "Unable to sign in. Please check your email and password.",
        );
        return;
      }

      const accessToken = data.session.access_token;

      // Step 2: Verify session with the Community API backend to resolve role
      let verifiedRole: "super_admin" | "admin" | "participant" | null = null;
      let backendError = false;

      try {
        const result = await communityApi.session(accessToken);

        if (result.ok) {
          verifiedRole = result.data.user.role;
        } else {
          // Backend returned an error (e.g., 401, 403, profile missing)
          backendError = true;
          setError(
            "Your session could not be verified by the Code Yaar API. Please contact the Code Yaar team.",
          );
        }
      } catch {
        backendError = true;
        setError(
          "The Code Yaar API is currently unreachable. Please try again later.",
        );
      }

      setIsLoading(false);

      if (backendError) {
        // Sign out of Supabase since backend verification failed
        await supabase.auth.signOut();
        return;
      }

      // Step 3: Redirect based on verified backend role
      if (verifiedRole === "super_admin") {
        await router.push("/admin/users");
      } else if (verifiedRole === "admin") {
        await router.push("/admin");
      } else {
        await router.push("/dashboard");
      }
    },
    [email, password, router, supabase],
  );

  if (!isSupabaseConfigured()) {
    return (
      <Section padded>
        <SectionInner className="text-center">
          <SectionHeading
            eyebrow="Sign In"
            title="Authentication Not Configured"
            description="Supabase Auth is not configured on this site. Please contact the Code Yaar team."
          />
        </SectionInner>
      </Section>
    );
  }

  return (
    <Section padded>
      <SectionInner className="max-w-[42rem]">
        <div className="mx-auto">
          <SectionHeading
            eyebrow="Code Yaar Community"
            title="Sign In"
            description="Sign in to access your dashboard and applications."
          />

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <Field label="Email address" required error={error ?? undefined}>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </Field>

            <Field label="Password" required>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </Field>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center type-body text-ink-muted">
            Don&rsquo;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-emerald hover:underline font-medium"
            >
              Create an account
            </Link>
          </p>
        </div>
      </SectionInner>
    </Section>
  );
}
