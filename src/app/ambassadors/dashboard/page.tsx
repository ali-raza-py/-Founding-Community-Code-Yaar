"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";

import {
  REQUIRED_REFERRALS,
  buildReferralUrl,
  generateReferralCode,
  readReferralStorage,
  writeReferralStorage,
  remainingReferrals,
  type AmbassadorReferralProfile,
} from "@/lib/referral";
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

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: "border-line bg-surface text-ink-muted",
    verified: "border-success bg-success-soft text-success",
    rejected: "border-danger-soft bg-danger-soft text-danger",
    invalid: "border-line bg-surface-raised text-ink-subtle",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[status] ?? variants.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AmbassadorDashboardPage() {
  const [storage, setStorage] = useState(() => readReferralStorage());

  // Derive the ambassador email from session storage.
  const ambassadorEmail = typeof window !== "undefined"
    ? window.sessionStorage.getItem("codeyaar.ambassador-email")
    : null;

  // Derive the profile from storage during render (read-only).
  const profile = useMemo(() => {
    if (!ambassadorEmail) return null;
    return storage.ambassadorProfiles[ambassadorEmail] ?? null;
  }, [storage, ambassadorEmail]);

  const referralCode = profile?.referralCode ?? null;

  const myReferrals = useMemo(() => {
    if (!profile) return [];
    return storage.referrals.filter(
      (r) => r.ambassadorEmail === profile.ambassadorEmail,
    );
  }, [storage.referrals, profile]);

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

  const handleGenerateCode = useCallback(() => {
    if (!profile) return;
    const newCode = generateReferralCode();
    const updatedProfile: AmbassadorReferralProfile = {
      ...profile,
      referralCode: newCode,
      lastUpdated: new Date().toISOString(),
    };
    const updatedStorage = {
      ...storage,
      ambassadorProfiles: {
        ...storage.ambassadorProfiles,
        [profile.ambassadorEmail]: updatedProfile,
      },
    };
    setStorage(updatedStorage);
    writeReferralStorage(updatedStorage);
  }, [profile, storage]);

  const remaining = useMemo(
    () => remainingReferrals(profile?.verifiedReferrals ?? 0),
    [profile],
  );

  const progressPercent = useMemo(
    () =>
      profile
        ? Math.min(100, Math.round((profile.verifiedReferrals / REQUIRED_REFERRALS) * 100))
        : 0,
    [profile],
  );

  return (
    <Section padded>
      <SectionInner className="max-w-[72rem]">
        <SectionHeading
          eyebrow="Ambassador Referral Dashboard"
          title="Your Referral Progress"
          description={
            <>
              Shortlisted ambassador candidates must refer <strong>5 qualified
              applicants</strong> to The First 100 founding cohort. This stage
              evaluates your ability to identify relevant people and generate
              genuine community interest. Five verified referrals satisfy the
              referral requirement — they do not guarantee ambassador
              appointment.
            </>
          }
        />

        {/* Referral Link */}
        <div className="mt-10 rounded-xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="type-label mb-1">Your personal referral link</p>
              <p className="text-sm font-semibold text-ink">{profile?.ambassadorEmail ?? "—"}</p>
            </div>
            <div className="flex items-center gap-3">
              {referralUrl && (
                <span className="flex-1 truncate font-mono text-sm text-ink-muted bg-surface-raised rounded-md px-3 py-2 border border-line">
                  {referralUrl}
                </span>
              )}
              {referralUrl && <CopyButton text={referralUrl} />}
            </div>
          </div>
          {referralUrl && (
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
          )}
          {!referralCode && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-ink-muted">
                No referral code generated yet. You will receive one after
                being shortlisted.
              </p>
              <Button
                onClick={handleGenerateCode}
                className="text-xs px-4 py-2"
              >
                Generate code
              </Button>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mt-10 rounded-xl border border-line bg-surface p-6 sm:p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="type-label">Verified referrals</span>
              <span className="text-xl font-semibold text-ink">
                {profile?.verifiedReferrals ?? 0} / {REQUIRED_REFERRALS}
              </span>
            </div>
            <div className="w-full bg-line rounded-full h-2">
              <div
                className="bg-emerald h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={profile?.verifiedReferrals ?? 0}
                aria-valuemin={0}
                aria-valuemax={REQUIRED_REFERRALS}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-ink-subtle">
              <span>{remaining} remaining</span>
              <span>
                {progressPercent >= 100
                  ? "Referral requirement satisfied"
                  : "Keep sharing your link"}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total visits", value: profile?.totalVisits ?? 0, color: "text-ink-muted" },
              {
                label: "Completed applications",
                value: profile?.completedApplications ?? 0,
                color: "text-ink",
              },
              { label: "Pending review", value: profile?.pendingReview ?? 0, color: "text-ink-muted" },
              {
                label: "Verified",
                value: profile?.verifiedReferrals ?? 0,
                color: "text-success",
              },
              { label: "Rejected", value: profile?.rejectedReferrals ?? 0, color: "text-danger" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-line bg-surface p-4"
              >
                <p className="type-caption text-ink-subtle">{item.label}</p>
                <p className="text-sm font-semibold {item.color}">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 type-caption text-ink-subtle">
            Five verified referrals satisfy the referral-stage requirement. They
            do not guarantee ambassador appointment. Final decisions are based
            on the complete selection process.
          </p>
        </div>

        {/* Referral Records */}
        {myReferrals.length > 0 && (
          <div className="mt-10 rounded-xl border border-line bg-surface p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-subtle">
                Referral records
              </h3>
              <p className="type-caption text-ink-muted">
                Applicant details are kept private. Only status and dates are shown.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="pb-3 text-ink-subtle font-medium">Applicant</th>
                    <th className="pb-3 text-ink-subtle font-medium">Status</th>
                    <th className="pb-3 text-ink-subtle font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {myReferrals.map((referral) => (
                    <tr
                      key={referral.id}
                      className="border-b border-line/50 hover:bg-surface-raised transition-colors"
                    >
                      <td className="py-3 text-ink">
                        {referral.applicantName}
                        <br />
                        <span className="type-caption text-ink-muted font-mono">
                          {referral.applicantEmail}
                        </span>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={referral.status} />
                      </td>
                      <td className="py-3 type-caption text-ink-muted">
                        {new Date(referral.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

        {/* Backend notice */}
        <div className="mt-10 rounded-lg border border-line/50 bg-surface-raised p-6">
          <p className="type-label mb-2">Important — backend not configured</p>
          <p className="type-body text-ink-muted">
            This website is frontend-only. Referral codes, verification, and
            ambassador shortlisting require a backend service that has not been
            configured. The dashboard above stores data locally in your browser
            for demonstration only. Real referral verification, duplicate
            detection, and admin review must be implemented server-side before
            the programme goes live.
          </p>
        </div>
      </SectionInner>
    </Section>
  );
}
