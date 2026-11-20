"use client";

export interface GradientSweepProps {
  className?: string;
  delay?: number;
}

/**
 * Single diagonal light sweep across a heading, played once after reveal.
 * Parent element must establish `position: relative`. aria-hidden.
 */
export function GradientSweep({
  className,
  delay = 0,
}: GradientSweepProps) {
  return (
    <span
      aria-hidden
      className={className}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
