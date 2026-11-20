import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padded?: boolean;
}

export function Section({ children, padded, className, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "relative isolate",
        padded && "py-[6rem] sm:py-[8rem] lg:py-[10rem]",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionInner({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={cn("mx-auto max-w-page px-4 sm:px-6 lg:px-8", className)} {...props} />
  );
}
