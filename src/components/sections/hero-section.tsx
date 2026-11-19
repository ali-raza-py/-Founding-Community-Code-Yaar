import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { HeroAtmosphere } from "@/components/sections/hero-atmosphere";
import { HeroStage } from "@/components/sections/hero-stage";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CAMPAIGN } from "@/lib/constants";
import { cn } from "@/lib/utils";

const dossierRows = [
  { label: "Format", value: "Remote, asynchronous-first" },
  { label: "Language", value: "English" },
  { label: "Eligibility", value: "Open worldwide" },
  { label: "Status", value: "Applications open" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-canvas/10 bg-canvas text-canvas">
      <HeroAtmosphere />

      <HeroStage>
        <Container className="hero-stage-content relative z-10 flex min-h-[calc(100svh-4rem)] flex-col pb-10 pt-14 md:pb-12 md:pt-20">
          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <p className="type-label flex items-center gap-3 text-emerald-300/90">
              <span aria-hidden className="h-px w-6 bg-emerald-300/40 sm:w-10" />
              {CAMPAIGN.program}
              <span aria-hidden className="h-px w-6 bg-emerald-300/40 sm:w-10" />
            </p>

            <div className="relative mt-8 w-full md:mt-9 hero-float">
              {/* Outlined headline behind solid headline */}
              <span aria-hidden className="hero-outline-layer">
                <span className="hero-headline hero-outline">
                  <span className="block text-stroke">The First</span>
                  <span className="block text-stroke">100</span>
                </span>
              </span>

              {/* Solid foreground headline */}
              <h1 className="hero-headline relative text-emerald-300 block hero-text-lift">
                <span className="block">The First</span>
                <span className="block">100</span>
              </h1>

              {/* Semantic label below */}
              <p className="mt-6 max-w-[42rem] text-[1rem] leading-relaxed text-canvas/75 sm:text-[1.0625rem] hero-text-lift">
                Join the first generation of builders shaping Code Yaar — a global
                community of learners, developers and future innovators.
              </p>
            </div>

            <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <ButtonLink
                href="/apply"
                variant="inverse"
                size="lg"
                className="w-full sm:w-auto"
              >
                Apply for the Founding Cohort
                <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
              <ButtonLink
                href="/cohort"
                variant="secondary"
                size="lg"
                className="w-full border-canvas/25 text-canvas hover:border-canvas/60 hover:bg-canvas/10 sm:w-auto"
              >
                Explore the Community
              </ButtonLink>
            </div>

            <p className="mt-7 max-w-[36rem] text-[0.8125rem] leading-relaxed text-canvas/65">
              Applications are open worldwide. The founding cohort is being
              assembled now — this is the beginning of the community, not an
              established network.
            </p>
          </div>

          <div className="mx-auto mt-8 w-full max-w-[880px] border-t border-canvas/15 pt-5">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-left sm:grid-cols-4">
              {dossierRows.map((row) => (
                <div key={row.label}>
                  <dt className="type-label text-canvas/55">{row.label}</dt>
                  <dd className="mt-1 text-[0.8125rem] leading-snug text-canvas/85">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-center font-serif text-[0.875rem] italic text-canvas/60">
              {CAMPAIGN.coreMessage}
            </p>
          </div>
        </Container>
      </HeroStage>
    </section>
  );
}