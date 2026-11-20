"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface WordCycleProps {
  words: readonly string[];
  className?: string;
  intervalMs?: number;
}

/**
 * Cycles through the real loop words with a vertical swap, 2.4s per word,
 * pausing on hover/focus. The first word is rendered server-side.
 */
export function WordCycle({
  words,
  className,
  intervalMs = 2400,
}: WordCycleProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start the word cycle after mount. The first word was already rendered
  // server-side, so the first client render matches the server output.
  useEffect(() => {
    if (reduced || words.length <= 1) return;

    const next = () => {
      if (pausedRef.current) {
        timerRef.current = setTimeout(next, 200);
        return;
      }
      setIndex((i) => (i + 1) % words.length);
      timerRef.current = setTimeout(next, intervalMs);
    };
    timerRef.current = setTimeout(next, intervalMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reduced, words.length, intervalMs]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  if (reduced || words.length === 0) {
    return (
      <span
        aria-label={words.join(", ")}
        className={cn("word-cycle", className)}
      >
        {words[0]}
      </span>
    );
  }

  return (
    <span
      aria-label={words.join(", ")}
      className={cn("word-cycle", className)}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      tabIndex={0}
      style={{ display: "inline-block" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          style={{ display: "inline-block" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
