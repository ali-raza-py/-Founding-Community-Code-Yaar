"use client";

import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CAMPAIGN } from "@/lib/constants";
import { DotGrid } from "@/components/motion/dot-grid";
import { GhostMarquee } from "@/components/motion/text";
import { MascotCharacter } from "@/components/hero/MascotCharacter";

export function FinalCtaSection({
  title = "The beginning is a hundred people.",
  body = CAMPAIGN.tagline,
  ctaLabel = "Apply for the Founding Cohort",
  ctaHref = "/apply",
}: {
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
} = {}) {
  return (
    <section
      className="relative overflow-hidden border-t border-line bg-surface-raised text-ink py-24"
    >
      <DotGrid className="absolute inset-0 opacity-20 pointer-events-none" />
      <Container>
        <div className="text-center">
          <GhostMarquee
            text="The First 100"
            repeats={4}
            direction="ltr"
            speed={100}
            className="mx-auto mb-8"
            style={{
              fontSize: "clamp(2rem, 8vw, 3.5rem)",
            }}
          />
          <h2 className="type-display mb-6 max-w-[44rem] mx-auto">{title}</h2>
          <p className="type-lead mt-0 max-w-[42rem] mx-auto">{body}</p>
          <div className="mt-12 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:justify-center">
            <ButtonLink
              href={ctaHref}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {ctaLabel}
              <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </div>
          <p className="mt-8 max-w-[42rem] text-small text-ink-subtle mx-auto">
            Applications are open worldwide. Submitting an application does not
            guarantee acceptance.
          </p>
        </div>

        <MascotCharacter
          color="emerald"
          size={44}
          state="idle"
          trackPointer
          lookAround={0.4}
          className="absolute bottom-4 right-4 z-10"
          style={{ transform: "rotate(-10deg)" }}
        />
      </Container>
    </section>
  );
}
