"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createSupabaseBrowserClient();

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

      // Verify the session against the Community API backend.
      const result = await communityApi.session(data.session.access_token);
      setIsLoading(false);

      if (result.ok) {
        await router.push("/dashboard");
      } else {
        setError(
          "Your session could not be verified. Please contact the Code Yaar team.",
        );
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

          <p className="mt-8 text-center type-body text-ink-muted">
            Don&rsquo;t have an account? Contact the Code Yaar team to request
            access.
          </p>
        </div>
      </SectionInner>
    </Section>
  );
}
