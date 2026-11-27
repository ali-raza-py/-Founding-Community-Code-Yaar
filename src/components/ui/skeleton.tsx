"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md border-none bg-surface-raised",
        className,
      )}
      {...props}
    />
  );
}

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-4 rounded-md animate-pulse bg-surface-raised",
            index === lines - 1 ? "w-3/4" : "w-full",
          )}
        />
      ))}
    </div>
  );
}

export interface SkeletonCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  className?: string;
}

export function SkeletonCircle({
  size = 40,
  className,
  ...props
}: SkeletonCircleProps) {
  return (
    <div
      className={cn(
        `size-${size} rounded-full animate-pulse bg-surface-raised`,
        className,
      )}
      {...props}
    />
  );
}
