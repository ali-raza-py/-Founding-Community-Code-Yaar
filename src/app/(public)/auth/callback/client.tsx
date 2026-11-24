"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import { validateRedirectDestination } from "@/lib/auth-url";
import { Button } from "@/components/ui/button";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";

const SUPPORTED_OTP_TYPES = [
  "email",
  "phone",
  "sms",
  "email_change",
  "recovery",
  "invite",
] as const;

type OtpType = (typeof SUPPORTED_OTP_TYPES)[number];

export default function AuthCallbackPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Supabase includes the OTP type in every verification callback URL
  // (confirmation, recovery, invite, etc.). Never assume a single format.
  const rawType = (searchParams.get("type") ?? "email") as string;
  const type: OtpType = SUPPORTED_OTP_TYPES.includes(rawType as OtpType)
    ? (rawType as OtpType)
    : "email";
  const tokenHash = searchParams.get("token_hash") ?? null;
  const errorParam = searchParams.get("error") ?? null;
  const redirectTo = validateRedirectDestination(
    searchParams.get("redirect_to") ?? null,
  );

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const isConfigured = isSupabaseConfigured() && Boolean(supabase);

  const [view, setView] = useState<
    "verifying" | "success" | "already-verified" | "error"
  >("verifying");
  const [message, setMessage] = useState("");
  const [detail, setDetail] = useState("");
  const executed = useRef(false);

  const finish = useCallback(
    (nextView: typeof view, nextMessage: string, nextDetail?: string) => {
      setView(nextView);
      setMessage(nextMessage);
      setDetail(nextDetail ?? "");
    },
    [],
  );

  useEffect(() => {
    if (executed.current) return;
    executed.current = true;

    const run = async () => {
      // A redirect URL reported by Supabase itself (misconfigured link).
      if (errorParam) {
        finish(
          "error",
          "Verification could not be completed.",
          "The verification link reported an error. Please request a new verification link or sign in.",
        );
        return;
      }

      if (!isConfigured || !supabase) {
        finish(
          "error",
          "Authentication is not configured.",
          "Please contact the Code Yaar team.",
        );
        return;
      }

      if (!tokenHash) {
        finish(
          "error",
          "Invalid verification link.",
          "No verification token was found in this link. It may have already been used.",
        );
        return;
      }

      setView("verifying");

      // Verify the token exactly once. Supabase validates token_hash + type.
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });

      if (verifyError) {
        const messageText = (verifyError.message ?? "").toLowerCase();

        // An already-confirmed email is not a failure — treat as verified.
        if (
          messageText.includes("already confirm") ||
          messageText.includes("already verified") ||
          messageText.includes("otp has already been used")
        ) {
          const { data: { session } } = await supabase.auth.getSession();
          const hasSession = Boolean(session?.access_token);
          finish(
            "already-verified",
            hasSession ? "Email verified successfully!" : "Your email was already verified.",
            hasSession
              ? "Welcome to Code Yaar Founding Community."
              : "Please sign in to continue.",
          );
          const destination = hasSession
            ? redirectTo ?? "/dashboard"
            : `/auth/sign-in?message=${encodeURIComponent(
                "Your email is already verified. Please sign in.",
              )}&variant=success`;
          setTimeout(() => void router.replace(destination), 1500);
          return;
        }

        finish(
          "error",
          "Unable to verify your email address.",
          verifyError.message ?? "The verification link is invalid or has expired.",
        );
        return;
      }

      // Establish / refresh the authenticated session from the verified token.
      const { data: { session }, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) {
        finish(
          "error",
          "Unable to verify your email address.",
          sessionError.message ?? "The verification link is invalid or has expired.",
        );
        return;
      }

      const hasSession = Boolean(session?.access_token);
      finish(
        "success",
        "Email verified successfully!",
        "Your email is now verified. Welcome to Code Yaar Founding Community.",
      );

      if (hasSession) {
        // Session established — go to the authenticated account/dashboard.
        setTimeout(() => void router.replace(redirectTo ?? "/dashboard"), 1500);
      } else {
        // No session — send the user to Sign In with a success notification.
        setTimeout(
          () =>
            void router.replace(
              `/auth/sign-in?message=${encodeURIComponent(
                "Email verified successfully! You can now sign in to your Code Yaar account.",
              )}&variant=success`,
            ),
          1500,
        );
      }
    };

    void run();
  }, [tokenHash, type, errorParam, redirectTo, isConfigured, supabase, router, finish]);

  return (
    <Section padded>
      <SectionInner className="max-w-[28rem] mx-auto text-center">
        <Mail className="mx-auto size-8 mb-4 text-ink-muted" />

        {view === "error" ? (
          <>
            <AlertCircle className="mx-auto size-8 mb-4 text-danger" />
            <SectionHeading
              eyebrow="Verification failed"
              title={message}
              description={detail}
            />
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/sign-in">
                <Button className="w-full sm:w-auto">Go to sign in</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button variant="outline" className="w-full sm:w-auto">
                  Create an account
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <CheckCircle2
              className={`mx-auto size-8 mb-4 ${
                view === "already-verified" ? "text-ink-muted" : "text-emerald"
              }`}
            />
            <SectionHeading
              eyebrow={
                view === "already-verified" ? "Already verified" : undefined
              }
              title={message}
              description={detail}
            />
            {view === "verifying" && (
              <p className="mt-6 type-caption text-ink-muted">
                Confirming your email…
              </p>
            )}
          </>
        )}
      </SectionInner>
    </Section>
  );
}
