"use client";

import { Check } from "lucide-react";

import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { benefits, benefitsCaveat } from "@/lib/content/home";

export function BenefitsSection() {
  return (
    <Section id="benefits" tone="surface">
      <div className="grid gap-12 lg:grid-cols-[0.5fr_1fr] lg:gap-24">
        <div className="lg:sticky lg:top-24 lg:self-start min-w-0">
          <p className="type-label text-emerald-600">What members can expect</p>
          <h2 className="type-h2 mt-4">Realistic benefits, stated plainly.</h2>
          <p className="mt-5 max-w-[34rem] text-[0.9375rem] leading-relaxed text-ink-muted">
            The founding cohort is early, so these are opportunities rather than
            guaranteed services. We would rather understate them than have
            members arrive expecting something that does not exist.
          </p>
        </div>

        <ul className="grid gap-4 lg:grid-cols-12 lg:gap-6">
          {benefits.map((benefit, index) => (
            <li
              key={benefit.title}
              className={cn(
                "border border-line-strong rounded-[12px] bg-surface p-6",
                index === 0 ? "lg:col-span-6 lg:row-span-2" : "lg:col-span-4",
              )}
            >
              <div className="flex items-center gap-3">
                <Check
                  aria-hidden
                  className="size-5 shrink-0 text-emerald-600 stroke-[1.5px]"
                />
                <p className="type-label tabular-nums text-ink-subtle">
                  {String(index + 1).padStart(2, "0")}
                </p>
              </div>
              <h3 className="mt-4 type-h3 text-ink">{benefit.title}</h3>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-muted">
                {benefit.detail}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-[52rem] border-l-2 border-danger/50 pl-4 text-[0.8125rem] leading-relaxed text-ink-muted">
          <span className="font-medium text-ink">What we do not promise. </span>
          {benefitsCaveat}
        </p>
      </div>
    </Section>
  );
}
