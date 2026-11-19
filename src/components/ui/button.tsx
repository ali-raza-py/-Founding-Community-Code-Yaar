import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-[6px] font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55",
  {
    variants: {
      variant: {
        primary:
          "bg-forest-950 text-ink hover:bg-forest-800 active:bg-forest-900",
        secondary:
          "border border-line-strong bg-transparent text-ink hover:border-forest-700 hover:bg-surface-muted",
        inverse:
          "bg-canvas text-forest-950 hover:bg-surface-muted active:bg-surface",
        ghost: "text-ink hover:bg-surface-muted",
      },
      size: {
        sm: "h-9 px-3.5 text-[0.8125rem]",
        md: "h-11 px-5 text-[0.9375rem]",
        lg: "h-12 px-6 text-[0.9375rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonStyleProps = VariantProps<typeof buttonStyles>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ComponentProps<"button"> & ButtonStyleProps) {
  return (
    <button
      type={type}
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
  return (
    <Link className={cn(buttonStyles({ variant, size }), className)} {...props} />
  );
}
