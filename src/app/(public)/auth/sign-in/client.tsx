"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import { communityApi } from "@/lib/api/client";
import { cn } from "@/lib/utils";
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

export default function SignInPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlMessage = searchParams.get("message");
  const urlVariant = searchParams.get("variant");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Restore persisted email when "Remember me" was previously checked.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("code_yaar_auth_email");
    if (stored) {
      setEmail(stored);
      setRememberMe(true);
    }
  }, []);

  const clearFieldError = (field: "email" | "password") => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (next[field]) {
        delete next[field];
        return next;
      }
      return prev;
    });
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError(null);

      let invalid = false;
      const nextErrors: { email?: string; password?: string } = {};

      const emailValue = email.trim();
      if (!emailValue) {
        nextErrors.email = "Please enter your email address.";
        invalid = true;
      } else if (!EMAIL_REGEX.test(emailValue)) {
        nextErrors.email = "Enter a valid email address.";
        invalid = true;
      }

      if (!password) {
        nextErrors.password = "Please enter your password.";
        invalid = true;
      }

      setFieldErrors(nextErrors);
      if (invalid) return;

      if (!isSupabaseConfigured()) {
        setError(
          "Authentication is not configured. Please contact the Code Yaar team.",
        );
        return;
      }

      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        setError(
          "Authentication is not configured. Please contact the Code Yaar team.",
        );
        return;
      }

      setIsLoading(true);

      // Step 1: Authenticate with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailValue,
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
      let verifiedRole:
        | "super_admin"
        | "admin"
        | "participant"
        | null = null;
      try {
        const result = await communityApi.session(accessToken);

        if (result.ok) {
          verifiedRole = result.data.user.role;
        }
      } catch {
        // Backend unreachable — allow sign-in via Supabase with limited info.
        verifiedRole = null;
      }

      setIsLoading(false);

      // Persist the email only when "Remember me" was checked.
      if (rememberMe) {
        localStorage.setItem("code_yaar_auth_email", emailValue);
      } else {
        localStorage.removeItem("code_yaar_auth_email");
      }

      // Step 3: Redirect based on verified backend role.
      // Use fire-and-forget navigation so a navigation rejection cannot surface
      // as an error after the Supabase session has already been established.
      const safeNavigate = (path: string) => {
        router.push(path);
      };

      if (verifiedRole === "super_admin") {
        safeNavigate("/admin/users");
      } else if (verifiedRole === "admin") {
        safeNavigate("/admin");
      } else {
        safeNavigate("/dashboard");
      }
    },
    [email, password, rememberMe, router],
  );

  return (
    <AuthShell
      brand={
        <div className="flex flex-col items-start lg:items-center gap-6 text-center lg:text-center">
          <AuthLogo />
          <h2 className="type-display text-ink">Your journey starts here.</h2>
          <p className="type-body-muted max-w-[24rem]">
            Sign in to access your Founding Community workspace.
          </p>
          <BrandVisual className="mt-8 lg:mt-auto" />
          <p className="type-small text-ink-subtle mt-8 lg:mt-auto">
            Think. Build. Evolve.
          </p>
        </div>
      }
      form={
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h2 className="type-display text-ink">Welcome back</h2>
            <p className="type-body-muted mt-2">
              Sign in to continue your journey with Code Yaar.
            </p>
          </div>

          {urlMessage && (
            <div
              role="alert"
              className={cn(
                "inline-flex w-full items-center gap-3 rounded-lg border p-3 text-sm leading-relaxed mb-6",
                urlVariant === "success"
                  ? "border-emerald/30 bg-emerald-soft text-emerald-900"
                  : "border-danger/30 bg-danger-soft text-danger",
              )}
            >
              {urlVariant === "success" ? (
                <CheckCircle2 className="size-5 shrink-0" />
              ) : (
                <AlertCircle className="size-5 shrink-0" />
              )}
              {urlMessage}
            </div>
          )}

          <Field
            label="Email address"
            required
            error={fieldErrors.email}
            hint="We&rsquo;ll never share your address."
          >
            <Input
              id="sign-in-email"
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
              className="pr-10"
            />
          </Field>

          <Field label="Password" required error={fieldErrors.password}>
            <div className="relative">
              <Input
                id="sign-in-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(event) => {
                  setPassword(event.currentTarget.value);
                  clearFieldError("password");
                }}
                required
                autoComplete="current-password"
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
          </Field>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm disabled:opacity-50">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.currentTarget.checked)}
                disabled={isLoading}
                className="rounded border-line text-emerald focus-visible:ring-emerald shrink-0 mt-[1px]"
              />
              Remember me
            </label>
            <Link
              href="/auth/forgot-password"
              className="type-small text-emerald hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {error && <AuthAlert>{error}</AuthAlert>}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Spinner className="mr-2 size-3" /> Signing in…
              </>
            ) : (
              <>
                Sign in <ChevronRight className="size-4 ml-1" />
              </>
            )}
          </Button>

          <p className="mt-8 text-center type-body text-ink-muted">
            New to Code Yaar?{" "}
            <Link
              href="/auth/sign-up"
              className="text-emerald hover:underline font-medium"
            >
              Create an account
            </Link>
            .
          </p>
        </form>
      }
    />
  );
}
