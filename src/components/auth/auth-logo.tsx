"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AuthLogoProps {
  className?: string;
}

/**
 * Code Yaar wordmark used on authentication pages.
 * Renders the light-variant logo on light backgrounds and the dark-variant
 * logo when the page is in dark mode, so the mark stays legible in both
 * themes without any JavaScript theme switching.
 */
export function AuthLogo({ className }: AuthLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/brand/logo-light.png"
        alt=""
        width={28}
        height={28}
        className="hidden dark:block"
      />
      <Image
        src="/brand/logo-mark.png"
        alt=""
        width={28}
        height={28}
        className="dark:hidden"
      />
      <span className="font-display font-semibold text-[1.125rem] tracking-tight">
        Code Yaar
      </span>
    </div>
  );
}
