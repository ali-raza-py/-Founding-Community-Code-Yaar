import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "emerald";
  status?: "success" | "pending" | "rejected" | "suspended" | "in_progress" | "completed";
}

export function Badge({
  className,
  variant = "default",
  status,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald",
        status === "success"
          ? "border-emerald bg-emerald text-white"
          : status === "pending"
            ? "border-line bg-surface-raised text-ink-muted"
            : status === "rejected"
              ? "border-danger bg-danger-soft text-danger"
              : status === "suspended"
                ? "border-line bg-surface text-ink-muted"
                : status === "in_progress"
                  ? "border-emerald bg-emerald-soft text-emerald"
                  : status === "completed"
                    ? "border-emerald bg-emerald text-white"
                    : variant === "emerald"
                      ? "border-emerald bg-emerald text-white"
                      : variant === "outline"
                        ? "border-line bg-surface text-ink-muted hover:bg-surface-raised"
                        : "border-line bg-surface-raised text-ink-muted",
        className,
      )}
      {...props}
    />
  );
}
