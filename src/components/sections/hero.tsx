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
