import type { Metadata } from "next";

import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  cohortIntro,
  definition,
  expectations,
  globalParticipation,
  process,
  whoShouldApply,
} from "@/lib/content/cohort";

export const metadata: Metadata = {
  title: "The First 100",
  description:
    "What the Code Yaar Global Founding Cohort is, who should apply, what members are expected to contribute, and how the selection process works.",
  alternates: { canonical: "/cohort" },
  openGraph: {
    title: "The First 100 — Global Founding Cohort 2026–27",
    description:
      "A global founding cohort of learners and aspiring developers helping shape Code Yaar. Applications are open worldwide.",
    url: "/cohort",
  },
};

export default function CohortPage() {
  return (
    <>
      <PageHero
        eyebrow="The First 100 · 2026–27"
        title="A hundred places. A community being built from the beginning."
        lead={cohortIntro}
        aside={
          <div className="rounded-[10px] border border-line-strong bg-surface p-6">
            <p className="type-label text-ink-subtle">At a glance</p>
            <dl className="mt-4 divide-y border-y border-line">
              <div className="flex items-baseline justify-between gap-4 py-2.5 border-t border-line">
                <dt className="text-[0.8125rem] text-ink-muted">Cohort size</dt>
                <dd className="text-[0.8125rem] font-medium text-ink">
                  100 founding members
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5 border-t border-line">
                <dt className="text-[0.8125rem] text-ink-muted">Location</dt>
                <dd className="text-[0.8125rem] font-medium text-ink">
                  Remote, worldwide
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5 border-t border-line">
                <dt className="text-[0.8125rem] text-ink-muted">Format</dt>
                <dd className="text-[0.8125rem] font-medium text-ink">
                  Async-first
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5 border-t border-line">
                <dt className="text-[0.8125rem] text-ink-muted">Experience needed</dt>
                <dd className="text-[0.8125rem] font-medium text-ink">
                  None required
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5 border-t border-line">
                <dt className="text-[0.8125rem] text-ink-muted">Fee</dt>
                <dd className="text-[0.8125rem] font-medium text-ink">
                  No fee is being charged
                </dd>
              </div>
            </dl>
          </div>
        }
      />

      <Section bordered={false}>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <SectionHeading number="01" eyebrow="Definition" title={definition.title} />
          <div className="space-y-5 lg:pt-1">
            {definition.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[0.9375rem] leading-relaxed text-ink-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionHeading number="02" eyebrow="Eligibility" title={whoShouldApply.title} />
            <ul className="mt-7 divide-y border-y border-line">
              {whoShouldApply.items.map((item) => (
                <li key={item} className="flex gap-3 py-3 border-t border-line">
                  <span
                    aria-hidden
                    className="mt-[0.55em] block size-1.5 shrink-0 rounded-full bg-emerald-600/20"
                  />
                  <span className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.875rem] font-medium leading-relaxed text-emerald-400">
              {whoShouldApply.note}
            </p>
          </div>

          <div>
            <SectionHeading number="03" eyebrow="Commitment" title={expectations.title} />
            <ul className="mt-7 divide-y border-y border-line">
              {expectations.items.map((item) => (
                <li key={item} className="flex gap-3 py-3 border-t border-line">
                  <span
                    aria-hidden
                    className="mt-[0.55em] block size-1.5 shrink-0 rounded-full bg-emerald-600/20"
                  />
                  <span className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.875rem] font-medium leading-relaxed text-emerald-400">
              {expectations.note}
            </p>
          </div>
        </div>
      </Section>

      <Section id="process">
        <SectionHeading
          number="04"
          eyebrow="Process"
          title={process.title}
          intro="Four stages, clearly stated. The review timeline is not published yet, because we have not measured our capacity to meet one."
        />

        <ol className="mt-12 grid gap-px border-y border-line bg-line md:grid-cols-4">
          {process.steps.map((step, index) => (
            <li key={step.title} className="bg-canvas p-6">
              <p className="type-label tabular-nums text-emerald-600/25">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="type-h3 mt-4 text-ink">{step.title}</h3>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-muted">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-6 max-w-[52rem] border-l-2 border-danger/50 pl-4 text-[0.875rem] leading-relaxed text-ink">
          {process.caveat}
        </p>
      </Section>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <SectionHeading
            number="05"
            eyebrow="Participation"
            title={globalParticipation.title}
          />
          <div className="space-y-5 lg:pt-1">
            {globalParticipation.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[0.9375rem] leading-relaxed text-ink-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <FinalCtaSection
        title="If this sounds like the group you have been looking for."
        body="Applications take about ten minutes. You do not need a portfolio, a GitHub account, or an impressive résumé — just a clear reason to join."
        ctaLabel="Start your application"
      />
    </>
  );
}
