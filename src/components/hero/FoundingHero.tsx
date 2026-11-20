"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { HeroStage } from "@/components/sections/hero-stage";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CAMPAIGN } from "@/lib/constants";
import {
  CharReveal,
  GhostMarquee,
  GradientSweep,
  SplitReveal,
} from "@/components/motion/text";
import { MascotCharacter } from "@/components/hero/MascotCharacter";

const MASCOT_SIZE = 36;

// Positions are percent of the wordmark box. Kept in one tunable array.
const MASCOTS: ReadonlyArray<{
  color: "emerald" | "teal" | "blue" | "coral" | "orange";
  x: number;
  y: number;
  tilt: number;
  ribbon?: boolean;
  excitedOnCta?: boolean;
}> = [
  { color: "emerald", x: 0, y: 0.02, tilt: -12 },
  { color: "teal", x: 0.26, y: 0.62, tilt: 8, excitedOnCta: true },
  { color: "coral", x: 0.5, y: -0.22, tilt: -10 },
  { color: "orange", x: 0.97, y: 0.08, tilt: 14 },
  { color: "blue", x: 1.02, y: 0.02, tilt: -6, ribbon: true },
];

const dossierRows = [
  { label: "Format", value: "Remote, asynchronous-first" },
  { label: "Language", value: "English" },
  { label: "Eligibility", value: "Open worldwide" },
  { label: "Status", value: "Applications open" },
];

const WORD = "The First 100";

function RibbonRing({ size }: { size: number }) {
  const r = size * 0.55;
  return (
    <svg
      width={size}
      height={size}
      className="pointer-events-none"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        animationPlayState: "running",
      }}
    >
      <defs>
        <linearGradient id="cy-ribbon-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="0.5" stopColor="#14b8a6" />
          <stop offset="1%" stopColor="#3dae76" />
        </linearGradient>
      </defs>
        <path
          d={`M ${size / 2} ${size / 2 - r} a ${r} ${r} 0 1 1 0 ${2 * r} a ${r} ${r} 0 1 1 0 ${-2 * r}`}
          fill="none"
          stroke="url(#cy-ribbon-ring)"
          strokeWidth={2}
          className="maus-orbit-trail"
          style={{
            opacity: 0.9,
            transformOrigin: `${size / 2}px ${size / 2}px`,
            animation: "rotate-ring 6000ms linear infinite",
          }}
        />
    </svg>
  );
}

