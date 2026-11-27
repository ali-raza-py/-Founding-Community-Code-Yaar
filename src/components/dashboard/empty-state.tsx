"use client";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; href: string; onClick?: () => void };
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-line bg-surface p-10 sm:p-16 text-center">
      {icon && (
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-lg bg-surface-raised p-3 text-ink-secondary">{icon}</div>
        </div>
      )}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && (
        <p className="type-caption mt-2 text-ink-secondary">{description}</p>
      )}
      {action && (
        <div className="mt-6 flex justify-center">
          {action.onClick ? (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              {action.label}
              <span className="size-3.5">→</span>
            </button>
          ) : (
            <a
              href={action.href}
              className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              {action.label}
              <span className="size-3.5">→</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
