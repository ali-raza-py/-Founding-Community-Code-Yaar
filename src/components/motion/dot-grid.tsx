"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * 10x10 grid of hairline-outlined cells. Cells fade in by diagonal distance
 * from the centre; one cell is highlighted in emerald as "your place" and
 * pulses once. Never represents filled application slots.
 */
export function DotGrid({
  className,
  highlightIndex = 44,
}: {
  className?: string;
  highlightIndex?: number;
}) {
  const reduced = useReducedMotion();
  const cells: React.ReactElement[] = [];

  for (let index = 0; index < 100; index += 1) {
    const x = index % 10;
    const y = Math.floor(index / 10);
    const dx = x - 4.5;
    const dy = y - 4.5;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const delay = reduced ? 0 : Math.round(dist * 70);
    const highlighted = index === highlightIndex;

    cells.push(
      <div
        key={index}
        className="dot-cell"
        style={{
          animationDelay: `${delay}ms`,
          opacity: reduced ? 1 : 0,
          animation: reduced
            ? "none"
            : "fade-in 500ms ease both",
          ...(highlighted
            ? {
                backgroundColor: "var(--color-emerald-600)",
                borderColor: "var(--color-emerald-600)",
                animation: reduced
                  ? "none"
                  : "pulse-once 700ms ease both",
              }
            : {}),
        }}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn("grid grid-cols-10 gap-0.5 w-fit shrink-0", className)}>
      {cells}
    </div>
  );
}
