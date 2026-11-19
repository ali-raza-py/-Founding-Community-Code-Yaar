import type { Metadata } from "next";

import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  aboutIntro,
  communityVision,
  founders,
  philosophy,
  teamNote,
  whatIs,
  why,
} from "@/lib/content/about";
import { CAMPAIGN } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "Code Yaar is a practical programming education initiative. Read why the founding community exists, how we think about learning, and who is building it.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Code Yaar",
    description:
      "The purpose behind Code Yaar and its global founding community: practical learning, honest feedback and building together.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Code Yaar"
        title="A practical education initiative, building its community first."
        lead={aboutIntro}
        aside={
          <div className="border-l-2 bg-[var(--color-emerald-600)]/25 pl-5">
            <p className="type-label text-[var(--color-ink-subtle)]">Our philosophy</p>
            <p className="mt-3 font-serif text-[1.75rem] italic leading-tight ">
              {CAMPAIGN.tagline}
            </p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
              {CAMPAIGN.coreMessage}
            </p>
          </div>
        }
      />

      <Section bordered={false}>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading number="01" eyebrow="The organization" title={whatIs.title} />
          <div className="space-y-5 lg:pt-1">
            {whatIs.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-[0.9375rem] leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading number="02" eyebrow="The problem" title={why.title} />
          <div className="space-y-5 lg:pt-1">
            {why.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-[0.9375rem] leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          number="03"
          eyebrow="Our philosophy"
          title="Think. Build. Evolve."
          intro="Three words that decide what we encourage, what we celebrate and what we ask members to do."
        />
        <div className="mt-12 grid gap-px border-y border-line bg-line md:grid-cols-3">
          {philosophy.map((item, index) => (
            <div key={item.title} className="bg-canvas p-6 lg:p-8">
              <p className="type-label tabular-nums text-emerald-600">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-serif text-[1.75rem] leading-none text-forest-900">
                {item.title}
              </h3>
              <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-muted">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            number="04"
            eyebrow="Founding vision"
            title="Why Code Yaar is establishing its first founding community."
          />
          <div className="space-y-5 lg:pt-1">
            Code Yaar is building a learning and developer ecosystem where ambitious
            students and developers can come together. The founding community exists
            to test practical activities, gather feedback, and establish the norms that
            later members will inherit. It is deliberately small: not a beta test with
            fixed deliverables, but a genuine early participant program where everyone
            helps shape the culture and direction of what Code Yaar becomes.
          </div>
        </div>
      </Section>

      <Section id="team">
        <SectionHeading
          number="05"
          eyebrow="Founding team"
          title="The people building Code Yaar."
          intro="Small team, clearly defined responsibilities. Biographies will be added when the founders supply them."
        />
        <ul className="mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-3">
          {founders.map((person) => (
            <li key={person.name} className="flex flex-col">
              <div
                aria-hidden
                className="grid size-16 place-items-center rounded-[6px] border border-line-strong bg-surface font-serif text-[1.375rem] text-forest-700"
              >
                {person.initials}
              </div>
              <h3 className="mt-5 text-[1.0625rem] font-semibold text-ink">
                {person.name}
              </h3>
              <p className="mt-1 text-[0.875rem] font-medium text-emerald-600">
                {person.role}
              </p>
              <p className="mt-3 max-w-[16rem] text-[0.875rem] leading-relaxed text-ink-muted">
                {person.focus}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[52rem] border-t border-line pt-5 text-[0.75rem] leading-relaxed text-ink-subtle">
          {teamNote}
        </p>
      </Section>

      <FinalCtaSection
        title="The community starts with a hundred people."
        body="If you want to learn by building, and to help shape a more practical kind of programming education, apply for the founding cohort."
      />
    </>
  );
}
