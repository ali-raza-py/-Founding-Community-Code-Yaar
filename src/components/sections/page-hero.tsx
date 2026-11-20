"use client";

import type { ReactNode } from "react";

import { SplitReveal } from "@/components/motion/text";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  lead,
  aside,
  className,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-line", className)}>
      <Container>
        <div className="grid gap-10 py-16 md:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-24 lg:py-28">
          <div className="min-w-0">
            <p className="type-label flex items-center gap-3 text-emerald-600">
              <span aria-hidden className="h-px w-8 bg-emerald-600/40" />
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-none">
              <SplitReveal className="type-display block">{title}</SplitReveal>
            </h1>
            <p className="type-lead mt-6 max-w-[42rem]">{lead}</p>
          </div>
          {aside && <div className="lg:pb-2">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}
