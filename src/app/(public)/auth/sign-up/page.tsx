"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Section, SectionInner } from "@/components/ui/section";

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

      if (!fullName.trim()) {
        setError("Please enter your full name.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (!terms) {
        setError("Please accept the terms and conditions.");
        return;
      }

      setIsLoading(true);

      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
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
          // Check if email confirmation is required.
          if (data.user.identities?.[0]?.identity_data?.email) {
            router.push(
              "/auth/sign-in?message=Account created. Please check your email to confirm your account, then sign in.",
            );
          } else {
            router.push("/dashboard");
          }
        }
      } catch {
        setIsLoading(false);
        setError("Unable to create account. Please try again.");
      }
    },
    [email, password, confirmPassword, fullName, terms, router, supabase],
  );

  if (!isSupabaseConfigured()) {
    return (
      <Section padded>
        <SectionInner className="text-center">
          <h1 className="type-display text-ink">Authentication Not Configured</h1>
          <p className="type-body-muted">
            Supabase Auth is not configured on this site. Please contact the Code Yaar team.
          </p>
        </SectionInner>
      </Section>
    );
  }

  return (
    <div className="relative isolate min-h-screen flex flex-col bg-surface">
      {/* Desktop: split-screen layout */}
      <div className="hidden lg:flex flex-1">
        {/* Left column: signup form */}
        <div className="w-1/2 flex flex-col justify-center py-20 lg:py-0 px-8 sm:px-12 lg:px-16">
          <div className="max-w-[28rem] mx-auto">
            <h2 className="type-display text-ink mb-3">Start Your Journey With Us</h2>
            <p className="type-body mb-8">
              Join the Code Yaar Founding Community and help shape the future
              of practical computer science education.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="type-label flex items-center gap-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.currentTarget.value)}
                  required
                  autoComplete="name"
                  disabled={isLoading}
                  className="flex h-10 w-full border-b border-line bg-transparent px-0 py-2 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-emerald focus-visible:ring-0 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="type-label flex items-center gap-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  className="flex h-10 w-full border-b border-line bg-transparent px-0 py-2 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-emerald focus-visible:ring-0 transition-colors"
                />
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="type-label flex items-center gap-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                  className="flex h-10 w-full border-b border-line bg-transparent px-0 py-2 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-emerald focus-visible:ring-0 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-emerald focus-visible:outline-none focus-visible:ring-emerald transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="type-label flex items-center gap-1">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                  className="flex h-10 w-full border-b border-line bg-transparent px-0 py-2 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-emerald focus-visible:ring-0 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-emerald focus-visible:outline-none focus-visible:ring-emerald transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>

              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.currentTarget.checked)}
                  required
                  disabled={isLoading}
                  className="rounded border-line text-emerald focus-visible:ring-emerald mt-[3px] shrink-0"
                />
                <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer text-ink disabled:opacity-50">
                  I agree to the{" "}
                  <a href="/privacy" className="text-emerald hover:underline font-medium">
                    Terms &amp; Conditions
                  </a>
                  .
                </label>
              </div>

              {error && (
                <p className="text-[0.8125rem] text-danger font-medium" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading || !terms}
                className="w-full"
              >
                {isLoading ? "Creating account…" : "Create Account"}
              </Button>
            </form>

            <p className="mt-8 text-center type-body text-ink-muted">
              Already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="text-emerald hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right column: illustration */}
        <div className="w-1/2 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-16">
          <div className="relative w-full h-[44rem] sm:h-[60rem] max-w-[48rem] z-0">
            <svg
              className="w-full h-full block"
              viewBox="0 0 1000 700"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background decorative shape */}
              <path
                d="M100 650 Q450 150 800 650 Q500 700 100 650"
                fill="#d1fae5"
                opacity="0.6"
              />
              <path
                d="M150 620 Q400 200 650 620 Q375 680 150 620"
                fill="#eaf3ee"
                opacity="0.5"
              />

              {/* Open book */}
              <path
                d="M300 350 Q250 200 350 180 Q450 160 400 300 Q350 440 250 380 Q300 320 300 350"
                fill="#f7f8f5"
                stroke="#b9d4c8"
                strokeWidth="2"
              />
              <path
                d="M400 350 Q450 200 550 180 Q650 160 600 300 Q550 440 650 380 Q600 320 600 350"
                fill="#ffffff"
                stroke="#b9d4c8"
                strokeWidth="2"
              />
              <path d="M350 180 Q450 140 550 160" fill="none" stroke="#b9d4c8" strokeWidth="2" />
              <path d="M400 300 Q450 260 500 320" fill="none" stroke="#b9d4c8" strokeWidth="2" />
              <path d="M300 380 Q350 340 400 300" fill="none" stroke="#b9d4c8" strokeWidth="2" />

              {/* Book pages lines */}
              <path d="M320 310 Q380 290 440 310" fill="none" stroke="#e8ece8" strokeWidth="1" />
              <path d="M320 330 Q380 310 440 330" fill="none" stroke="#e8ece8" strokeWidth="1" />
              <path d="M320 350 Q380 330 440 350" fill="none" stroke="#e8ece8" strokeWidth="1" />
              <path d="M560 310 Q500 290 440 310" fill="none" stroke="#e8ece8" strokeWidth="1" />
              <path d="M560 330 Q500 310 440 330" fill="none" stroke="#e8ece8" strokeWidth="1" />
              <path d="M560 350 Q500 330 440 350" fill="none" stroke="#e8ece8" strokeWidth="1" />

              {/* Person silhouette */}
              <path
                d="M420 420 Q400 380 380 400 Q360 420 360 480 Q360 540 380 580 Q420 620 460 580 Q500 540 500 480 Q500 420 480 400 Q460 380 440 400 Q430 380 420 420"
                fill="#123d2b"
              />
              <path
                d="M420 420 Q390 440 390 480 Q390 520 400 560 Q410 600 440 580 Q470 560 480 520 Q480 480 470 440 Q450 420 440 400 Q430 380 420 420"
                fill="#0e1c16"
              />

              {/* Person's arm holding laptop */}
              <path
                d="M460 580 Q500 620 540 600 Q580 580 600 560 Q620 540 600 500 Q580 460 560 440 Q540 420 520 400 Q500 380 480 400 Q460 380 440 420 Q440 440 450 480 Q460 520 470 560 Q480 600 490 620 Q500 640 510 620 Q520 600 530 580 Q540 560 550 540 Q560 520 570 500 Q580 480 590 460 Q600 440 610 420 Q620 400 630 380 Q640 360 650 340 Q660 320 670 300 Q680 280 690 260 Q700 240 710 220 Q720 200 730 180 Q740 160 750 140 Q760 120 770 100 Q780 80 790 60 Q800 40 820 20 Q840 0 860 -20"
                fill="#123d2b"
                opacity="0"
              />

              {/* Laptop */}
              <path
                d="M520 480 Q560 480 600 480 Q640 480 680 520 Q720 560 720 600 Q720 640 680 680 Q640 720 600 740 Q560 760 520 760 Q480 760 440 740 Q400 720 360 680 Q320 640 280 600 Q240 560 240 520 Q240 480 260 440 Q280 400 300 380 Q320 360 340 360 Q360 360 380 380 Q400 400 420 420 Q440 440 460 460 Q480 480 500 480"
                fill="#ffffff"
                stroke="#b9d4c8"
                strokeWidth="2"
              />
              <path
                d="M520 480 Q540 460 560 440 Q580 420 600 400 Q620 380 640 360 Q660 340 680 320 Q700 300 720 280 Q740 260 760 240 Q780 220 800 200 Q820 180 840 160 Q860 140 880 120 Q900 100 920 80 Q940 60 960 40 Q980 20 1000 0 Q1000 0 520 480"
                fill="#f0fdf4"
                opacity="0.3"
              />
              <path
                d="M540 500 Q560 500 580 500 Q600 500 620 500 Q640 500 660 500 Q680 500 700 500 Q720 500 740 500 Q760 500 780 500"
                fill="none"
                stroke="#e8ece8"
                strokeWidth="2"
              />
              <path d="M540 520 Q560 520 580 520 Q600 520 620 520 Q640 520 660 520 Q680 520 700 520 Q720 520 740 520 Q760 520 780 520" fill="none" stroke="#e8ece8" strokeWidth="1" />
              <path d="M540 540 Q560 540 580 540 Q600 540 620 540 Q640 540 660 540 Q680 540 700 540 Q720 540 740 540 Q760 540 780 540" fill="none" stroke="#e8ece8" strokeWidth="1" />

              {/* Coffee cup beside laptop */}
              <path
                d="M640 680 Q620 680 600 700 Q580 720 580 740 Q580 760 600 780 Q620 800 640 800 Q660 800 680 780 Q700 760 700 740 Q700 720 680 700 Q660 680 640 680"
                fill="#b9d4c8"
              />
              <path
                d="M600 700 Q580 700 580 720 Q580 740 600 760 Q620 780 640 780 Q660 780 680 760 Q700 740 700 720 Q680 700 660 680 Q640 680 620 680 Q600 680 600 700"
                fill="#ffffff"
              />

              {/* Decorative dots around illustration */}
              <circle cx="200" cy="100" r="4" fill="#b9d4c8" opacity="0.6" />
              <circle cx="800" cy="100" r="3" fill="#b9d4c8" opacity="0.4" />
              <circle cx="100" cy="400" r="3" fill="#b9d4c8" opacity="0.4" />
              <circle cx="900" cy="600" r="4" fill="#b9d4c8" opacity="0.6" />
              <circle cx="500" cy="100" r="2" fill="#b9d4c8" opacity="0.3" />
              <circle cx="500" cy="600" r="3" fill="#b9d4c8" opacity="0.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile: centered form, no illustration */}
      <div className="lg:hidden flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="max-w-[28rem] w-full">
          <h2 className="type-display text-ink mb-3">Start Your Journey With Us</h2>
          <p className="type-body mb-8">
            Join the Code Yaar Founding Community and help shape the future
            of practical computer science education.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="type-label flex items-center gap-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Jane Smith"
                value={fullName}
                onChange={(e) => setFullName(e.currentTarget.value)}
                required
                autoComplete="name"
                disabled={isLoading}
                className="flex h-10 w-full border-b border-line bg-transparent px-0 py-2 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-emerald focus-visible:ring-0 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="type-label flex items-center gap-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
                autoComplete="email"
                disabled={isLoading}
                className="flex h-10 w-full border-b border-line bg-transparent px-0 py-2 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-emerald focus-visible:ring-0 transition-colors"
              />
            </div>

            <div className="relative flex flex-col gap-2">
              <label className="type-label flex items-center gap-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                autoComplete="new-password"
                disabled={isLoading}
                className="flex h-10 w-full border-b border-line bg-transparent px-0 py-2 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-emerald focus-visible:ring-0 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-emerald focus-visible:outline-none focus-visible:ring-emerald transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <div className="relative flex flex-col gap-2">
              <label className="type-label flex items-center gap-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                required
                autoComplete="new-password"
                disabled={isLoading}
                className="flex h-10 w-full border-b border-line bg-transparent px-0 py-2 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-emerald focus-visible:ring-0 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-emerald focus-visible:outline-none focus-visible:ring-emerald transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "🙈" : "👁"}
              </button>
            </div>

            <div className="flex items-start gap-2">
              <input
                id="terms-mobile"
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.currentTarget.checked)}
                required
                disabled={isLoading}
                className="rounded border-line text-emerald focus-visible:ring-emerald mt-[3px] shrink-0"
              />
              <label htmlFor="terms-mobile" className="text-sm leading-relaxed cursor-pointer text-ink disabled:opacity-50">
                I agree to the{" "}
                <a href="/privacy" className="text-emerald hover:underline font-medium">
                  Terms &amp; Conditions
                </a>
                .
              </label>
            </div>

            {error && (
              <p className="text-[0.8125rem] text-danger font-medium" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading || !terms}
              className="w-full"
            >
              {isLoading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="mt-8 text-center type-body text-ink-muted">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-emerald hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
