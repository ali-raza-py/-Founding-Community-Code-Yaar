"use client";

import { cn } from "@/lib/utils";
import { EmptyState } from "./empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingState } from "@/components/admin/shared";

interface ResponsiveTableProps {
  children: React.ReactNode;
  caption?: string;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  loading?: boolean;
  className?: string;
}

export function ResponsiveTable({
  children,
  caption,
  empty,
  emptyTitle = "No data available",
  emptyDescription,
  loading,
  className,
}: ResponsiveTableProps) {
  if (loading) {
    return <LoadingState />;
  }

  if (empty) {
    return (
      <div className="overflow-x-auto">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left border-collapse">
        {caption && (
          <caption className="sr-only">{caption}</caption>
        )}
        {children}
      </table>
    </div>
  );
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHead({ children, className }: TableHeadProps) {
  return <thead className={cn("border-b border-line bg-surface-raised", className)}>{children}</thead>;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <tr className={cn(className)}>
      {children}
    </tr>
  );
}

interface TableCellHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCellHeader({ children, className }: TableCellHeaderProps) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted",
        className,
      )}
    >
      {children}
    </th>
  );
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBody({ className, children }: TableBodyProps) {
  return <tbody className={cn(className)}>{children}</tbody>;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TableRow({
  children,
  className,
  onClick,
}: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-line hover:bg-surface-raised transition-colors",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

export function TableCell({
  children,
  className,
  align = "left",
}: TableCellProps) {
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "";
  return (
    <td className={cn("px-4 py-3 text-sm text-ink", alignClass, className)}>
      {children}
    </td>
  );
}

interface TableCellMutedProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

export function TableCellMuted({
  children,
  className,
  align = "left",
}: TableCellMutedProps) {
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "";
  return (
    <td
      className={cn(
        "px-4 py-3 text-sm text-ink-muted",
        alignClass,
        className,
      )}
    >
      {children}
    </td>
  );
}
