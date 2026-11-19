import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";

import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cohortIntro } from "@/lib/content/home";

export function CohortSection() {
  return (
    <Section id="the-first-100">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <SectionHeading
            number="03"
            eyebrow={cohortIntro.eyebrow}
            title={cohortIntro.title}
          />
          <div className="mt-6 space-y-4">
            {cohortIntro.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-[34rem] text-[0.9375rem] leading-relaxed text-ink-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <Link
            href="/cohort"
            className="mt-7 inline-flex items-center gap-2 border-b bg-[var(--color-emerald-600)]/40 pb-0.5 text-[0.875rem] font-medium text-[var(--color-emerald-600)] transition-colors hover:bg-[var(--color-emerald-600)]/20 hover:text-[var(--color-emerald-400)]"
          >
            Read the full cohort details
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        <div className="rounded-[10px] border border-line-strong bg-surface p-6 sm:p-8">
          <h3 className="type-label text-ink-subtle">What founding members are</h3>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {cohortIntro.points.map((point) => (
              <li key={point} className="flex gap-3 py-3.5">
                <span
                  aria-hidden
                  className="mt-[0.55em] block size-1.5 shrink-0 rounded-full bg-emerald-600"
                />
                <span className="text-[0.9375rem] leading-relaxed text-[var(--color-ink)]">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-3 rounded-[6px] bg-surface-muted p-4">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-forest-700" />
            <p className="text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
              {cohortIntro.earlyStage}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
