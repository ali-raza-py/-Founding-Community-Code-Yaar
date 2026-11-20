"use client";

import { useCallback, useState } from "react";

import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { principles } from "@/lib/content/home";

export function PrinciplesSection() {
  const [highlighted, setHighlighted] = useState<number | null>(null);

  const enter = useCallback((index: number) => setHighlighted(index), []);
  const leave = useCallback(() => setHighlighted(null), []);

  return (
    <Section id="principles">
      <div className="grid gap-12 lg:grid-cols-[0.5fr_1fr] lg:gap-24">
        <div className="lg:sticky lg:top-24 lg:self-start min-w-0">
          <p className="type-label text-emerald-600">Community principles</p>
          <h2 className="type-h2 mt-4">Five standards we hold each other to.</h2>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-muted">
            These are not slogans. They are the questions we ask when it is
            unclear what the right thing to do is.
          </p>
        </div>

        <ol className="grid gap-8 lg:grid-cols-3">
          {principles.map((principle, index) => {
            const active = highlighted === index;
            return (
              <li
                key={principle.title}
                className="relative border border-line-strong rounded-[12px] p-8 transition-colors duration-200 group"
                onMouseEnter={() => enter(index)}
                onMouseLeave={leave}
                onFocus={() => enter(index)}
                onBlur={leave}
              >
                <div
                  aria-hidden
                  className={cn(
                    "absolute inset-0 rounded-[12px] pointer-events-none opacity-0 transition-opacity duration-300 group-focus-within:opacity-100",
                    active
                      ? "opacity-100"
                      : "opacity-0",
                    "bg-[radial-gradient(650px_at_50%_50%,rgba(16,185,129,0.10),transparent_50%)]",
                  )}
                />
                <p
                  aria-hidden
                  className="font-mono font-bold text-[2.25rem] leading-none text-emerald-600/20 tabular-nums"
                >
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="type-h3 mt-4 text-ink">{principle.title}</h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-muted">
                  {principle.detail}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
