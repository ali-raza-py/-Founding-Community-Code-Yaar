/**
 * MascotCharacter.tsx
 *
 * Ported from OpenMausBot (Apache-2.0):
 * https://github.com/milind-soni/OpenMausBot
 * src/components/CursorAvatar.tsx
 * src/components/Avatar.tsx
 * src/components/mascot-motion.ts
 * src/lib/mascot.ts
 *
 * Adapted for Code Yaar's Global Founding Community homepage.
 * Renders an animated SVG mascot with gradient body, expressive eyes,
 * pointer gaze tracking, body motion (bob/sway/pulse/etc.), and specular
 * highlight.
 */

"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";
import {
  bodyTransform,
  type BodyMotion,
  MOTION,
  frameFloorMs,
  nextFrameAt,
  FULL_FRAME_MS,
  FRAME_SLACK_MS,
} from "./hero-motion";

const FACE_BOX = 228.541;
const FACE_CENTRE = FACE_BOX / 2;
const GAZE_TRAVEL_X = 13.2;
const GAZE_TRAVEL_Y = 8.4;
const BLINK_DURATION = 320;

const BLOB_BODY =
  "M198.91052 113.12915C198.30169 121.88191 196.37668 130.37605 193.1355 138.61157C189.89431 146.84709 185.49332 154.4026 179.93252 161.27809C174.37172 168.15358 167.99976 174.1053 160.81663 179.13325C153.6335 184.1612 145.98678 188.22176 137.87645 191.31491C129.76613 194.40806 121.42581 196.55178 112.85548 197.74609C104.28516 198.94039 95.66469 199.12755 86.99407 198.30758C78.32344 197.4876 69.86713 195.54477 61.62513 192.47909C53.38313 189.41341 45.74309 185.20915 38.70501 179.86633C31.66693 174.52351 25.60941 168.25632 20.53243 161.06476C15.45546 153.87319 11.54067 146.15559 8.78808 137.91195C6.03549 129.66831 4.37316 121.28874 3.80109 112.77325C3.22902 104.25775 3.5616 95.83136 4.79882 87.49409C6.03604 79.15682 8.08364 70.99969 10.94163 63.0227C13.79962 55.04571 17.53174 47.38891 22.13799 40.0523C26.74425 32.71568 32.30193 26.0276 38.81103 19.98806C45.32014 13.94852 52.65266 9.00619 60.80862 5.16109C68.96458 1.31599 77.53546 -1.10241 86.52128 -2.09412C95.50709 -3.08583 104.37427 -2.64309 113.12282 -0.76589C121.87137 1.11131 130.09712 4.12751 137.80007 8.28271C145.50302 12.43791 152.53652 17.35515 158.90058 23.03443C165.26463 28.7137 170.969 34.91856 176.01368 41.649C181.05836 48.37944 185.3953 55.56843 189.02451 63.21597C192.65372 70.86352 195.3609 78.90607 197.14605 87.34364C198.93119 95.78121 199.51935 104.37638 198.91052 113.12915Z";

const BLOB_CLIP = BLOB_BODY;

export type MascotColor = "emerald" | "teal" | "blue" | "purple" | "coral" | "orange";

export type MascotState =
  | "idle"
  | "happy"
  | "curious"
  | "thinking"
  | "excited"
  | "surprised"
  | "working"
  | "celebrate";

export type MascotMotion = "none" | "arrive" | "switch" | "celebrate" | "thinking" | "working" | "success";

export interface MascotCharacterProps {
  color: MascotColor;
  state?: MascotState;
  size?: number;
  motion?: MascotMotion;
  gaze?: { x?: number; y?: number };
  lookAround?: number;
  trackPointer?: boolean;
  animated?: boolean;
  className?: string;
}

const COLOR_FILLS: Record<MascotColor, string> = {
  emerald: "#0e7a4f",
  teal: "#01A492",
  blue: "#377FE6",
  purple: "#8057C8",
  coral: "#E5634E",
  orange: "#E78531",
};

