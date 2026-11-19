import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * Decorative first-screen backdrop: ambient wash, technical grid, scrolling
 * code/character streams, and subtle light traces. Everything is CSS-driven
 * and aria-hidden so the hero copy stays the only thing assistive tech and
 * search engines read.
 */

const symbols = "{ } < > / \\ * + = # ; 0 1";

const bandA = Array.from({ length: 14 }, () => `${symbols}   =>   [ ]`).join(
  "   ",
);
const bandB = Array.from(
  { length: 12 },
  () => "0 1  #  const  { }  =>  async  < >  =  +  *",
).join("    ");
const bandC = Array.from(
  { length: 14 },
  () => "fn ( )  { }  ;  0 1  #  <>  //  =",
).join("   ");

function Stream({
  text,
  direction = "left",
  duration,
  className,
}: {
  text: string;
  direction?: "left" | "right";
  duration: string;
  className?: string;
}) {
  return (
    <div className={cn("hero-stream-mask", className)} aria-hidden>
      <div
        className="hero-stream"
        data-direction={direction}
        style={{ "--hero-duration": duration } as CSSProperties}
      >
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

export function HeroAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Ambient wash */}
      <div
        className="hero-fade absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 18% 0%, rgba(20,154,99,0.2), transparent 58%), radial-gradient(80% 70% at 92% 16%, rgba(21,120,110,0.18), transparent 62%), radial-gradient(120% 100% at 55% 118%, rgba(6,58,42,0.75), transparent 62%)",
        }}
      />

      {/* Technical grid */}
      <div className="hero-grid" />

      {/* Character streams */}
      <Stream
        text={bandA}
        duration="155s"
        className="top-[15%] text-[10px] tracking-[0.55em] text-emerald-300/20 sm:text-[11px]"
      />
      <Stream
        text={bandB}
        direction="right"
        duration="210s"
        className="top-[49%] hidden text-[11px] tracking-[0.4em] text-canvas/10 md:block"
      />
      <Stream
        text={bandC}
        duration="125s"
        className="top-[84%] hidden text-[10px] tracking-[0.6em] text-emerald-300/15 sm:block"
      />

      {/* Horizontal data lines */}
      <div
        className="hero-trace absolute inset-x-0 top-[23%] h-px bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent"
        style={{ "--hero-delay": "-3s" } as CSSProperties}
      />
      <div
        className="hero-trace absolute inset-x-0 top-[44%] h-px bg-gradient-to-r from-transparent via-canvas/10 to-transparent"
        style={{ "--hero-delay": "-8s" } as CSSProperties}
      />
      <div
        className="hero-trace absolute inset-x-0 top-[68%] h-px bg-gradient-to-r from-transparent via-emerald-300/10 to-transparent"
        style={{ "--hero-delay": "-5.5s" } as CSSProperties}
      />
      <div
        className="hero-trace absolute inset-x-0 top-[91%] h-px bg-gradient-to-r from-transparent via-canvas/10 to-transparent"
        style={{ "--hero-delay": "-11s" } as CSSProperties}
      />

      {/* Negative space behind the headline */}
      <div className="hero-scrim absolute inset-0" />
    </div>
  );
}
