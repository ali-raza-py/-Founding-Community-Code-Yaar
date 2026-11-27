"use client";

import { X } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  submitLabel?: string;
  onSubmit?: () => void;
  submitting?: boolean;
  error?: string;
  variant?: "default" | "danger";
  cancelLabel?: string;
  showCloseButton?: boolean;
  /** Replaces the default dialog actions with an explicit footer. */
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  submitLabel,
  onSubmit,
  submitting = false,
  error,
  variant = "default",
  cancelLabel = "Cancel",
  showCloseButton = true,
  footer,
  children,
}: DialogProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
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
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-lg"
      >
        <div className="flex items-start justify-between p-6 sm:p-8">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-ink-muted hover:bg-surface-raised transition-colors"
              aria-label="Close"
            >
              <X className="size-5 shrink-0" />
            </button>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto border-t border-line p-6 sm:p-8 space-y-4">
          {error && (
            <div className="rounded-md border border-danger-soft bg-danger-soft p-3">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}
          {children}
        </div>
        {footer ? (
          <div className="shrink-0 border-t border-line bg-surface p-4 sm:px-8">
            {footer}
          </div>
        ) : (
          <div className="flex shrink-0 justify-end gap-2 border-t border-line/50 bg-surface p-4 sm:px-8">
            <Button
              type="button"
              onClick={onClose}
              className="text-sm text-ink-muted hover:bg-surface-raised"
            >
              {cancelLabel}
            </Button>
            {onSubmit && (
              <Button
                onClick={onSubmit}
                disabled={submitting}
                className={`text-sm font-medium transition-colors ${
                  variant === "danger"
                    ? "text-danger border border-danger hover:bg-danger-soft"
                    : "bg-emerald text-white hover:bg-emerald-hover"
                }`}
              >
                {submitting ? "Working…" : submitLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
