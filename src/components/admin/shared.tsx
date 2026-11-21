"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { label: string; value: number; positive: boolean };
}

export function StatCard({ title, value, subtitle, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="type-label">{title}</p>
          <p className="text-2xl font-semibold text-ink">{value}</p>
          {subtitle && <p className="type-caption mt-1 text-ink-muted">{subtitle}</p>}
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "text-[0.75rem] font-medium rounded-md px-2 py-1",
                trend.positive
                  ? "text-emerald bg-emerald-soft"
                  : "text-ink-muted bg-surface-raised",
              )}
            >
              {trend.label} {trend.value > 0 ? "+" : ""}{trend.value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

export function AdminStatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, "emerald" | "default" | "outline"> = {
    pending: "default",
    under_review: "default",
    shortlisted: "default",
    accepted: "emerald",
    rejected: "default",
    waitlisted: "default",
    active: "emerald",
    inactive: "default",
    suspended: "default",
    graduated: "outline",
  };

  const variant = variants[status] ?? "default";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm",
        variant === "emerald"
          ? "border-emerald bg-emerald text-white"
          : variant === "outline"
            ? "border-line bg-surface text-ink-muted"
            : "border-line bg-surface-raised text-ink-muted",
      )}
    >
      {status
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")}
    </span>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-line bg-surface p-12 sm:p-16 text-center">
      <p className="type-body-lg text-ink-muted">{title}</p>
      {description && (
        <p className="type-caption mt-2 text-ink-subtle">{description}</p>
      )}
      {action && (
        <div className="mt-6 flex justify-center">
          <a
            href={action.href}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            {action.label}
            <span className="size-3.5">→</span>
          </a>
        </div>
      )}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-line bg-surface p-6 text-center">
      <p className="type-body text-danger">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
        >
          <span className="size-3.5">↻</span> Retry
        </button>
      )}
    </div>
  );
}

interface LoadingStateProps {}
export function LoadingState({}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="type-body text-ink-muted">Loading…</p>
    </div>
  );
}
