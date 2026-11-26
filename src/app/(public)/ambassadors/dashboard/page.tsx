"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { getMyReferral, buildReferralUrl, REQUIRED_REFERRALS } from "@/lib/referral";
import { Section, SectionInner } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { type ReferralRecord } from "@/lib/api/types";

export default function AmbassadorDashboardPage() {
  const { accessToken, user, isAuthenticated } = useAuth();
  const [referral, setReferral] = useState<ReferralRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void getMyReferral(accessToken).then((result) => {
      setLoading(false);
      if (!result.ok) {
        setError(result.error || "Unable to load your referral information.");
        return;
      }
      setReferral(result.data ?? null);
    });
  }, [isAuthenticated, accessToken]);

  const referralUrl = referral ? buildReferralUrl(referral.referral_code) : null;
  const total = referral?.total_registrations ?? 0;
  const verified = referral?.verified_registrations ?? 0;
  const conversion = total > 0 ? Math.round((verified / total) * 100) : 0;

  if (!isAuthenticated) {
    return (
      <Section padded>
        <SectionInner className="max-w-[42rem] text-center">
          <h2 className="mb-6">Ambassador Referral Dashboard</h2>
          <p className="type-body mb-6">
            Sign in to view your referral code, shareable link, and referral
            statistics.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            Sign in
          </Link>
        </SectionInner>
      </Section>
    );
  }

  return (
    <Section padded>
      <SectionInner className="max-w-[48rem]">
        <div className="mb-8">
          <h2 className="mb-2">Ambassador Referral Dashboard</h2>
          <p className="type-body-muted">
            Your unique referral code and link. Share the link to invite people
            to apply to The First 100.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="type-body text-ink-muted">Loading your referral…</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-danger-soft bg-danger-soft p-6 text-center">
            <p className="text-sm font-semibold text-danger">{error}</p>
            <p className="mt-2 type-body text-ink-muted">
              Please sign in again or contact the Code Yaar team.
            </p>
          </div>
        ) : !referral ? (
          <div className="rounded-lg border border-line bg-surface p-10 text-center">
            <p className="type-body mb-4">No referral code assigned yet.</p>
            <p className="type-caption text-ink-muted">
              Once you are shortlisted as a Code Yaar ambassador, a unique
              referral code will be generated for you here.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3 text-center mb-8">
              <div className="rounded-lg border border-line bg-surface p-5">
                <p className="type-caption text-ink-muted">Referral code</p>
                <p className="mt-1 font-mono font-semibold text-ink">{referral.referral_code}</p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-5">
                <p className="type-caption text-ink-muted">Total referred registrations</p>
                <p className="mt-1 text-2xl font-semibold text-ink">{total}</p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-5">
                <p className="type-caption text-ink-muted">Verified registrations</p>
                <p className="mt-1 text-2xl font-semibold text-emerald">{verified}</p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-5">
                <p className="type-caption text-ink-muted">Conversion rate</p>
                <p className="mt-1 text-2xl font-semibold text-ink">{conversion}%</p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-5">
                <p className="type-caption text-ink-muted">Target (qualified)</p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  {Math.min(verified, REQUIRED_REFERRALS)} / {REQUIRED_REFERRALS}
                </p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-5">
                <p className="type-caption text-ink-muted">Progress to five</p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  {Math.min(total, REQUIRED_REFERRALS)} / {REQUIRED_REFERRALS}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-surface p-6 mb-8">
              <p className="type-label mb-3">Shareable referral link</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={referralUrl ?? ""}
                  className="flex-1 rounded-md border border-line px-4 py-2.5 text-sm font-mono text-ink bg-white"
                />
                <Button onClick={() => copyLink(referralUrl ?? "")}>Copy</Button>
              </div>
              <p className="mt-2 type-caption text-ink-muted">
                Directs applicants to {referralUrl}
              </p>
            </div>

            {referral.registrations && referral.registrations.length > 0 && (
              <div className="rounded-lg border border-line bg-surface p-6">
                <p className="type-label mb-3">Recent registrations</p>
                <ul className="space-y-2">
                  {referral.registrations.slice(0, 10).map((reg) => (
                    <li key={reg.id} className="flex justify-between items-center text-sm border-b border-line/50 pb-2 last:border-0">
                      <span className="text-ink-muted">{reg.registered_email}</span>
                      <span
                        className={`font-mono text-xs px-2 py-0.5 rounded ${
                          reg.verification_status === "verified"
                            ? "bg-success-soft text-success"
                            : "bg-line text-ink-muted"
                        }`}
                      >
                        {reg.verification_status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-6 type-caption text-ink-muted">
              Registrations are attributed when an applicant submits The First
              100 application through your referral link. Verified registrations
              are reviewed by the Code Yaar team. Reaching five qualified
              applicants is the ambassador referral stage target — selection is
              not guaranteed solely by referrals.
            </p>
          </>
        )}
      </SectionInner>
    </Section>
  );
}

function copyLink(url: string) {
  if (typeof window === "undefined") return;
  void navigator.clipboard.writeText(url).catch(() => {
    try {
      window.prompt("Copy this link:", url);
    } catch {
      // Ignore
    }
  });
}
