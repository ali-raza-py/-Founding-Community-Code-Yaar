"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  size?: number;
  fallback?: React.ReactNode;
}

export function Avatar({
  src,
  alt,
  size = 32,
  fallback,
  className,
  ...props
}: AvatarProps) {
  return (
    <div
      className={cn("relative shrink-0", className)}
      {...props}
    >
      <img
        src={src ?? ""}
        alt={alt ?? ""}
        className={cn(
          `size-${size} rounded-full object-cover border border-line bg-surface-raised`,
          !src && "hidden",
        )}
        {...(src ? {} : {})}
      />
      {!src && (
        <div className={cn(
          `size-${size} rounded-full bg-emerald-soft flex items-center justify-center`,
        )}>
          {fallback ?? (
            <span className="text-emerald font-medium text-sm">
              {alt?.charAt(0) ?? "?"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