function mix(hex: string, toward: string, t: number): string {
  const a = Number.parseInt(hex.slice(1), 16);
  const b = Number.parseInt(toward.slice(1), 16);
  const channel = (shift: number) => {
    const va = (a >> shift) & 0xff;
    const vb = (b >> shift) & 0xff;
    return Math.round(va + (vb - va) * t);
  };
  return `#${[channel(16), channel(8), channel(0)]
    .map((part) => part.toString(16).padStart(2, "0"))
    .join("")}`;
}

function gradientFor(color: MascotColor): [string, string, string] {
  const fill = COLOR_FILLS[color];
  return [mix(fill, "#ffffff", 0.55), fill, mix(fill, "#000000", 0.42)];
}

const EXPRESSIONS: Record<MascotState, { mouth: string; eyes: [number, number][] }> = {
  idle: { mouth: "M 100 134 Q 114 138 128 134", eyes: [[94, 104], [135, 104]] },
  happy: { mouth: "M 95 138 Q 114 148 133 138", eyes: [[92, 100], [136, 100]] },
  curious: { mouth: "M 104 132 Q 114 136 124 132", eyes: [[90, 108], [138, 108]] },
  thinking: { mouth: "M 108 132 Q 114 134 120 132", eyes: [[94, 98], [135, 98]] },
  excited: { mouth: "M 88 142 Q 114 152 140 142", eyes: [[88, 96], [140, 96]] },
  surprised: { mouth: "M 108 124 Q 114 116 120 124", eyes: [[94, 100], [135, 100]] },
  working: { mouth: "M 100 132 Q 114 135 128 132", eyes: [[96, 104], [132, 104]] },
  celebrate: { mouth: "M 90 138 Q 114 150 138 138", eyes: [[90, 98], [138, 98]] },
};

const MOTION_BY_STATE: Record<MascotState, BodyMotion> = {
  idle: { pulse: [0.014, 3600] },
  happy: { bob: [5, 820], squash: 0.28 },
  curious: { sway: [3.4, 1900], tilt: -4 },
  thinking: { sway: [1.6, 3000], pulse: [0.01, 3000] },
  excited: { bob: [9, 520], sway: [3, 1040], squash: 0.35 },
  surprised: { enter: [1.14, 340], jitter: [0.8, 120] },
  working: { bob: [2.5, 900], squash: 0.22 },
  celebrate: { bob: [10, 480], sway: [4, 960], squash: 0.35 },
};

const BLINK_CADENCE: Record<MascotState, [number, number]> = {
  idle: [6000, 14000],
  happy: [2500, 5000],
  curious: [2500, 5500],
  thinking: [3500, 7000],
  excited: [2000, 4000],
  surprised: [1800, 3500],
  working: [2800, 5500],
  celebrate: [2200, 4500],
};

