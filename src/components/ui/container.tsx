import * as React from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = React.HTMLAttributes<HTMLElement>;

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto max-w-[1152px] px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}
