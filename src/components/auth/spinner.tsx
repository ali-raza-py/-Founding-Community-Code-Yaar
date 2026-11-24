"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md";
}

/**
 * Lightweight animated loading spinner. Respects
 * prefers-reduced-motion by holding still when motion is reduced.
 */
export function Spinner({ className, size = "sm" }: SpinnerProps) {
  const prefersReduced = useReducedMotion();
  const dims = size === "md" ? "size-5" : "size-4";
  const strokeDash = size === "md" ? "56 56" : "40 40";

  return (
    <motion.svg
      className={cn("shrink-0", dims, className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      animate={prefersReduced ? {} : { rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <circle
        className="text-current"
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray={strokeDash}
        strokeDashoffset="0"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
