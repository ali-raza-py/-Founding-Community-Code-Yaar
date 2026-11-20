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
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald",
        variant === "emerald"
          ? "border-emerald bg-emerald text-white focus-visible:ring-emerald"
          : variant === "outline"
            ? "border-line bg-surface text-ink-muted hover:bg-surface-raised"
            : "border-line bg-surface-raised text-ink-muted",
        className,
      )}
      {...props}
    />
  );
}
