"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { SectionInner } from "@/components/ui/section";

export function FoundingHero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let rafId: number;
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        const el = heroRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        // Progress from -1 (top of hero at bottom of viewport) to 1 (bottom of hero at top of viewport)
        const progress = Math.max(-1, Math.min(1, (viewHeight - rect.top) / (rect.height + viewHeight) * 2 - 1));
        setScrollProgress((progress + 1) / 2);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const translateY = scrollProgress * 40;
  const opacity = 1 - scrollProgress * 0.5;

  return (
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
            href="/opportunities"
            className={`
              inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3.5 text-base font-medium text-white
              transition-colors hover:bg-emerald-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald
            `}
          >
            Explore Opportunities
          </Link>
          <Link
            href="/cohort"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-8 py-3.5 text-base font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            Discover The First 100
          </Link>
        </div>

        <div className="mt-16 relative">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[1px] h-[200px] bg-line/50"
            aria-hidden
          />
          <p
            className="relative inline-block type-label text-emerald tracking-widest mb-0"
            style={{
              transform: `translateY(${translateY}px)`,
              opacity,
              transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
            }}
          >
            THE NEXT GENERATION OF BUILDERS.
          </p>
        </div>
        <p className="mt-12 type-caption max-w-[42rem] mx-auto">
          An early-stage, independent community initiative by Code Yaar.
          Applications open worldwide.
        </p>
      </SectionInner>
    </section>
  );
}
