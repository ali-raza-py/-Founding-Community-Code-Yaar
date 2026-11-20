"use client";

import { useRef } from "react";
import {
  useElementScroll,
  useTransform,
  motionValue,
  useReducedMotion,
  motion,
} from "framer-motion";

import { cn } from "@/lib/utils";

export interface OutlineToFillProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Heading that begins stroke-only and fills with solid ink as the section
 * scrolls into view. Scroll-linked via `useElementScroll` / `useTransform`.
 */
export function OutlineToFill({
  children,
  className,
}: OutlineToFillProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useElementScroll(ref);
  const progress = useTransform(
    scrollYProgress,
    [0, 0.35, 1],
    [0, 1, 1],
  );

  const fill = reduced ? motionValue(1) : progress;

  const strokeOpacity = useTransform(fill, [0, 1], [1, 0]);
  const text = String(children);

  return (
    <span
      ref={ref}
      className={cn("outline-to-fill", className)}
      style={{ position: "relative", display: "inline-block" }}
      aria-label={text}
    >
      <motion.span
        aria-hidden
        className="outline-layer"
        style={{
          position: "absolute",
          inset: 0,
          WebkitTextStroke: "1.5px var(--color-ghost-stroke)",
          color: "transparent",
          opacity: strokeOpacity,
        }}
      >
        {text}
      </motion.span>
      <motion.span
        aria-hidden
        className="fill-layer"
        style={{
          position: "absolute",
          inset: 0,
          color: "var(--color-ink)",
          opacity: fill,
        }}
      >
        {text}
      </motion.span>
    </span>
  );
}
