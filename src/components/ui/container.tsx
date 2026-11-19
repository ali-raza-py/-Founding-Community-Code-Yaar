import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Container({
  children,
  width = "content",
  className,
}: {
  children: ReactNode;
  width?: "content" | "prose";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        width === "content" ? "max-w-[1200px]" : "max-w-[68ch]",
        className,
      )}
    >
      {children}
    </div>
  );
}
