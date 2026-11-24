"use client";

import { useCallback, useEffect, useRef } from "react";
import { type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string | ReactNode;
  confirmLabel?: string;
  loading?: boolean;
  destructive?: boolean;
}

/**
 * Accessible confirmation dialog for sensitive actions (send test email,
 * retry failed email).
 *
 * Manages its own focus restoration and escape key handling. Does not rely on
 * any dialog primitive dependency — kept dependency-free per project policy.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  loading = false,
  destructive = false,
}: ConfirmDialogProps) {
  const previousFocus = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    containerRef.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousFocus.current?.focus({ preventScroll: true });
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-surface shadow-lg",
          destructive ? "border-destructive" : ""
        )}
      >
        <div className="flex items-start justify-between p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            {description && (
              <p className="type-caption text-ink-muted">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-ink-muted hover:bg-surface-raised hover:text-danger transition-colors"
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="border-t border-line p-6 sm:p-8 flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant={destructive ? "primary" : "primary"}
            disabled={loading}
            className={destructive ? "bg-danger text-white hover:bg-danger" : ""}
          >
            {loading ? "Sending…" : confirmLabel}
          </Button>
        </div>
      </div>
    </>
  );
}
