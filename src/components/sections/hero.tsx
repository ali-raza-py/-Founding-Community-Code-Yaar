import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Section, SectionInner } from "@/components/ui/section";
import { cn } from "@/lib/utils";

import { AnimatedHeroBackground } from "./animated-hero-background";
import styles from "./hero.module.css";

const actionClassName =
  "h-auto min-h-11 rounded-lg px-4 py-2.5 text-center text-sm font-semibold focus-visible:ring-offset-canvas sm:min-h-12 sm:px-5 sm:text-base";

export function FoundingHero() {
  return (
<<<<<<< HEAD
    <Section aria-labelledby="founding-hero-title">
      <AnimatedHeroBackground />
      <SectionInner className={styles.content}>
        <div className={styles.intro}>
          <p className={cn("type-label text-ink", styles.ruledLabel)}>
            <span>Code Yaar &mdash; Global Founding Community 2026&ndash;27</span>
          </p>
          <h1 id="founding-hero-title" className={cn("font-sans font-bold", styles.heading)}>
            <span className="block">Build What</span>{" "}
            <span className="block text-emerald">
              Comes Next<span className="text-ink">.</span>
            </span>
          </h1>
          <p className={cn("font-medium text-ink-muted", styles.description)}>
            A global community for people who want to learn, build, contribute
            and shape the future of technology.
          </p>
          <div className="grid w-full max-w-xs gap-3 sm:max-w-[29rem] sm:grid-cols-2">
            <Link
              href="/opportunities"
              className={cn(buttonVariants({ size: "lg" }), actionClassName, styles.action, "gap-2")}
            >
              Explore Opportunities
              <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
            </Link>
            <Link
              href="/cohort"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                actionClassName,
                styles.action,
                "border-line-strong bg-surface shadow-sm",
              )}
            >
              Discover The First 100
            </Link>
          </div>
=======
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden py-20 sm:py-28 lg:py-36"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,var(--color-canvas)_0%,var(--color-surface-raised)_100%)] dark:bg-[linear-gradient(to_bottom,var(--color-canvas)_0%,var(--color-surface)_100%)]" />
      <SectionInner className="text-center">
        <p className="type-label mx-auto mb-6 max-w-[42rem] tracking-widest">
          CODE YAAR &mdash; GLOBAL FOUNDING COMMUNITY 2026&ndash;27
        </p>
        <h1 className="type-display mx-auto mb-8 max-w-[56rem]">
          BUILD WHAT{" "}
          <br className="hidden sm:block" />
          <span className="text-emerald">COMES NEXT.</span>
        </h1>
        <p className="type-lead mx-auto mb-12 max-w-[42rem] lg:mb-16">
          A global community for people who want to learn, build, contribute
          and shape the future of technology.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/apply"
            className={`
              inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3.5 text-base font-medium text-white
              transition-colors hover:bg-emerald-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald
            `}
          >
            Apply to The First 100
          </Link>
          <Link
            href="/cohort"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-8 py-3.5 text-base font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            Discover The First 100
          </Link>
>>>>>>> 016fcdc069fd3796364ea519784a533d0f235f8a
        </div>

        <div className={styles.signoff}>
          <p className={cn("type-label text-ink", styles.ruledLabel)}>
            <span>The next generation of builders.</span>
          </p>
          <p className="type-caption text-ink-muted">
            An early-stage, independent community initiative by Code Yaar.
            Applications open worldwide.
          </p>
        </div>
      </SectionInner>
    </Section>
  );
}
