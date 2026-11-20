"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChar(): string {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

function initialScramble(text: string): string {
  return text.split("").map(() => randomChar()).join("");
}

export interface ScrambleProps {
  children: string;
  className?: string;
  duration?: number;
}

/**
 * Mono label that resolves from random glyphs to its final text over 600ms
 * on first view. Eyebrows only — never body text.
 */
export function Scramble({
  children,
  className,
  duration = 600,
}: ScrambleProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(0);
  const [display, setDisplay] = useState(
    reduced ? children : initialScramble(children),
  );
  const [done, setDone] = useState(reduced);

  useEffect(() => {
    if (reduced || !inView || done) {
      return;
    }

    startRef.current = performance.now();
    const n = children.length;

    const loop = () => {
      const elapsed = performance.now() - startRef.current;
      const solved = Math.floor((elapsed / duration) * n);
      let out = "";
      for (let i = 0; i < n; i += 1) {
        out += i < solved ? children[i] : randomChar();
      }
      setDisplay(out);
      if (elapsed >= duration) {
        setDone(true);
        setDisplay(children);
        return;
      }
      frameRef.current = setTimeout(loop, 16);
    };

    loop();

    return () => {
      if (frameRef.current) {
        clearTimeout(frameRef.current);
      }
    };
  }, [children, duration, inView, reduced, done]);

  return (
    <span
      ref={ref}
      aria-label={done ? undefined : children}
      className={cn("font-mono", className)}
    >
      {display}
    </span>
  );
}
