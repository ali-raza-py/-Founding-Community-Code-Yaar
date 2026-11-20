"use client";

import { Section } from "@/components/ui/section";
import { SplitReveal, OutlineToFill } from "@/components/motion/text";
import { mission } from "@/lib/content/home";

export function MissionSection() {
  const { eyebrow, title, paragraphs } = mission;

  return (
    <Section id="mission">
      <div className="grid gap-12 lg:grid-cols-[0.5fr_1fr] lg:gap-24">
        <div className="lg:sticky lg:top-24 lg:self-start min-w-0">
          <p className="type-label text-emerald-600">{eyebrow}</p>
          <SplitReveal className="type-h2 mt-4 mb-6 block">
            {title}
          </SplitReveal>
          <OutlineToFill className="mt-4 mb-8 block leading-snug">
            We believe learning should move through six steps — and that most of
            them need other people.
          </OutlineToFill>
          <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
            {paragraphs[0]}
          </p>
        </div>
        <div className="space-y-6">
          {paragraphs.slice(1).map((paragraph, index) => (
            <p
              key={index}
              className="text-[0.9375rem] leading-relaxed text-ink-muted"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