export function FoundingHero() {
  const [ctaHover, setCtaHover] = useState(false);
  const [mascotsArrived, setMascotsArrived] = useState(
    MASCOTS.map(() => false),
  );
  const [pointerOk, setPointerOk] = useState(true);

  // Gaze tracking is pointer-driven; on touch devices fall back to slow
  // idle look-around and keep mascots static otherwise.
  useEffect(() => {
    const timer = setTimeout(() => {
      setPointerOk(window.matchMedia("(pointer: fine)").matches);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Mascots arrive after the wordmark entrance (~700ms + 13*35ms stagger).
  useEffect(() => {
    const timers = MASCOTS.map((_, index) => {
      return setTimeout(
        () => setMascotsArrived((prev) => {
          const next = [...prev];
          next[index] = true;
          return next;
        }),
        1200 + index * 120,
      );
    });
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  const onCtaEnter = useCallback(() => setCtaHover(true), []);
  const onCtaLeave = useCallback(() => setCtaHover(false), []);

  return (
    <section
      className="relative isolate overflow-hidden border-b border-line bg-canvas text-canvas"
      style={{ minHeight: `calc(100svh - 64px)` }}
    >
      <HeroStage>
        {/* Canvas wash */}
        <div aria-hidden className="hero-wash" />

        {/* Ghost rows: one above, one echo behind the wordmark, one below */}
        <GhostMarquee
          text={WORD}
          repeats={2}
          direction="ltr"
          speed={140}
          y={-50}
          parallaxY={-40}
          className="top-[0%] left-0 z-0"
          style={{ opacity: `calc(0.55 + var(--hero-p, 0) * 0.45)` }}
        />
        <GhostMarquee
          text={WORD}
          repeats={3}
          direction="rtl"
          speed={110}
          y={50}
          parallaxY={40}
          className="bottom-[0%] left-0 z-0"
          style={{ opacity: `calc(0.55 + var(--hero-p, 0) * 0.45)` }}
        />

        <Container className="px-5 sm:px-8 lg:px-12">
          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <SplitReveal
              className="type-label flex items-center justify-center gap-3 text-emerald-600/90 mb-6"
            >
              {CAMPAIGN.program}
              <span aria-hidden className="h-px w-6 bg-emerald-600/40 sm:w-10" />
              {CAMPAIGN.program}
              <span aria-hidden className="h-px w-6 bg-emerald-600/40 sm:w-10" />
            </SplitReveal>

            <div
              className="relative z-10 inline-flex flex-col items-center"
              style={{ minWidth: 0 }}
            >
              {/* Echo row behind the solid wordmark, offset horizontally */}
              <GhostMarquee
                text={WORD}
                repeats={2}
                direction="ltr"
                speed={100}
                className="absolute left-[6%] top-1/2 -translate-y-1/2 z-0"
                style={{
                  opacity: `calc(0.45 + var(--hero-p, 0) * 0.55)`,
                }}
              />

                <h1
                  aria-label={WORD}
                  className="mt-2 mb-6 block text-hero-ink hero-lift"
                  style={{
                    fontSize: "clamp(2.5rem, 9vw, 7rem)",
                  }}
                >
                  <span className="block md:hidden type-hero-wordmark leading-[1.05]">
                    <CharReveal className="type-hero-wordmark">The First</CharReveal>
                  </span>
                  <span className="hidden md:block type-hero-wordmark">
                    <CharReveal className="type-hero-wordmark">{WORD}</CharReveal>
                  </span>
                  <span className="block md:hidden type-hero-wordmark leading-[1.05]">
                    <CharReveal className="type-hero-wordmark">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500">
                        100
                      </span>
                    </CharReveal>
                  </span>
                  <span className="hidden md:block">
                    <CharReveal className="type-hero-wordmark">
                      The First{" "}
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500">
                        100
                      </span>
                    </CharReveal>
                  </span>
                </h1>

              <GradientSweep delay={1400} />

              {/* Mascots over the wordmark box */}
              <span
                className="absolute inset-0 pointer-events-none w-full h-full"
                style={{ display: "contents" }}
              >
                {MASCOTS.map((mascot, index) => {
                  const Arrived = mascotsArrived[index];
                  const hideOnTouch = index === 2 || index === 3;
                  return (
                    <motion.span
                      key={mascot.color}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{
                        opacity: Arrived ? 1 : 0,
                        scale: Arrived ? 1 : 0.6,
                      }}
                      transition={{ delay: 0, duration: 300 }}
                      className={`pointer-events-auto${
                        hideOnTouch ? " hidden lg:block" : ""
                      }`}
                      style={{
                        position: "absolute",
                        left: `${mascot.x * 100}%`,
                        top: `${mascot.y * 100}%`,
                        transform: `rotate(${mascot.tilt}deg) translate(-50%, -50%)`,
                        width: "clamp(22px, 4vw, 36px)",
                        height: "clamp(22px, 4vw, 36px)",
                      }}
                    >
                      <MascotCharacter
                        color={mascot.color}
                        size={MASCOT_SIZE}
                        state={
                          ctaHover && mascot.excitedOnCta ? "excited" : "idle"
                        }
                        motion={Arrived ? "arrive" : "none"}
                        trackPointer={pointerOk}
                        lookAround={pointerOk ? 0 : 0.3}
                      />
                      {mascot.ribbon && Arrived && (
                        <RibbonRing size={MASCOT_SIZE} />
                      )}
                    </motion.span>
                  );
                })}
              </span>
            </div>

            <SplitReveal className="mt-6 mb-4 text-[1.375rem] font-display font-800 text-ink tracking-tight leading-tight">
              {CAMPAIGN.tagline}
            </SplitReveal>

            <p className="mt-4 max-w-[38rem] type-lead mx-auto">
              {CAMPAIGN.coreMessage}
            </p>

            <div className="mt-10 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:justify-center">
              <ButtonLink
                href="/apply"
                variant="inverse"
                size="lg"
                onMouseEnter={onCtaEnter}
                onMouseLeave={onCtaLeave}
                className="w-full sm:w-auto"
              >
                Apply for the Founding Cohort
                <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
              <ButtonLink
                href="/cohort"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto border-line-strong hover:bg-surface-raised"
              >
                Explore the Cohort
              </ButtonLink>
            </div>

            <p className="mt-7 max-w-[36rem] text-small text-ink-subtle">
              Applications are open worldwide. The founding cohort is being
              assembled now — this is the beginning of the community, not an
              established network.
            </p>

            <div className="mx-auto mt-10 w-full max-w-[880px] border-t border-line pt-6">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-left sm:grid-cols-4">
                {dossierRows.map((row) => (
                  <div key={row.label}>
                    <dt className="type-label text-ink-subtle">{row.label}</dt>
                    <dd className="mt-1 text-[0.8125rem] leading-snug text-ink/90">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </HeroStage>
    </section>
  );
}
