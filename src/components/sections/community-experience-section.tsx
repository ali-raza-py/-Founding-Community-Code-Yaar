"use client";

import { motion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/container";

const STEPS = [
  {
    number: "01",
    title: "Discover",
    description:
      "Explore the Code Yaar ecosystem and see how the community already learns and builds together.",
  },
  {
    number: "02",
    title: "Connect",
    description:
      "Meet other learners and developers who are just as eager to grow and build in public.",
  },
  {
    number: "03",
    title: "Contribute",
    description:
      "Share ideas, ask questions, and participate in community initiatives from day one.",
  },
  {
    number: "04",
    title: "Build",
    description:
      "Collaborate on meaningful projects and ship things that matter to the community.",
  },
  {
    number: "05",
    title: "Grow",
    description:
      "Develop your skills and help the community evolve into something bigger.",
  },
];

const stepVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 18, stiffness: 120 },
  },
};

const staggerChildren = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

export function CommunityExperienceSection() {
  return (
    <section id="community" className="bg-canvas text-canvas py-20 border-b border-border">
      <Container className="mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="text-center"
        >
          <h2 className="type-h2 mb-4">How the Community Works.</h2>
          <p className="type-lead max-w-[48rem] mx-auto">
            The Founding Cohort follows a simple journey — discover, connect,
            contribute, build, and grow — together.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="mt-16 relative grid gap-12 sm:grid-cols-3"
        >
          {STEPS.map((step) => (
            <motion.div
              key={step.number}
              whileHover={{ y: -4 }}
              variants={stepVariants}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-mono font-bold text-sm">
                  {step.number}
                </span>
                <span className="text-sm font-semibold text-foreground/60">
                  Step
                </span>
              </div>
              <h3 className="type-h3 text-foreground">{step.title}</h3>
              <p className="text-[0.875rem] leading-relaxed text-foreground/70">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

export function FoundingIdentitySection() {
  return (
    <section id="benefits" className="bg-surface text-canvas py-20">
      <Container className="mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="text-center"
        >
          <h2 className="type-h2 mb-4">The Beginning of Something Bigger.</h2>
          <p className="type-lead max-w-[48rem] mx-auto">
            The founding generation doesn’t just join a community — they help
            create it. There are no fabricated member counts or partner logos
            here. Just real people, real conversations, and a shared ambition
            to build something better.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="mt-16 flex flex-col items-center justify-center gap-8 sm:flex-row"
        >
          <div
            className="relative w-full max-w-[600px] aspect-square rounded-[16px] border border-border bg-surface overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-500/5 opacity-50" />
            <div className="absolute inset-4 border border-emerald-500/20 rounded-[12px]" />
            <div className="absolute inset-8 border border-emerald-500/10 rounded-[8px]" />
            <div className="absolute inset-12 border border-emerald-500/5 rounded-[4px]" />
          </div>
          <div className="text-center max-w-[32rem]">
            <p className="text-[0.9375rem] leading-relaxed text-foreground/70 italic">
              &ldquo;The best communities aren&rsquo;t joined &mdash; they&rsquo;re built. This is your chance to lay the first stone.&rdquo;
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
