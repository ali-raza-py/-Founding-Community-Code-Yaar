"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Scroll driver for the homepage hero.
 *
 * Writes one CSS custom property (`--hero-p`, 0 → 1) on the stage instead of
 * setting React state, so scrolling never re-renders the hero. All movement is
 * then expressed in CSS as transforms/opacity, which the compositor can handle.
 * With `prefers-reduced-motion: reduce` no listener is attached and the
 * progress stays at its static default.
 */
export function HeroStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const apply = () => {
      frame = 0;
      const height = stage.getBoundingClientRect().height;
      if (!height) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / (height * 0.9)));
      stage.style.setProperty("--hero-p", progress.toFixed(3));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(apply);
    };

    const listen = () => {
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate, { passive: true });
    };

    const unlisten = () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };

    const sync = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      unlisten();

      if (reduceMotion.matches) {
        stage.style.removeProperty("--hero-p");
        return;
      }

      apply();
      listen();
    };

    sync();
    reduceMotion.addEventListener("change", sync);

    return () => {
      reduceMotion.removeEventListener("change", sync);
      unlisten();
      if (frame) window.cancelAnimationFrame(frame);
      stage.style.removeProperty("--hero-p");
    };
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {children}
    </div>
  );
}
