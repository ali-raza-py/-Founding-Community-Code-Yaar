"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setIsLoading(true);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      setIsLoading(false);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data?.user) {
        // Check if email confirmation is required.
        if (data.user.identities?.[0]?.identity_data?.email) {
          router.push("/auth/sign-in?message=Account created. Please check your email to confirm your account, then sign in.");
        } else {
          router.push("/dashboard");
        }
      }
    },
    [email, password, confirmPassword, router, supabase],
  );

  if (!isSupabaseConfigured()) {
    return (
      <Section padded>
        <SectionInner className="text-center">
          <SectionHeading
            eyebrow="Create Account"
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
            title="Create an Account"
            description="Join the Code Yaar community and apply to our programmes."
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
                autoComplete="new-password"
                disabled={isLoading}
              />
            </Field>

            <Field label="Confirm Password" required>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
            </Field>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center type-body text-ink-muted">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-emerald hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </SectionInner>
    </Section>
  );
}
