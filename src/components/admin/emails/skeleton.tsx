"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

/** Subtle animated skeleton used while email data loads. */
export function Skeleton({
  className,
  width = "100%",
  height = "1rem",
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-raised",
        className,
        typeof width === "number" ? `w-[${width}px]` : `w-[${width}]`,
        typeof height === "number" ? `h-[${height}px]` : `h-[${height}]`
      )}
      aria-hidden="true"
    />
  );
}

interface SkeletonTextProps {
  className?: string;
  lines?: number;
  width?: string | number;
}

export function SkeletonText({
  className,
  lines = 3,
  width = "100%",
}: SkeletonTextProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? "60%" : width}
          height="0.875rem"
        />
      ))}
    </div>
  );
}
