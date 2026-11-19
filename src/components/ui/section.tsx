import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  containerClassName,
  tone = "canvas",
  bordered = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  tone?: "canvas" | "surface" | "muted";
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-[5.5rem] lg:py-[7.5rem]",
        bordered && "border-t border-line",
        tone === "canvas" && "bg-[var(--color-canvas)] dark:bg-gray-900",
        tone === "surface" && "bg-[var(--color-surface)] dark:bg-gray-800",
        tone === "muted" && "bg-[var(--color-surface-muted)] dark:bg-gray-700",
        className,
      )}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}