"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthAlertProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Inline form error / status alert. Uses semantic tokens so it stays
 * readable in light and dark mode.
 */
export function AuthAlert({ children, className }: AuthAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "inline-flex items-center gap-3 rounded-lg border border-danger/30 bg-danger-soft p-3 text-danger text-sm leading-relaxed",
        className,
      )}
    >
      <AlertCircle className="size-5 shrink-0" />
      {children}
    </div>
  );
}
