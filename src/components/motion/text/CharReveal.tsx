"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export interface CharRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  duration?: number;
}

/**
 * Per-character masked slide-up. Used for the hero wordmark entrance.
 * Renders every character in the DOM; the wrapper carries the accessible
 * label so assistive tech reads the word once.
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
      className={className}
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
