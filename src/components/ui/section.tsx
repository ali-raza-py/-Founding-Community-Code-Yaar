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
  tone?: "canvas" | "surface" | "raised" | "muted";
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24 lg:py-32",
        bordered && "border-t border-line",
        tone === "canvas" && "bg-canvas",
        tone === "surface" && "bg-surface",
        tone === "raised" && "bg-surface-raised",
        tone === "muted" && "bg-surface",
        className,
      )}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
