"use client";

import { motion, type TargetAndTransition, useReducedMotion } from "framer-motion";
import { Code, Layers, Play, Users, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

const NODES = [
  { icon: Users, x: 180, y: 300, label: "Community" },
  { icon: Code, x: 560, y: 220, label: "Technology" },
  { icon: Layers, x: 820, y: 520, label: "Building" },
  { icon: Play, x: 380, y: 720, label: "Learning" },
  { icon: Wifi, x: 720, y: 380, label: "Collaboration" },
] as const;

interface BrandVisualProps {
  className?: string;
}

/**
 * Premium abstract brand composition for authentication pages.
 *
 * A lightweight node-and-connection network representing community,
 * technology, learning and collaboration, with soft ambient glows. No
 * heavy image assets: everything is drawn with SVG and CSS, and all motion
 * is disabled when the user prefers reduced motion.
 */
export function BrandVisual({ className }: BrandVisualProps) {
  const prefersReduced = useReducedMotion();
  const float: TargetAndTransition = {
    y: [0, -8, 0],
    transition: { duration: 7, repeat: Infinity, ease: "linear" },
  };

  return (
    <div className={cn("relative w-full aspect-[10/7] max-h-[40rem] isolate", className)}>
      {/* Subtle technical dot grid */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-ink-subtle) 0.6px, transparent 0.6px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Ambient glows */}
      <motion.div
        className="auth-glow absolute top-0 left-0 w-[34rem] h-[34rem] -translate-x-1/3 -translate-y-1/3 opacity-60"
        animate={prefersReduced ? undefined : float}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      />
      <motion.div
        className="auth-glow absolute bottom-0 right-0 w-[26rem] h-[26rem] translate-x-1/4 translate-y-1/5 opacity-50"
        animate={prefersReduced ? undefined : { ...float, transition: { duration: 12, repeat: Infinity, ease: "linear", delay: 3 } }}
        aria-hidden="true"
      />

      {/* Node-and-connection network */}
      <svg
        className="absolute inset-0 w-full h-full block"
        viewBox="0 0 1000 700"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="var(--color-line)" strokeWidth="1.5" opacity="0.45">
          <line x1="180" y1="300" x2="560" y2="220" />
          <line x1="560" y1="220" x2="820" y2="520" />
          <line x1="820" y1="520" x2="380" y2="720" />
          <line x1="380" y1="720" x2="180" y2="300" />
          <line x1="560" y1="220" x2="720" y2="380" />
          <line x1="380" y1="720" x2="720" y2="380" />
        </g>
        <g fill="var(--color-emerald)" opacity="0.9">
          <circle cx="180" cy="300" r="5" />
          <circle cx="560" cy="220" r="5" />
          <circle cx="820" cy="520" r="5" />
          <circle cx="380" cy="720" r="5" />
          <circle cx="720" cy="380" r="5" />
        </g>
      </svg>

      {/* Icons sitting on the network nodes */}
      <div className="absolute inset-0 pointer-events-none">
        {NODES.map(({ icon: Icon, x, y }) => (
          <motion.span
            key={x + "," + y}
            className="absolute size-6 text-ink"
            style={{ left: `${x / 10}%`, top: `${y / 10}%` }}
            animate={prefersReduced ? {} : { scale: [1, 1.12, 1] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
              delay: (Math.sin(x) * 2) % 4,
            }}
          >
            <Icon className="size-5" aria-hidden="true" />
          </motion.span>
        ))}
      </div>
    </div>
  );
}
