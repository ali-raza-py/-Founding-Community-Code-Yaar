"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  side?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  children: React.ReactNode;
}

export function Tooltip({
  content,
  side = "top",
  delayMs = 150,
  children,
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = React.useId();

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(true), delayMs);
  };

  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  };

  const sideStyles: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
    left: "right-full top-1/2 -translate-y-1/2 -mr-1.5",
    right: "left-full top-1/2 -translate-y-1/2 -ml-1.5",
  };

  const arrowStyles: Record<string, string> = {
    top: "top-full left-1/2 -translate-x-1/2 -mb-px",
    bottom: "-top-px left-1/2 -translate-x-1/2",
    left: "-right-px top-1/2 -translate-y-1/2",
    right: "-left-px top-1/2 -translate-y-1/2",
  };

  const isChild = React.isValidElement(children);
  const child = isChild ? (children as React.ReactElement) : null;

  return (
    <span
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {child &&
        React.cloneElement(child as React.ReactElement<any>, {
          "aria-label": content,
          "aria-describedby": visible ? tooltipId : undefined,
        })}
      {!isChild && children}
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            "z-50 inline-block absolute px-2 py-1.5 rounded-md border border-line bg-ink text-white text-[0.75rem] font-medium leading-none shadow-sm opacity-0 transition-opacity duration-150",
            visible && "opacity-100",
            sideStyles[side],
          )}
          data-side={side}
        >
          {content}
          <span
            className={cn(
              "absolute border-line bg-ink pointer-events-none",
              arrowStyles[side],
            )}
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  );
}
