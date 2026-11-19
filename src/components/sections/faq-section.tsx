"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { Container } from "@/components/ui/container";

const FAQS = [
  {
    q: "What is the Code Yaar Founding Cohort?",
    a:
      "The Founding Cohort is the first generation of the Code Yaar community — a selective group of learners, students, and engineers who come together across 2026–27 to learn, build, and help shape the community from the ground up.",
  },
  {
    q: "Who can apply?",
    a:
      "Anyone worldwide. There is no experience requirement — beginners are welcome. We ask about your background so we can understand who we&apos;re reaching, not to exclude anyone.",
  },
  {
    q: "Is it free?",
    a:
      "Yes. There is no fee to apply or to participate in the Founding Cohort.",
  },
  {
    q: "Do I need previous coding experience?",
    a:
      "No. Writing &ldquo;None yet&rdquo; is a complete answer. The cohort is designed for people at all levels, including those just starting out.",
  },
  {
    q: "Can international students apply?",
    a:
      "Yes. Applications are open worldwide. The cohort is remote and asynchronous-first, so location is not a barrier.",
  },
  {
    q: "What will founding members do?",
    a:
      "Founding members learn together, build projects, share ideas, give feedback on the community experience, and help shape what Code Yaar becomes for future members.",
  },
  {
    q: "How will applications be reviewed?",
    a:
      "Applications are reviewed by the Code Yaar team. We look for honest, specific answers about why you want to join and what you would contribute — not polished portfolios or prior achievements.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="border-b border-border/50 last:border-0"
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-6 text-left text-sm font-medium text-foreground hover:text-emerald-500 transition-colors"
        aria-expanded={open}
      >
        <span>{q}</span>
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="overflow-hidden pb-4 text-[0.875rem] leading-relaxed text-foreground/70"
      >
        <p>{a}</p>
      </motion.div>
    </motion.div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="bg-canvas text-canvas py-20 border-b border-border">
      <Container className="mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="type-h2 mb-4">Frequently Asked Questions.</h2>
          <p className="type-lead max-w-[48rem] mx-auto">
            Everything you need to know about applying and joining the Founding
            Cohort.
          </p>
        </div>

        <div className="max-w-[600px] mx-auto space-y-0">
          {FAQS.map((faq, idx) => (
            <FAQItem key={idx} q={faq.q} a={faq.a} />
          ))}
        </div>
      </Container>
    </section>
  );
}
