"use client";

import { useEffect, useRef } from "react";

import styles from "./animated-hero-background.module.css";

export function AnimatedHeroBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const background = backgroundRef.current;
    const hero = background?.parentElement;
    if (!background || !hero || navigator.hardwareConcurrency <= 2) return;

    const motion = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (update: fast) and (prefers-reduced-motion: no-preference)",
    );
    let inView = false;
    let active = false;
    let frame = 0;
    let clientX = 0;
    let clientY = 0;

    const resetPointer = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      background.style.removeProperty("--pointer-x");
      background.style.removeProperty("--pointer-y");
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      clientX = event.clientX;
      clientY = event.clientY;
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;
        const x = (clientX / window.innerWidth - 0.5) * 10;
        const y = (clientY / window.innerHeight - 0.5) * 8;
        background.style.setProperty("--pointer-x", `${x.toFixed(2)}px`);
        background.style.setProperty("--pointer-y", `${y.toFixed(2)}px`);
      });
    };

    const syncMotion = () => {
      const shouldAnimate = inView && !document.hidden && motion.matches;
      if (shouldAnimate === active) return;
      active = shouldAnimate;
      background.toggleAttribute("data-motion-active", active);

      if (active) {
        hero.addEventListener("pointermove", onPointerMove, { passive: true });
        hero.addEventListener("pointerleave", resetPointer);
      } else {
        hero.removeEventListener("pointermove", onPointerMove);
        hero.removeEventListener("pointerleave", resetPointer);
        resetPointer();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncMotion();
    });
    const syncPreference = () => {
      if (motion.matches) {
        observer.observe(hero);
      } else {
        observer.unobserve(hero);
        inView = false;
        syncMotion();
      }
    };

    document.addEventListener("visibilitychange", syncMotion);
    motion.addEventListener("change", syncPreference);
    syncPreference();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncMotion);
      motion.removeEventListener("change", syncPreference);
      inView = false;
      syncMotion();
    };
  }, []);

  return (
    <div ref={backgroundRef} className={styles.background} aria-hidden="true">
      <div className={styles.grid} />
      <div className={styles.mesh} />
      <div className={`${styles.wash} ${styles.washLeft}`} />
      <div className={`${styles.wash} ${styles.washRight}`} />
    </div>
  );
}
