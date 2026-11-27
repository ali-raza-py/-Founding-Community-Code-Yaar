"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: Array<{ label: string; href: string }>;
}

export function DashboardPageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: DashboardPageHeaderProps) {
  return (
    <div className="space-y-1">
      {breadcrumb && (
        <Breadcrumb items={breadcrumb} className="mb-2 flex-wrap" />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          {description && (
            <p className="type-caption mt-0.5 text-ink-secondary">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-wrap">{actions}</div>
        )}
      </div>
    </div>
  );
}

interface BreadcrumbProps {
  items: Array<{ label: string; href: string }>;
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1", className)}>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <>
            {!last ? (
              <Link
                href={item.href}
                className="text-[0.75rem] text-ink-secondary hover:text-emerald transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[0.75rem] font-medium text-ink">{item.label}</span>
            )}
            {!last && <span className="mx-1 text-ink-secondary">/</span>}
          </>
        );
      })}
    </nav>
  );
}
