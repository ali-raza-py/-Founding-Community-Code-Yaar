"use client";

import { cn } from "@/lib/utils";

interface StatisticCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { label: string; value: number; positive: boolean };
}

export function StatisticCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: StatisticCardProps) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="type-label">{title}</p>
          <p className="text-2xl font-semibold text-ink">{value}</p>
          {subtitle && <p className="type-caption mt-1 text-ink-secondary">{subtitle}</p>}
        </div>
        {icon && (
          <div className="rounded-md bg-emerald-soft p-2.5 text-emerald">
            {icon}
          </div>
        )}
        {trend && (
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "text-[0.75rem] font-medium rounded-md px-2 py-1",
                trend.positive
                  ? "text-emerald bg-emerald-soft"
                  : "text-ink-secondary bg-surface-raised",
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
