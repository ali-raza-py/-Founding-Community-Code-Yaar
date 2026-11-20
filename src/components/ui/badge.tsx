import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "type-label inline-flex items-center rounded-[4px] px-2 py-1",
        tone === "accent"
          ? "bg-emerald-100 text-emerald-900"
          : "bg-surface text-ink-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
