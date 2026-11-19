"use client";

import { motion, type Variants } from "framer-motion";

import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CAMPAIGN } from "@/lib/constants";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
};

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden border-b border-border bg-canvas text-canvas min-h-[85vh] flex flex-col"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="mx-auto flex flex-1 flex-col items-center justify-center px-6 pt-20 pb-12 text-center"
      >
        <motion.p
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="type-label flex items-center justify-center gap-3 text-emerald-500/90"
        >
          <span
            aria-hidden
            className="h-px w-6 bg-emerald-500/40 sm:w-10"
          />
          {CAMPAIGN.program}
          <span
            aria-hidden
            className="h-px w-6 bg-emerald-500/40 sm:w-10"
          />
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="type-display mt-4 tracking-tight text-emerald-400"
        >
          Be Part of What Comes Next.
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="mt-6 max-w-[52rem] type-lead mx-auto"
        >
          Join the first generation of builders shaping the future of Code Yaar.
          Learn together, build together, and help create a better learning
          experience for the next generation of developers.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <ButtonLink
            href="/apply"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            Apply Now
            <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink
            href="#why-join"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto border-border text-foreground hover:bg-surface"
          >
            Explore the Cohort
          </ButtonLink>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="mt-8 flex items-center justify-center gap-3 text-[0.8125rem] text-foreground/60"
        >
          <span aria-hidden className="h-[1px] w-6 bg-border" />
          <span>Applications open worldwide — 2026–27</span>
          <span aria-hidden className="h-[1px] w-6 bg-border" />
        </motion.div>
      </motion.div>
    </section>
  );
}
