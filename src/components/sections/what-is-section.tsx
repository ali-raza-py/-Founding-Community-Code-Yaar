"use client";

import { motion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/container";

const FEATURES = [
  {
    title: "Build Together",
    description:
      "Collaborate with early members and contribute ideas that shape how the community learns and grows.",
  },
  {
    title: "Grow Together",
    description:
      "Develop practical skills, share knowledge, and learn alongside other builders at every level.",
  },
  {
    title: "Shape the Future",
    description:
      "Help influence the community experience, its direction, and what it becomes for the next generation.",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 18, stiffness: 120 },
  },
};

const staggerChildren = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

export function WhatIsSection() {
  return (
    <section id="overview" className="bg-canvas text-canvas py-20 border-b border-border">
      <Container className="mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="text-center"
        >
          <h2 className="type-h2 mb-4">Help Build the Next Generation of Learning.</h2>
          <p className="type-lead max-w-[48rem] mx-auto">
            The Founding Cohort is your opportunity to become an early member of
            the Code Yaar community — a space where learners, students, and
            engineers grow together across 2026–27.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="mt-16 grid gap-8 sm:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -6 }}
              variants={cardVariants}
              className="rounded-[10px] border border-border bg-surface p-8 hover:bg-surface/50 transition-colors duration-200"
            >
              <h3 className="type-h3 mb-3 text-foreground">{feature.title}</h3>
              <p className="text-[0.875rem] leading-relaxed text-foreground/70">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

export function WhyJoinSection() {
  const BENEFITS = [
    {
      title: "Early community access",
      description:
        "Join before the community opens broadly and help set its tone from day one.",
    },
    {
      title: "Direct feedback channel",
      description:
        "Share your thoughts with the Code Yaar team and see them reflected in community decisions.",
    },
    {
      title: "Collaborate with builders",
      description:
        "Work alongside other developers and learners who are at the same stage as you.",
    },
    {
      title: "Learning and project-building",
      description:
        "Practical, hands-on opportunities to build and ship alongside the cohort.",
    },
    {
      title: "Recognition as a founding member",
      description:
        "Be acknowledged as part of the first generation of the Code Yaar community.",
    },
    {
      title: "Community initiatives",
      description:
        "Contribute to projects and initiatives that shape the community’s direction.",
    },
  ];

  return (
    <section id="why-join" className="bg-surface text-canvas py-20">
      <Container className="mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="text-center"
        >
          <h2 className="type-h2 mb-4">Why Join the Founding Cohort.</h2>
          <p className="type-lead max-w-[48rem] mx-auto">
            Being a founding member means more than early access. It means
            helping build something from the ground up — with people who care
            about the same things you do.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="mt-16 grid gap-6 sm:grid-cols-3"
        >
          {BENEFITS.map((benefit) => (
            <motion.div
              key={benefit.title}
              whileHover={{ scale: 1.02 }}
              variants={cardVariants}
              className="rounded-[10px] border border-border p-8 flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-[8px] bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <span aria-hidden>◆</span>
              </div>
              <h3 className="type-h3 text-foreground">{benefit.title}</h3>
              <p className="text-[0.875rem] leading-relaxed text-foreground/70 flex-1">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
