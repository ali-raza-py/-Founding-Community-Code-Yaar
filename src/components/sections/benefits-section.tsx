import { Check } from "lucide-react";

import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { benefits, benefitsCaveat } from "@/lib/content/home";

export function BenefitsSection() {
  return (
    <Section id="benefits" tone="surface">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
        <SectionHeading
          number="04"
          eyebrow="What members can expect"
          title="Realistic benefits, stated plainly."
        />
        <p className="max-w-[34rem] text-[0.9375rem] leading-relaxed text-ink-muted lg:pb-2">
          The founding cohort is early, so these are opportunities rather than
          guaranteed services. We would rather understate them than have members
          arrive expecting something that does not exist.
        </p>
      </div>

      <ul className="mt-12 grid gap-px border-y border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <li key={benefit.title} className="bg-surface p-6 lg:p-7">
            <Check aria-hidden className="size-4 text-[var(--color-emerald-600)]" />
            <h3 className="mt-4 text-[1rem] font-medium leading-snug text-[var(--color-ink)]">
              {benefit.title}
            </h3>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-[var(--color-ink-muted)]">
              {benefit.detail}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-[52rem] border-l-2 border-danger/50 pl-4 text-[0.8125rem] leading-relaxed text-ink-muted">
        <span className="font-medium text-ink">What we do not promise. </span>
        {benefitsCaveat}
      </p>
    </Section>
  );
}
