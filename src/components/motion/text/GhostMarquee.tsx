"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface GhostMarqueeProps {
  text: string;
  repeats?: number;
  direction?: "ltr" | "rtl";
  speed?: number; // seconds per loop
  y?: string | number; // vertical offset (CSS value, defaults to px)
  parallaxY?: number; // multiplied by --hero-p (px)
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Outline-stroke repeated text row that drifts across the viewport.
 * Pauses off-screen (IntersectionObserver) and when the tab is hidden.
 */
export function GhostMarquee({
  text,
  repeats = 3,
  direction = "ltr",
  speed = 120,
  y,
  parallaxY,
  className,
  style,
}: GhostMarqueeProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const update = (visible: boolean) => {
      el.style.animationPlayState = visible ? "running" : "paused";
    };

    const observer = new IntersectionObserver(
      (entries) => {
        update(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0 },
    );
    observer.observe(el);

    const onVisibilityChange = () => {
      update(document.visibilityState !== "hidden");
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [reduced]);

  const repeated = Array.from({ length: repeats }).fill(text).join("   ");
  const yParts: string[] = [];
  if (y !== undefined) yParts.push(typeof y === "string" ? y : `${y}px`);
  if (parallaxY !== undefined) yParts.push(`calc(var(--hero-p, 0) * ${parallaxY}px)`);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "ghost-marquee",
        direction === "rtl" ? "ghost-marquee--rtl" : undefined,
        className,
      )}
      style={{
        animationDuration: `${speed}s`,
        transform:
          yParts.length > 0 ? `translate3d(0, ${yParts.join(" + ")})` : undefined,
        ...style,
      }}
    >
      <span aria-hidden>{repeated}</span>
    </div>
  );
}
