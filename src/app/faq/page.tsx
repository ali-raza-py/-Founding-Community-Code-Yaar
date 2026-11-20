import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { Accordion } from "@/components/ui/accordion";
import { Section } from "@/components/ui/section";
import { faqs, faqNote } from "@/lib/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about The First 100: eligibility, time commitment, selection, certificates, time zones, and what membership does and does not promise.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "The First 100 — Frequently asked questions",
    description:
      "Honest answers about the Code Yaar founding cohort: who can apply, how selection works, and what is still being confirmed.",
    url: "/faq",
  },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Frequently asked questions"
        title="Straight answers, including the uncomfortable ones."
        lead="If a policy is not decided yet, we say so. That is more useful than an answer we would have to withdraw later."
      />

      <Section bordered={false}>
        <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-24">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="type-label text-ink-subtle">{faqs.length} questions</p>
            <h2 className="type-h2 mt-4 max-w-[18rem]">
              Still unsure whether you should apply?
            </h2>
            <p className="mt-5 max-w-[18rem] text-[0.875rem] leading-relaxed text-ink-muted">
              Read the cohort page first. If the answer is not there, the honest
              answer is probably that we have not confirmed it yet.
            </p>
          </div>

          <div>
            <Accordion items={faqs} defaultOpenId="what-is" />
            <p className="mt-8 max-w-[56ch] text-[0.8125rem] leading-relaxed text-ink-subtle">
              {faqNote}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
