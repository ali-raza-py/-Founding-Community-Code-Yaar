"use client";

import * as React from "react";

interface AuthShellProps {
  brand: React.ReactNode;
  form: React.ReactNode;
}

/**
 * Shared authentication shell.
 *
 * Desktop: split screen — brand experience on the left (~42%), form on the
 * right, horizontally centered.
 * Mobile: compact brand header followed by the centered form.
 *
 * All spacing, colors and typography come from semantic theme tokens, so the
 * shell works in light and dark mode without any hardcoded colors.
 */
export function AuthShell({ brand, form }: AuthShellProps) {
  return (
    <div className="relative isolate min-h-screen flex flex-col bg-surface">
      {/* Desktop: split-screen layout */}
      <div className="hidden lg:flex flex-1">
        <aside
          className="relative z-10 w-[42%] flex flex-col justify-center p-8 lg:p-16 text-ink"
        >
          <div className="h-full w-full flex flex-col justify-center gap-6">
            {brand}
          </div>
        </aside>

        <main className="flex-1 z-20 flex items-center justify-center p-6 sm:p-10 lg:p-20">
          <div className="mx-auto max-w-[28rem] w-full">{form}</div>
        </main>
      </div>

      {/* Mobile: compact brand header above the centered form */}
      <div className="lg:hidden flex-1 flex flex-col">
        <header className="shrink-0 px-6 py-5">
          {brand}
        </header>
        <main className="flex-1 flex items-center justify-center px-6 pb-10">
          <div className="mx-auto max-w-[28rem] w-full">{form}</div>
        </main>
      </div>
    </div>
  );
}
