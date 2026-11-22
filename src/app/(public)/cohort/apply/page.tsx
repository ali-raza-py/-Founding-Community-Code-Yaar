"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { extractReferralCode, COHORT_REFERRAL_KEY } from "@/lib/referral";
import { Section, SectionInner } from "@/components/ui/section";

function CohortApplyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRedirected = useRef(false);

  // Read referral code from URL during render (no effect needed).
  const refFromUrl = typeof window !== "undefined"
    ? searchParams.get("ref")
    : null;
  const storedRef = typeof window !== "undefined"
    ? (() => { try { return window.sessionStorage.getItem(COHORT_REFERRAL_KEY); } catch { return null; } })()
    : null;
  const referralCode = useMemo(() => {
    if (refFromUrl) {
      const code = extractReferralCode(refFromUrl);
      if (code) {
        try { window.sessionStorage.setItem(COHORT_REFERRAL_KEY, code); } catch {}
        return code;
      }
    }
    return storedRef;
  }, [refFromUrl, storedRef]);

  // Navigate to the main apply page once the referral code is captured.
  useEffect(() => {
    if (referralCode && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push(`/apply?ref=${encodeURIComponent(referralCode)}`);
    }
  }, [referralCode, router]);

  return (
    <Section padded>
      <SectionInner className="text-center py-24">
        <div className="mx-auto max-w-[42rem]">
          <p className="type-label mb-4 text-emerald tracking-widest">
            THE FIRST 100 — GLOBAL FOUNDING COHORT 2026&ndash;27
          </p>
          <h1 className="type-display mb-6">Apply to The First 100</h1>
          {referralCode && (
            <div className="mb-8 rounded-lg border border-line bg-emerald-soft p-6">
              <p className="type-body mb-3 text-ink">
                You were referred by ambassador{" "}
                <span className="font-mono text-emerald">{referralCode}</span>
              </p>
              <p className="type-caption text-ink-muted">
                Your application will be associated with this referral.
              </p>
            </div>
          )}
          <p className="type-body-muted mb-10">
            Redirecting you to the application form&hellip;
          </p>
          {!referralCode && (
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-emerald-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              Continue to Application
            </Link>
          )}
        </div>
      </SectionInner>
    </Section>
  );
}

export default function CohortApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="type-body text-ink-muted">Loading…</p></div>}>
      <CohortApplyContent />
    </Suspense>
  );
}
