"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface SplitRevealProps {
  children: React.ReactNode;
  mode?: "line" | "word";
  className?: string;
}

/**
 * Masked slide-up reveal. Splits a string by lines (or words) and reveals
 * each part with a staggered translate-up once the container enters the
 * viewport. Full text stays in the DOM; each reveal span is aria-hidden.
 */
export function SplitReveal({
  children,
  mode = "line",
  className,
}: SplitRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const reduced = useReducedMotion();
  const visible = reduced || inView;

  const items =
    typeof children === "string"
      ? mode === "word"
        ? children.split(/\s+/).filter(Boolean)
        : children.split(/\n+/).filter(Boolean)
      : [children];

  return (
    <span
      ref={ref}
      data-visible={visible ? true : undefined}
      className={cn("reveal-wrap", className)}
    >
      {items.map((item, index) => (
        <span key={index} className="reveal-outer">
          <span
            className="reveal-inner"
            style={{
              transitionDelay: `${index * 70}ms`,
            }}
          >
            {item}
          </span>
        </span>
      ))}
    </span>
  );
}

export interface CharRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  duration?: number;
}

/**
 * Per-character masked slide-up. Used for the hero wordmark entrance.
 */
export function CharReveal({
  children,
  className,
  stagger = 35,
  duration = 700,
}: CharRevealProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  const reduced = useReducedMotion();

  const chars = String(children ?? "").split("");

  return (
    <span
      data-char-visible={visible || reduced ? true : undefined}
      className={cn("char-reveal", className)}
      aria-hidden
    >
      {chars.map((char, index) => {
        const isSpace = char === " ";
        return (
          <span
            key={index}
            className="char-reveal-char"
            style={{
              transitionDelay: `${index * stagger}ms`,
              transitionDuration: `${duration}ms`,
            }}
          >
            {isSpace ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
}

export interface GhostMarqueeProps {
  text: string;
  repeats?: number;
  direction?: "ltr" | "rtl";
  speed?: number; // seconds per loop
  y?: number; // fixed vertical offset in px
  parallaxY?: number; // multiplied by --hero-p (px)
  className?: string;
}

/**
 * Outline-stroke repeated text row that drifts across the viewport.
 * Pauses off-screen and when the tab is hidden.
 */
export function GhostMarquee({
  text,
  repeats = 3,
  direction = "ltr",
  speed = 120,
  y,
  parallaxY,
  className,
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
  if (y !== undefined) yParts.push(`${y}px`);
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
          yParts.length > 0
            ? `translate3d(0, ${yParts.join(" + ")})`
            : undefined,
      }}
    >
      <span aria-hidden>{repeated}</span>
    </div>
  );
}
