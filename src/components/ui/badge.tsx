import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "emerald";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        variant === "emerald"
          ? "border-[#087a52] bg-[#087a52] text-white focus-visible:ring-[#087a52]"
          : variant === "outline"
            ? "border-[#e8ece8] bg-[#ffffff] text-[#46534a] hover:bg-[#f2f5f3]"
            : "border-[#e8ece8] bg-[#f2f5f3] text-[#46534a]",
        className,
      )}
      {...props}
    />
  );
}
