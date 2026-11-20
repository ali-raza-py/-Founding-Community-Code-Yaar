"use client";

import {
  AlertTriangle,
  CheckCircle2,
  CloudOff,
  Loader2,
  RefreshCw,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { CAMPAIGN } from "@/lib/constants";
import { MascotCharacter } from "@/components/hero/MascotCharacter";
import type { SubmissionStatus as Status } from "@/types/application";

function useFocusHeading<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return ref;
}

export function SubmissionSuccess({
  reference,
}: {
  reference: string | null;
}) {
  const headingRef = useFocusHeading<HTMLHeadingElement>();
  const reduced = useReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-[8px] border border-emerald-600/30 bg-emerald-100/50 p-6 sm:p-8 relative overflow-hidden"
    >
      {!reduced && (
        <MascotCharacter
          color="emerald"
          size={44}
          state="celebrate"
          motion="arrive"
          trackPointer={false}
          lookAround={0.2}
          className="absolute -top-4 -right-4 z-10"
          style={{ transform: "rotate(-6deg)" }}
        />
      )}
      <CheckCircle2 aria-hidden className="size-6 text-emerald-700" />
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 type-h3 text-ink focus:outline-none sm:text-[2.25rem] sm:leading-none"
      >
        Your application has been sent.
      </h2>
      <p className="mt-3 max-w-[56ch] text-[0.9375rem] leading-relaxed text-ink">
        The Code Yaar team now has your answers for {CAMPAIGN.label}. Thank you
        for taking the time to write them properly.
      </p>

      {reference ? (
        <p className="mt-4 inline-flex items-baseline gap-2 rounded-[4px] border border-line-strong bg-canvas px-3 py-2 text-[0.8125rem]">
          <span className="text-ink-subtle">Reference</span>
          <span className="font-mono font-medium text-ink">{reference}</span>
        </p>
      ) : null}

      <dl className="mt-6 space-y-3 border-t border-emerald-600/20 pt-5 text-[0.875rem] leading-relaxed">
        <div>
          <dt className="font-medium text-ink">What happens next</dt>
          <dd className="text-ink-muted">
            We are reviewing applications as a small team. A review timeline has
            not been published yet, so we cannot promise a response date.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-ink">Confirmation email</dt>
          <dd className="text-ink-muted">
            No confirmation email is sent at this stage. Keep your reference, if
            one was shown above.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-ink">Your draft</dt>
          <dd className="text-ink-muted">
            The local draft saved in this browser has been cleared.
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/cohort"
          className="inline-flex h-10 items-center justify-center rounded-[6px] border border-line-strong bg-canvas px-4 text-[0.875rem] font-medium text-ink transition-colors hover:border-emerald-700"
        >
          Read about the cohort
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-[6px] px-4 text-[0.875rem] font-medium text-emerald-400 underline decoration-line-strong underline-offset-4 hover:decoration-emerald-600"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

const COPY: Record<
  Extract<Status, { state: "error" }>["reason"],
  { title: string; body: string; icon: typeof AlertTriangle; retry: boolean }
> = {
  "not-configured": {
    title: "This form is not connected to a submission service yet.",
    body: "Your answers have not been sent and nothing was stored. The site is still being set up, so submission is disabled rather than pretending to succeed. Please try again later or contact the Code Yaar team directly.",
    icon: CloudOff,
    retry: false,
  },
  network: {
    title: "We could not reach the submission service.",
    body: "Your answers are still in this form and a draft is saved in this browser. Check your connection and try again — you will not need to re-enter anything.",
    icon: CloudOff,
    retry: true,
  },
  timeout: {
    title: "The submission took too long.",
    body: "The request timed out, so we cannot tell whether it arrived. Your answers are still here. You can retry — the same submission reference is reused to avoid duplicate applications.",
    icon: Timer,
    retry: true,
  },
  rejected: {
    title: "The submission was rejected.",
    body: "The service refused this application, which usually means an answer did not pass validation. Review your answers, then retry. If it keeps happening, contact the team instead of resubmitting repeatedly.",
    icon: AlertTriangle,
    retry: true,
  },
  server: {
    title: "The submission service had a problem.",
    body: "Something failed on the receiving side. Your answers are intact. Try again in a moment; if the problem continues, contact the team.",
    icon: AlertTriangle,
    retry: true,
  },
};

export function SubmissionError({
  status,
  onRetry,
}: {
  status: Extract<Status, { state: "error" }>;
  onRetry: () => void;
}) {
  const copy = COPY[status.reason];
  const Icon = copy.icon;
  const headingRef = useFocusHeading<HTMLHeadingElement>();

  return (
    <div
      role="alert"
      className={`rounded-[8px] border p-5 ${
        status.reason === "not-configured"
          ? "border-line-strong bg-surface"
          : "border-danger/30 bg-danger-soft/60"
      }`}
    >
      <div className="flex gap-3">
        <Icon
          aria-hidden
          className={`mt-0.5 size-5 shrink-0 ${
            status.reason === "not-configured" ? "text-ink-subtle" : "text-danger"
          }`}
        />
        <div>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-[1rem] font-semibold text-ink focus:outline-none"
          >
            {copy.title}
          </h2>
          <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-muted">
            {copy.body}
          </p>
          {status.status ? (
            <p className="mt-2 font-mono text-[0.75rem] text-ink-subtle">
              HTTP {status.status}
            </p>
          ) : null}
          {copy.retry && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onRetry}
              className="mt-4"
            >
              <RefreshCw aria-hidden className="size-3.5" />
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SubmissionPending() {
  return (
    <p
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 text-[0.875rem] text-ink-muted"
    >
      <Loader2 aria-hidden className="size-4 animate-spin" />
      Sending your application…
    </p>
  );
}

