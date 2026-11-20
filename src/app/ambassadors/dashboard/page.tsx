"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";

import { buildReferralUrl, AMBASSADOR_REFERRAL_CODES } from "@/lib/referral";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable.
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
      aria-label={copied ? "Copied to clipboard" : "Copy referral link"}
    >
      {copied ? (
        <>
          <svg
            aria-hidden
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg
            aria-hidden
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy link
        </>
      )}
    </button>
  );
}

export default function AmbassadorReferralGuidePage() {
  // Manual ambassador referral codes are assigned by the Code Yaar team.
  // There is no client-side way to determine which code belongs to the
  // current visitor without a backend, so codes are referenced by email.
  const currentEmail = typeof window !== "undefined"
    ? window.sessionStorage.getItem("codeyaar.ambassador-email")
    : null;

  const referralCode = useMemo(() => {
    if (!currentEmail) return null;
    return AMBASSADOR_REFERRAL_CODES[currentEmail] ?? null;
  }, [currentEmail]);

  const referralUrl = useMemo(
    () => (referralCode ? buildReferralUrl(referralCode) : null),
    [referralCode],
  );

  const shareMessage = useMemo(
    () =>
      `Applications are open for The First 100 — Code Yaar's Global Founding Cohort 2026–27. If you're interested in technology, programming or learning with a global community, explore the opportunity and apply here: ${referralUrl ?? ""}`,
    [referralUrl],
  );

  const handleShare = useCallback(() => {
    if (!shareMessage) return;
    if (typeof navigator.share === "function") {
      navigator.share({
        title: "The First 100 — Code Yaar Founding Cohort",
        text: shareMessage,
        url: referralUrl ?? undefined,
      });
    } else {
      navigator.clipboard.writeText(shareMessage);
    }
  }, [shareMessage, referralUrl]);

  return (
    <Section padded>
      <SectionInner className="max-w-[72rem]">
        <SectionHeading
          eyebrow="Ambassador Referral Guide"
          title="Your Referral Link"
          description={
            <>
              As a shortlisted Code Yaar Global Ambassador, you invite others
              to apply to The First 100 founding cohort using your personal
              referral link. Five qualified referrals satisfy the referral
              stage of the evaluation — they do not guarantee appointment.
              Referrals are verified manually by the Code Yaar team.
            </>
          }
        />

        {/* Referral Link */}
        <div className="mt-10 rounded-xl border border-line bg-surface p-6 sm:p-8">
          {referralCode && referralUrl ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <p className="type-label mb-1">Your personal referral link</p>
                  <p className="text-sm font-medium text-ink">
                    Referral code: <span className="font-mono text-emerald">{referralCode}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex-1 truncate font-mono text-sm text-ink-muted bg-surface-raised rounded-md px-3 py-2 border border-line">
                    {referralUrl}
                  </span>
                  <CopyButton text={referralUrl} />
                </div>
              </div>
              <Button
                onClick={handleShare}
                className="w-full sm:w-auto"
                variant="outline"
              >
                <svg
                  aria-hidden
                  className="size-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                </svg>
                Share invitation
              </Button>
            </>
          ) : (
            <>
              <div className="rounded-lg border border-line bg-surface-raised p-6 text-center">
                <p className="type-label mb-3">No referral code assigned yet.</p>
                <p className="type-body mb-6">
                  Shortlisted ambassadors receive their personal referral code
                  from the Code Yaar team by email. Once you have been
                  shortlisted, your code will appear here automatically.
                </p>
                <p className="type-caption text-ink-muted">
                  There is no self-service code generation on this site — codes
                  are assigned manually by the Code Yaar team.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Referral Instructions */}
        <div className="mt-10 rounded-xl border border-line bg-surface p-6 sm:p-8">
          <h3 className="type-label mb-4">How it works</h3>
          <ul className="space-y-4 text-sm text-ink">
            <li className="flex gap-3">
              <span className="shrink-0 rounded-full bg-emerald px-3 py-1 text-[0.8125rem] font-medium text-white">
                1
              </span>
              <p className="text-ink">
                Share your referral link with people who are a good fit for The
                First 100 founding cohort. Your link looks like:{""}
                <span className="font-mono">{referralCode}</span>
              </p>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 rounded-full bg-emerald px-3 py-1 text-[0.8125rem] font-medium text-white">
                2
              </span>
              <p className="text-ink">
                Your referrals apply through your link. Each application is
                tagged with your referral code automatically.
              </p>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 rounded-full bg-emerald px-3 py-1 text-[0.8125rem] font-medium text-white">
                3
              </span>
              <p className="text-ink">
                The Code Yaar team verifies referrals manually and counts how
                many qualified applicants you referred.
              </p>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 rounded-full bg-emerald px-3 py-1 text-[0.8125rem] font-medium text-white">
                4
              </span>
              <p className="text-ink">
                Five qualified referrals satisfy the referral stage of the
                ambassador evaluation (15 of 100 points). They do not guarantee
                appointment.
              </p>
            </li>
          </ul>
        </div>

        {/* Honest verification notice */}
        <div className="mt-10 rounded-lg border border-line bg-surface p-6">
          <p className="type-label mb-2">Manual verification only</p>
          <p className="type-body text-ink-muted">
            This website is frontend-only. Referral codes are assigned manually
            by the Code Yaar team, and referral verification happens server-side
            by the programme administrators. No referral statistics, tracking,
            or progress bars are available in this frontend. Do not rely on any
            client-side display for your referral count.
          </p>
        </div>

        {/* Back to programme */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/ambassadors"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            <svg
              aria-hidden
              className="size-4 -mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Ambassador Programme
          </Link>
        </div>
      </SectionInner>
    </Section>
  );
}