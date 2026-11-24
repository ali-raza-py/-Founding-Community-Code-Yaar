"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { SITE_URL } from "@/lib/constants";
import { AuthLogo } from "@/components/auth/auth-logo";
import { Spinner } from "@/components/auth/spinner";
import { AuthAlert } from "@/components/auth/auth-alert";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Stable Supabase client reference — created once, not on every render.
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError(null);

      const emailValue = email.trim();
      if (!emailValue) {
        setError("Please enter your email address.");
        return;
      }
      if (!EMAIL_REGEX.test(emailValue)) {
        setError("Enter a valid email address.");
        return;
      }

      if (!isSupabaseConfigured() || !supabase) {
        setError(
          "Authentication is not configured. Please contact the Code Yaar team.",
        );
        return;
      }

      setIsLoading(true);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        emailValue,
        {
          redirectTo: `${SITE_URL}/auth/sign-in`,
        },
      );

      setIsLoading(false);

      if (resetError) {
        setError(
          resetError.message ?? "Unable to send a reset link. Please try again.",
        );
        return;
      }

      setStatus("sent");
    },
    [email, supabase],
  );

  if (!isSupabaseConfigured()) {
    return (
      <Section padded>
        <SectionInner className="text-center">
          <SectionHeading
            eyebrow="Forgot Password"
            title="Authentication Not Configured"
            description="Supabase Auth is not configured on this site. Please contact the Code Yaar team."
          />
        </SectionInner>
      </Section>
    );
  }

  return (
    <Section padded>
      <SectionInner className="max-w-[28rem]">
        <div className="mx-auto text-center">
          <AuthLogo className="mx-auto mb-6" />
          <Mail className="mx-auto size-8 mb-4 text-ink-muted" />
          <h2 className="type-display text-ink">Forgot password?</h2>
          <p className="type-body-muted mt-2 max-w-[22rem] mx-auto">
            Enter your email address and we&rsquo;ll send you a secure link to
            reset your password.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <Field label="Email address" required error={error ?? undefined}>
              <Input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                required
                autoComplete="email"
                autoCapitalize="none"
                disabled={isLoading || status === "sent"}
              />
            </Field>

            {error && <AuthAlert>{error}</AuthAlert>}

            <Button
              type="submit"
              disabled={isLoading || status === "sent"}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 size-3" /> Sending…
                </>
              ) : status === "sent" ? (
                "Reset link sent"
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>

          {status === "sent" && (
            <div className="mt-10 p-6 rounded-lg border border-emerald/30 bg-emerald-soft text-emerald-900">
              <h3 className="font-semibold">Check your inbox</h3>
              <p className="mt-1 text-sm leading-relaxed">
                We&rsquo;ve sent a password reset link to your email address.
                Follow the link to set a new password, then return to sign in.
              </p>
            </div>
          )}

          <p className="mt-10 text-center type-body text-ink-muted">
            Remember your password?{" "}
            <Link
              href="/auth/sign-in"
              className="text-emerald hover:underline font-medium"
            >
              Sign in
            </Link>
            .
          </p>
        </div>
      </SectionInner>
    </Section>
  );
}
