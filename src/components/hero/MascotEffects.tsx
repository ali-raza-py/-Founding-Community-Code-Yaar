/**
 * MascotEffects.tsx
 *
 * Ported from OpenMausBot (Apache-2.0):
 * https://github.com/milind-soni/OpenMausBot
 * src/components/CursorAvatar.tsx (confetti, trails, glyphs)
 * src/styles.css (specular sweep, orbit turn, burst piece keyframes)
 *
 * Standalone visual effects for mascot characters: specular light sweeps,
 * orbiting dot trails, and confetti bursts. Used sparingly in the hero
 * composition to add dimensionality without continuous DOM churn.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TAU = Math.PI * 2;

const hash01 = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const CONFETTI_COLORS = ["#F472B6", "#C084FC", "#818CF8", "#38BDF8", "#34D399", "#FACC15", "#FB7185"];
const RIBBON_COLORS = ["#4ADE80", "#34D399", "#22D3EE", "#60A5FA"];

export interface SpecularHighlightProps {
  cx: number;
  cy: number;
  rx?: number;
  ry?: number;
  color?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

export function SpecularHighlight({
  cx,
  cy,
  rx = 34,
  ry = 14,
  color = "#ffffff",
  duration = 760,
  delay = 0,
  className,
}: SpecularHighlightProps) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={color}
      fillOpacity={0.3}
      className={cn("maus-specular", className)}
      style={{ animation: `maus-specular-sweep ${duration}ms ease-out both`, animationDelay: `${delay}ms` }}
      aria-hidden
    />
  );
}

export interface OrbitDotsProps {
  cx: number;
  cy: number;
  radius?: number;
  count?: number;
  color?: string;
  period?: number;
  className?: string;
}

export function OrbitDots({
  cx,
  cy,
  radius = 48,
  count = 3,
  color = "#0e7a4f",
  period = 3200,
  className,
}: OrbitDotsProps) {
  return (
    <g className={cn("maus-orbit", className)} aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const seedA = hash01(i + 3);
        const seedB = hash01(i + 29);
        const direction = i % 2 === 0 ? 1 : -1;
        const dotRadius = radius * (0.78 + seedB * 0.4);
        const start = direction * seedA * TAU;
        const span = 0.85 + seedB * 0.7;
        const strokeWidth = 5 + seedA * 3;

        // Build a partial arc path
        let d = "";
        const SAMPLES = 12;
        for (let s = 0; s <= SAMPLES; s++) {
          const k = s / SAMPLES;
          const angle = start + span * k;
          const r = dotRadius * (1 + Math.sin(k * Math.PI) * 0.14);
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r * 0.78;
          d += (s === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
        }

        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={RIBBON_COLORS[i % RIBBON_COLORS.length]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={0.85}
            className="maus-orbit-trail"
            style={{
              animation: `maus-working-orbit ${period}ms linear infinite`,
              animationDelay: `${i * 400}ms`,
              transformOrigin: `${cx}px ${cy}px`,
            }}
          />
        );
      })}
    </g>
  );
}

export interface ConfettiBurstProps {
  cx: number;
  cy: number;
  count?: number;
  period?: number;
  life?: number;
  origin?: number;
  spread?: number;
  active?: boolean;
  className?: string;
}

export function ConfettiBurst({
  cx,
  cy,
  count = 12,
  period = 1500,
  life = 1300,
  origin = 74,
  spread = 54,
  active = true,
  className,
}: ConfettiBurstProps) {
  const [paths, setPaths] = useState<{ x: number; y: number; ex: number; ey: number; stroke: string; sw: number; opacity: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    startRef.current = performance.now();
    const loop = () => {
      const now = performance.now();
      const elapsed = now - startRef.current;
      const items: { x: number; y: number; ex: number; ey: number; stroke: string; sw: number; opacity: number }[] = [];

      for (let i = 0; i < count; i++) {
        const seedA = hash01(i + 1);
        const seedB = hash01(i + 41);
        const seedC = hash01(i + 91);

        const t = (((elapsed + seedC * period) % period) / life);
        if (t > 1) continue;

        const angle = seedA * TAU;
        const travel = spread * (0.45 + seedB * 0.55) * (1 - (1 - t) * (1 - t));
        const distance = (origin + travel);
        const gravity = 34 * t * t;
        const x = cx + Math.cos(angle) * distance;
        const y = cy + Math.sin(angle) * distance + gravity;
        const length = 11 + seedB * 12;
        const spin = angle + (seedC - 0.5) * 5 * t;
        const ex = x + Math.cos(spin) * length;
        const ey = y + Math.sin(spin) * length;
        const bend = (seedA - 0.5) * length * 0.7;
        const mx = (x + ex) / 2 - Math.sin(spin) * bend;
        const my = (y + ey) / 2 + Math.cos(spin) * bend;

        const opacity = t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88;

        items.push({
          x: Math.round(x * 10) / 10,
          y: Math.round(y * 10) / 10,
          ex: Math.round(ex * 10) / 10,
          ey: Math.round(ey * 10) / 10,
          stroke: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          sw: Math.round((4 + seedB * 2.4) * 10) / 10,
          opacity: Math.round(opacity * 1000) / 1000,
        });
      }

      setPaths(items);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, count, period, life, origin, spread, cx, cy]);

  if (!active) return null;

  return (
    <g className={cn("maus-fx--burst", className)} aria-hidden>
      {paths.map((p, i) => (
        <path
          key={i}
          d={`M${p.x} ${p.y} Q${Math.round((p.x + p.ex) / 2 * 10) / 10} ${Math.round((p.y + p.ey) / 2 * 10) / 10} ${p.ex} ${p.ey}`}
          fill="none"
          stroke={p.stroke}
          strokeWidth={p.sw}
          strokeLinecap="round"
          opacity={Math.max(0, Math.min(1, p.opacity))}
          style={{ animation: `maus-burst-piece ${period}ms ease-out both` }}
        />
      ))}
    </g>
  );
}
