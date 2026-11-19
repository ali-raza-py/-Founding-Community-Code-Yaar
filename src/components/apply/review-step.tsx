"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";

import { CheckboxField } from "@/components/ui/field";
import { REVIEW_GROUPS } from "@/lib/application";
import { CAMPAIGN, PRIVACY_CONSENT_TEXT, labelFor } from "@/lib/constants";
import { IS_SUBMISSION_CONFIGURED } from "@/lib/submission";
import type { ApplicationData } from "@/types/application";

const LOOKUP_FIELDS = [
  "ageRange",
  "educationLevel",
  "experienceLevel",
  "weeklyTime",
] as const;

function displayValue(field: keyof ApplicationData, value: string) {
  if (!value.trim()) return "Not provided";
  if ((LOOKUP_FIELDS as readonly string[]).includes(field)) {
    return labelFor(field as (typeof LOOKUP_FIELDS)[number], value);
  }
  return value;
}

export function ReviewStep({
  values,
  consent,
  consentError,
  onConsentChange,
  onEdit,
}: {
  values: ApplicationData;
  consent: boolean;
  consentError?: string;
  onConsentChange: (checked: boolean) => void;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="space-y-8">
      <p className="max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-muted">
        Check each section before submitting. Your answers are sent once and are
        not stored in this browser after a successful submission.
      </p>

      {!IS_SUBMISSION_CONFIGURED && (
        <div className="rounded-[6px] border border-line-strong bg-surface-muted p-5">
          <p className="text-[0.875rem] font-medium text-ink">
            Live submission is not configured in this build.
          </p>
          <p className="mt-1.5 max-w-[58ch] text-[0.8125rem] leading-relaxed text-ink-muted">
            Nothing will be sent, and no application can be received. Your
            answers stay in this browser as a draft. Submission is disabled
            until a submission endpoint is configured.
          </p>
        </div>
      )}

      <div className="divide-y divide-line border-y border-line">
        {REVIEW_GROUPS.map((group) => (
          <section key={group.step} className="py-6 first:pt-5">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="type-label text-ink-subtle">{group.title}</h3>
              <button
                type="button"
                onClick={() => onEdit(group.step)}
                className="inline-flex items-center gap-1.5 rounded-[4px] text-[0.8125rem] font-medium text-emerald-600 hover:text-emerald-700"
              >
                <Pencil aria-hidden className="size-3.5" />
                Edit
              </button>
            </div>
            <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {group.fields.map((field) => (
                <div key={field.key} className="flex flex-col gap-0.5">
                  <dt className="text-[0.75rem] text-ink-subtle">{field.label}</dt>
                  <dd className="whitespace-pre-line break-words text-[0.875rem] leading-relaxed text-ink">
                    {displayValue(field.key, values[field.key])}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <div className="rounded-[6px] border border-line-strong bg-surface p-5">
        <CheckboxField
          id="privacyConsent"
          checked={consent}
          onChange={(event) => onConsentChange(event.target.checked)}
          error={consentError}
          label={
            <>
              {PRIVACY_CONSENT_TEXT}{" "}
              <Link
                href="/privacy"
                className="underline decoration-line-strong underline-offset-2 hover:decoration-emerald-600"
              >
                Read the privacy information
              </Link>
              .
            </>
          }
        />
      </div>

      <p className="text-[0.75rem] leading-relaxed text-ink-subtle">
        Submitting this form applies to {CAMPAIGN.label}. Membership is not
        guaranteed, and no payment is requested at any point.
      </p>
    </div>
  );
}
