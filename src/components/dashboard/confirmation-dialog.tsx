"use client";

import { X } from "lucide-react";
import { useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
  variant?: "default" | "danger";
  className?: string;
}

export function ConfirmationDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  loading = false,
  variant = "default",
  className,
}: ConfirmationDialogProps) {
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
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-surface shadow-lg flex flex-col",
          className,
        )}
      >
        <div className="flex items-start justify-between p-6 sm:p-8">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-ink-muted hover:bg-surface-raised transition-colors"
            aria-label="Close"
          >
            <X className="size-5 shrink-0" />
          </button>
        </div>
        <div className="border-t border-line p-6 sm:p-8 space-y-4">
          <p className="type-body text-ink-secondary">{description}</p>
          <div className="flex justify-end gap-2 pt-4 border-t border-line/50">
            <Button
              type="button"
              onClick={onClose}
              className="text-sm text-ink-muted hover:bg-surface-raised"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className={`text-sm font-medium transition-colors ${
                variant === "danger"
                  ? "text-danger border border-danger hover:bg-danger-soft"
                  : "bg-emerald text-white hover:bg-emerald-hover"
              }`}
            >
              {loading ? "Working…" : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