export function MascotCharacter({
  color,
  state = "idle",
  size = 120,
  motion = "none",
  gaze,
  lookAround = 0.35,
  trackPointer = true,
  animated = true,
  className,
}: MascotCharacterProps) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [blinkScale, setBlinkScale] = useState(1);

  const subscribeReduced = (onChange: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
  const getReduced = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  const reducedRef = useRef(reduced);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const eye0Ref = useRef<SVGEllipseElement | null>(null);
  const eye1Ref = useRef<SVGEllipseElement | null>(null);
  const mouthRef = useRef<SVGPathElement | null>(null);
  const bodyGroupRef = useRef<SVGGElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateStartRef = useRef(0);
  const blinkStartRef = useRef<number | null>(null);

  const [light, mid, dark] = gradientFor(color);
  const expression = EXPRESSIONS[state];

  useEffect(() => {
    stateStartRef.current = Date.now();
  }, [state, motion]);

  function startBlinkTimer() {
    if (reduced || !animated) return;
    const cadence = BLINK_CADENCE[state];
    if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    const lo = cadence[0];
    const hi = cadence[1];
    blinkTimerRef.current = setTimeout(() => {
      const delay = lo + Math.random() * (hi - lo);
      blinkTimerRef.current = setTimeout(() => {
        blinkStartRef.current = Date.now();
        blinkTimerRef.current = null;
        startBlinkTimer();
      }, delay);
    }, 0);
  }

  useEffect(() => {
    startBlinkTimer();
    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, [state, animated, reduced]);

  const onPointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (!trackPointer || !animated || reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1)),
      y: Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1)),
    });
  };

  const onPointerLeave = () => {
    if (!trackPointer || !animated || reduced) return;
    setPointer({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!animated || reduced) return;
    const svg = svgRef.current;
    if (!svg) return;

    const frame = () => {
      const now = performance.now();
      const bs = blinkStartRef.current;
      if (bs !== null) {
        const t = (now - bs) / BLINK_DURATION;
        if (t >= 1) {
          blinkStartRef.current = null;
          setBlinkScale(1);
        } else {
          setBlinkScale(Math.max(t < 0.42 ? 1 - t / 0.42 : (t - 0.42) / 0.58, 0.04));
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animated, reduced]);

  useEffect(() => {
    if (!animated || reduced) return;

    const loop = (now: number) => {
      const strength = reduced ? 0 : 1;
      const m = motion !== "none" ? (MOTION[motion] ?? { pulse: [0.014, 3600] }) : MOTION_BY_STATE[state];
      const transform = bodyTransform(m ?? { pulse: [0.014, 3600] }, now - stateStartRef.current, strength);

      const bodyEl = bodyGroupRef.current;
      if (bodyEl) {
        if (transform) bodyEl.setAttribute("transform", transform);
        else bodyEl.removeAttribute("transform");
      }

      const interval = frameFloorMs(size);
      const due = nextFrameAt(now, interval);
      const wait = due - now - FRAME_SLACK_MS;
      if (wait <= FULL_FRAME_MS) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = setTimeout(() => loop(now), wait) as unknown as number;
      }
    };

    loop(performance.now());
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animated, state, motion, size, reduced]);

  const look = lookAround;
  const gx = ((gaze?.x ?? 0) + pointer.x) * GAZE_TRAVEL_X * look;
  const gy = ((gaze?.y ?? 0) + pointer.y) * GAZE_TRAVEL_Y * look;

  const dimension = `${size}px`;

  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0", className)}
      onPointerMove={trackPointer && animated && !reduced ? onPointerMove : undefined}
      onPointerLeave={trackPointer && animated && !reduced ? onPointerLeave : undefined}
      style={{ width: dimension, height: dimension, display: "inline-flex" }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${FACE_BOX} ${FACE_BOX}`}
        width={dimension}
        height={dimension}
        className="block"
        style={{ transformOrigin: "center" }}
      >
        <defs>
          <linearGradient id={`cy-grad-${color}`} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={light} />
            <stop offset="55%" stopColor={mid} />
            <stop offset="100%" stopColor={dark} />
          </linearGradient>
          <clipPath id={`cy-clip-${color}`}>
            <path d={BLOB_CLIP} />
          </clipPath>
        </defs>

        <g ref={bodyGroupRef} style={{ transformOrigin: `${FACE_CENTRE}px ${FACE_CENTRE}px` }}>
          <g clipPath={`url(#cy-clip-${color})`}>
            <path fill={`url(#cy-grad-${color})`} d={BLOB_BODY} />

            <ellipse
              className="maus-specular"
              cx={FACE_CENTRE - 28}
              cy={FACE_CENTRE - 40}
              rx={34}
              ry={14}
              fill="#ffffff"
              fillOpacity={0.35}
            />
          </g>

          <g style={{ transformOrigin: `${FACE_CENTRE}px ${FACE_CENTRE}px` }}>
            <ellipse
              ref={eye0Ref}
              cx={expression.eyes[0][0] + gx}
              cy={expression.eyes[0][1] + gy}
              rx={7}
              ry={9}
              fill="#0b1f17"
              style={{ transform: `scale(1, ${blinkScale})`, transformOrigin: `${expression.eyes[0][0]}px ${expression.eyes[0][1]}px` }}
            />
            <ellipse
              ref={eye1Ref}
              cx={expression.eyes[1][0] + gx}
              cy={expression.eyes[1][1] + gy}
              rx={7}
              ry={9}
              fill="#0b1f17"
              style={{ transform: `scale(1, ${blinkScale})`, transformOrigin: `${expression.eyes[1][0]}px ${expression.eyes[1][1]}px` }}
            />
            <path
              ref={mouthRef}
              d={expression.mouth}
              fill="none"
              stroke="#0b1f17"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </span>
  );
}
