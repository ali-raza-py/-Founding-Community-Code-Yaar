"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";

import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthLogo } from "@/components/auth/auth-logo";
import { BrandVisual } from "@/components/auth/brand-visual";
import { Spinner } from "@/components/auth/spinner";
import { AuthAlert } from "@/components/auth/auth-alert";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"] as const;

function passwordStrength(value: string) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  return {
    score: Math.min(score, 4),
    label: STRENGTH_LABELS[Math.min(score, 4)],
    color:
      score <= 1 ? "text-danger" : score === 2 ? "text-ink-muted" : "text-emerald",
  };
}

type FormField = "fullName" | "email" | "password" | "confirmPassword" | "terms";

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<FormField, string>>({
    fullName: undefined as unknown as string,
    email: undefined as unknown as string,
    password: undefined as unknown as string,
    confirmPassword: undefined as unknown as string,
    terms: undefined as unknown as string,
  });

  // Stable Supabase client reference — created once, not on every render.
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const strength = useMemo(() => passwordStrength(password), [password]);

  const clearFieldError = (field: FormField) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (next[field]) {
        delete next[field];
        return next;
      }
      return prev;
    });
  };

  const validate = (): boolean => {
    const next: Record<FormField, string> = {
      fullName: undefined as unknown as string,
      email: undefined as unknown as string,
      password: undefined as unknown as string,
      confirmPassword: undefined as unknown as string,
      terms: undefined as unknown as string,
    };
    let invalid = false;

    const name = fullName.trim();
    if (!name) {
      next.fullName = "Please enter your full name.";
      invalid = true;
    } else if (name.length < 2 || name.length > 100) {
      next.fullName =
        name.length > 100
          ? "Please keep your name under 100 characters."
          : "Please enter your full name.";
      invalid = true;
    }

    const emailValue = email.trim();
    if (!emailValue) {
      next.email = "Please enter your email address.";
      invalid = true;
    } else if (!EMAIL_REGEX.test(emailValue)) {
      next.email = "Enter a valid email address.";
      invalid = true;
    }

    if (!password) {
      next.password = "Please choose a password.";
      invalid = true;
    } else if (password.length < 8) {
      next.password = "Please use at least 8 characters.";
      invalid = true;
    }

    if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
      invalid = true;
    }

    if (!terms) {
      next.terms = "Please accept the terms and conditions.";
      invalid = true;
    }

    setFieldErrors(next);
    return !invalid;
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError(null);

      if (!validate()) return;

      if (!isSupabaseConfigured() || !supabase) {
        setError(
          "Authentication is not configured. Please contact the Code Yaar team.",
        );
        return;
      }

      setIsLoading(true);

      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        setIsLoading(false);

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data?.user) {
          const emailConfirmationRequired = Boolean(
            data.user.identities?.[0]?.identity_data?.email,
          );
          setSuccess(true);

          const destination = emailConfirmationRequired
            ? `/auth/sign-in?message=${encodeURIComponent(
                "Account created. Please check your email to confirm your account, then sign in.",
              )}`
            : "/dashboard";

          // Let the success state be seen before redirecting.
          setTimeout(() => {
            void router.push(destination);
          }, 1500);
        }
      } catch {
        setIsLoading(false);
        setError("Unable to create account. Please try again.");
      }
    },
    [email, password, confirmPassword, fullName, terms, validate, router, supabase],
  );

  if (!isSupabaseConfigured()) {
    return (
      <Section padded>
        <SectionInner className="text-center">
          <SectionHeading
            eyebrow="Sign Up"
            title="Authentication Not Configured"
            description="Supabase Auth is not configured on this site. Please contact the Code Yaar team."
          />
        </SectionInner>
      </Section>
    );
  }

  if (success) {
    return (
      <AuthShell
        brand={
          <div className="flex flex-col items-start lg:items-center gap-6 text-center lg:text-center">
            <AuthLogo />
            <h2 className="type-display text-ink">Join Code Yaar</h2>
            <p className="type-body-muted max-w-[24rem]">
              Build something meaningful with a community of ambitious builders.
            </p>
          </div>
        }
        form={
          <div className="flex flex-col items-center justify-center text-center space-y-4 pt-6">
            <CheckCircle2 className="size-12 text-emerald" />
            <h2 className="type-display text-ink">Account created</h2>
            <p className="type-body-muted max-w-[22rem]">
              Please check your email to confirm your account, then sign in.
            </p>
            <p className="type-caption text-ink-subtle">
              You&rsquo;ll be redirected automatically.
            </p>
            <Link
              href="/auth/sign-in"
              className="type-small text-emerald hover:underline font-medium"
            >
              Go to sign in
            </Link>
          </div>
        }
      />
    );
  }

  return (
    <AuthShell
      brand={
        <div className="flex flex-col items-start lg:items-center gap-6 text-center lg:text-center">
          <AuthLogo />
          <h2 className="type-display text-ink">Build something meaningful.</h2>
          <p className="type-body-muted max-w-[24rem]">
            Join a community of ambitious builders, learners and future
            innovators.
          </p>
          <BrandVisual className="mt-8 lg:mt-auto" />
        </div>
      }
      form={
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h2 className="type-display text-ink">Create an account</h2>
            <p className="type-body-muted mt-2">
              Join the Code Yaar Founding Community.
            </p>
          </div>

          <Field label="Full name" required error={fieldErrors.fullName}>
            <Input
              id="sign-up-full-name"
              type="text"
              placeholder="Jane Smith"
              value={fullName}
              onChange={(event) => {
                setFullName(event.currentTarget.value);
                clearFieldError("fullName");
              }}
              required
              autoComplete="name"
              disabled={isLoading}
            />
          </Field>

          <Field label="Email address" required error={fieldErrors.email}>
            <Input
              id="sign-up-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.currentTarget.value);
                clearFieldError("email");
              }}
              required
              autoComplete="email"
              autoCapitalize="none"
              disabled={isLoading}
            />
          </Field>

          <Field label="Password" required error={fieldErrors.password}>
            <div className="relative">
              <Input
                id="sign-up-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(event) => {
                  setPassword(event.currentTarget.value);
                  clearFieldError("password");
                }}
                required
                autoComplete="new-password"
                disabled={isLoading}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-muted disabled:opacity-50 hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald rounded-md transition-colors"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            <div className="mt-2 flex h-4 items-center gap-1">
              <span
                className="flex-1 h-[2px] rounded-full overflow-hidden"
                aria-hidden="true"
              >
                {[0, 1, 2, 3].map((index) => (
                  <span
                    key={index}
                    className={`inline-block h-full w-1/4 ${
                      index < strength.score
                        ? strength.color
                        : "border border-line bg-transparent"
                    }`}
                  />
                ))}
              </span>
            </div>
            <p className={`mt-1 type-caption font-medium ${strength.color}`}>
              {strength.label}
            </p>
          </Field>

          <Field label="Confirm password" required error={fieldErrors.confirmPassword}>
            <div className="relative">
              <Input
                id="sign-up-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.currentTarget.value);
                  clearFieldError("confirmPassword");
                }}
                required
                autoComplete="new-password"
                disabled={isLoading}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((current) => !current)
                }
                disabled={isLoading}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-muted disabled:opacity-50 hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald rounded-md transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </Field>

          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={terms}
              onChange={(event) => {
                setTerms(event.currentTarget.checked);
                clearFieldError("terms");
              }}
              required
              disabled={isLoading}
              className="rounded border-line text-emerald focus-visible:ring-emerald mt-[3px] shrink-0"
            />
            <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer text-ink disabled:opacity-50">
              I agree to the{" "}
              <Link
                href="/privacy"
                className="text-emerald hover:underline font-medium"
              >
                Terms &amp; Conditions
              </Link>
              .
            </label>
          </div>

          {error && <AuthAlert>{error}</AuthAlert>}

          <Button
            type="submit"
            disabled={isLoading || !terms}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 size-3" /> Creating account…
              </>
            ) : (
              <>
                Create Account
              </>
            )}
          </Button>

          <p className="mt-8 text-center type-body text-ink-muted">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-emerald hover:underline font-medium"
            >
              Sign in
            </Link>
            .
          </p>
        </form>
      }
    />
  );
}
