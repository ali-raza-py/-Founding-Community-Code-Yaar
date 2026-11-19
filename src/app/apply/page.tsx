import type { Metadata } from "next";
import Link from "next/link";

import { ApplicationForm } from "@/components/apply/application-form";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { CAMPAIGN } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Apply",
  description:
    "Apply for The First 100, Code Yaar's global founding cohort. Five short steps, about ten minutes, no account required.",
  alternates: { canonical: "/apply" },
  openGraph: {
    title: "Apply for The First 100",
    description:
      "Five steps, about ten minutes. Applications are open worldwide and reviewed by the Code Yaar team.",
    url: "/apply",
  },
};

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Applications open · 2026–27"
        title="Apply for The First 100."
        lead="Five short steps and about ten minutes. No account, no payment, and no polished portfolio required — beginners are the point, not an exception."
        aside={
          <div className="rounded-[10px] border border-line-strong bg-[var(--color-surface)] p-6">
            <p className="type-label text-[var(--color-ink-subtle)]">Before you start</p>
            <ul className="mt-4 divide-y divide-line border-t border-line">
              {[
                ["Time needed", "About 10 minutes"],
                ["Who can apply", "Anyone, worldwide"],
                ["Experience", "None required"],
                ["Cost", "No fee is charged"],
                ["Account", "Not required"],
              ].map(([label, value]) => (
                <li
                  key={label}
                  className="flex items-baseline justify-between gap-4 py-2.5"
                >
                  <span className="text-[0.8125rem] text-[var(--color-ink-muted)]">{label}</span>
                  <span className="text-[0.8125rem] font-medium text-[var(--color-ink)]">
                    {value}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.75rem] leading-relaxed text-[var(--color-ink-subtle)]">
              {CAMPAIGN.label}. Submitting an application does not guarantee
              acceptance.
            </p>
          </div>
        }
      />

      <Section bordered={false} containerClassName="max-w-[60rem]">
        <div className="grid gap-10 lg:grid-cols-[1fr_17rem] lg:items-start lg:gap-14">
          <ApplicationForm />

          <aside className="order-first border-l-2 border-emerald-600 pl-5 text-[0.8125rem] leading-relaxed text-ink-muted lg:order-last lg:sticky lg:top-24">
            <p className="type-label text-ink-subtle">How this works</p>
            <div className="mt-4 space-y-4">
              <p>
                Answers are validated as you go, saved as a draft in this
                browser, and sent only when you press submit.
              </p>
              <p>
                We ask for your age range, not your date of birth. We do not ask
                for a phone number, home address or identity documents.
              </p>
              <p>
                Every field marked optional can be left empty. GitHub and
                LinkedIn links are not required, and applicants without them are
                not disadvantaged.
              </p>
              <p>
                <Link
                  href="/privacy"
                  className="border-b [var(--color-emerald-600)]/40 pb-0.5 font-medium text-[var(--color-emerald-600)] hover:border-[var(--color-emerald-600)]"
                >
                  Read the privacy information
                </Link>
              </p>
            </div>
            <div className="mt-6 border-t border-line pt-4">
              <p className="text-[var(--color-ink)]">
                Not sure yet?{" "}
                <Link
                  href="/faq"
                  className="font-medium text-forest-800 underline decoration-line-strong underline-offset-2 hover:decoration-emerald-600"
                >
                  Read the FAQ
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
