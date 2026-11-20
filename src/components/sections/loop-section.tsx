"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMotionValue, useTransform, motion, useReducedMotion } from "framer-motion";

import { Section } from "@/components/ui/section";
import { WordCycle } from "@/components/motion/text";
import { cn } from "@/lib/utils";
import { mission } from "@/lib/content/home";

const STEPS = mission.loop;
const STEP_COUNT = STEPS.length;
const VIEW_SIZE = 400;
const CENTRE = VIEW_SIZE / 2;
const ARC_RADIUS = CENTRE - 46;
const NODE_RADIUS = 11;

function pointAt(index: number) {
  const angle = -Math.PI / 2 + (index * (Math.PI * 2)) / STEP_COUNT;
  return {
    x: CENTRE + ARC_RADIUS * Math.cos(angle),
    y: CENTRE + ARC_RADIUS * Math.sin(angle),
  };
}

export function LoopSection() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const [length, setLength] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const path = document.getElementById(
        "loop-arc-0",
      ) as SVGPathElement | null;
      if (path) {
        setLength(path.getTotalLength());
      }
    };

    const el = containerRef.current;
    if (!el) {
      measure();
      return;
    }

    const update = () => {
      const rect = el.getBoundingClientRect();
      const height = window.innerHeight;
      let p = (height - rect.top) / (height + rect.height);
      p = Math.min(1, Math.max(0, p));
      progress.set(p);
    };

    const timer = setTimeout(measure, 0);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    measure();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [progress]);

  const arcs = useMemo(
    () =>
      STEPS.map((_, index) => {
        const from = pointAt(index);
        const to = pointAt((index + 1) % STEP_COUNT);
        const d = `M${from.x.toFixed(2)} ${from.y.toFixed(2)} A${ARC_RADIUS.toFixed(2)} ${ARC_RADIUS.toFixed(2)} 0 0 1 ${to.x.toFixed(2)} ${to.y.toFixed(2)}`;
        return { index, d };
      }),
    [],
  );

  // Unconditional hook call; dasharray is zero until the path length is known.
  const offset = useTransform(progress, [0.15, 0.85], [length ?? 0, 0]);
  const dasharray = reduced || !length ? 9999 : length;

  const isActive = (index: number) =>
    pinnedIndex !== null ? pinnedIndex === index : index === activeIndex;

  const selectStep = useCallback(
    (index: number) => {
      setActiveIndex(index);
      setPinnedIndex(null);
    },
    [],
  );

  const togglePin = useCallback(
    (index: number) => {
      setPinnedIndex((prev) => (prev === index ? null : index));
    },
    [],
  );

  const activeLabel =
    pinnedIndex !== null ? STEPS[pinnedIndex]!.label : STEPS[activeIndex].label;

  return (
    <Section id="loop">
      <div className="grid gap-16 lg:grid-cols-[0.55fr_1fr] lg:gap-24 lg:items-start">
        <div className="lg:sticky lg:top-24 lg:self-start min-w-0">
          <p className="type-label text-emerald-600">The learning loop</p>
          <h2 className="type-h2 mt-4">Six steps, repeated forever.</h2>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-muted">
            Code Yaar is organised around one learning loop: understand it,
            experiment with it, practise it, build with it, share it, and use
            what comes back to improve it.
          </p>
        </div>

        <div className="relative flex flex-col items-center">
          {/* Desktop: interactive diagram */}
          <div className="hidden lg:block">
            <div
              ref={containerRef}
              className="relative w-full max-w-[460px] aspect-square"
              style={{ minHeight: 320 }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
                className="mx-auto"
                aria-label="The six-step learning loop"
              >
                {arcs.map((arc) => {
                  const active =
                    isActive(arc.index) ||
                    isActive((arc.index + 1) % STEP_COUNT);
                  return (
                    <motion.path
                      key={arc.index}
                      id={`loop-arc-${arc.index}`}
                      d={arc.d}
                      fill="none"
                      stroke={
                        active
                          ? "var(--color-emerald-600)"
                          : "var(--color-line-strong)"
                      }
                      strokeWidth={active ? 3 : 1.5}
                      strokeLinecap="round"
                    style={{
                      strokeDasharray: dasharray,
                      strokeDashoffset: reduced ? 0 : offset,
                      opacity: active ? 1 : 0.5,
                    }}
                    />
                  );
                })}
              </svg>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative flex flex-col items-center justify-center text-center">
                  <p className="type-label tabular-nums text-ink-subtle">
                    {String((pinnedIndex ?? activeIndex) + 1).padStart(2, "0")}
                  </p>
                  <div className="mt-2 min-w-[9rem]">
                    {pinnedIndex !== null ? (
                      <span className="type-h3 text-emerald-600">
                        {activeLabel}
                      </span>
                    ) : (
                      <WordCycle words={STEPS.map((step) => step.label)} />
                    )}
                  </div>
                </div>
              </div>

              {STEPS.map((step, index) => {
                const { x, y } = pointAt(index);
                const active = isActive(index);
                return (
                  <button
                    key={step.label}
                    type="button"
                    aria-label={`${step.label}. ${step.detail}`}
                    aria-pressed={active}
                    onClick={() => selectStep(index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        togglePin(index);
                      }
                    }}
                    onMouseEnter={() => {
                      if (pinnedIndex === null) setActiveIndex(index);
                    }}
                    onMouseLeave={() => {
                      if (pinnedIndex === null) setActiveIndex(0);
                    }}
                    className="rounded-full p-1.5 transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                    style={{
                      left: `${x - NODE_RADIUS - 4}px`,
                      top: `${y - NODE_RADIUS - 4}px`,
                    }}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full border text-[0.75rem] font-mono font-medium tabular-nums",
                        active
                          ? "border-emerald-600 bg-emerald-600 text-canvas"
                          : "border-line-strong bg-surface text-ink-subtle",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile: vertical stepper */}
          <div className="lg:hidden w-full max-w-[30rem]">
            {STEPS.map((step, index) => {
              const expanded = activeIndex === index;
              return (
                <div key={step.label} className="mb-10 last:mb-0">
                  <button
                    type="button"
                    onClick={() => selectStep(index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        togglePin(index);
                      }
                    }}
                    className="flex w-full items-center justify-between gap-3 py-1.5 text-left"
                  >
                    <div className="flex items-baseline gap-3">
                      <p className="type-label tabular-nums text-ink-subtle">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className={cn("type-h3", pinnedIndex === index ? "text-emerald-600" : "text-ink")}>
                        {step.label}
                      </h3>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 border rounded-full p-[2px] text-[0.75rem] font-mono font-medium tabular-nums transition-colors",
                        pinnedIndex === index
                          ? "border-emerald-600 bg-emerald-600 text-canvas"
                          : "border-line-strong bg-surface text-ink-subtle",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                  {expanded && pinnedIndex === null && (
                    <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-muted pl-9">
                      {step.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden lg:ml-16 lg:sticky lg:top-24 lg:max-w-[32rem]">
            {STEPS.map((step, index) => {
              const active = isActive(index);
              return (
                <div key={step.label} className="pb-10 last:pb-0">
                  <p className="type-label tabular-nums text-ink-subtle">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className={cn(
                      "mt-1 type-h3",
                      active ? "text-emerald-600" : "text-ink",
                    )}
                  >
                    {step.label}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 text-[0.875rem] leading-relaxed",
                      active ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    {step.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
