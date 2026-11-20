import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  eyebrow?: string;
  title: string;
  description?: string | React.ReactNode;
  tag?: "h2" | "h3";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tag = "h2",
  className,
  ...props
}: SectionHeadingProps) {
  const Tag = tag;
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      {eyebrow && (
        <p className="type-label mb-1">{eyebrow}</p>
      )}
      <Tag className="mb-3">{title}</Tag>
      {description && (
        <p className="type-body-muted">{description}</p>
      )}
    </div>
  );
}
