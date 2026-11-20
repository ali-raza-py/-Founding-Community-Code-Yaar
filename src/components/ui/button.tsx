import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-[6px] font-medium text-[0.9375rem] transition-colors duration-150 disabled:pointer-events-none disabled:opacity-55 [&:active]:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-emerald-600 text-canvas btn-sheen hover:bg-emerald-700",
        secondary:
          "border border-line-strong bg-transparent text-ink hover:bg-surface-raised hover:border-line-strong",
        inverse:
          "bg-ink text-canvas hover:bg-surface-raised",
        ghost: "text-ink hover:bg-surface-raised",
      },
      size: {
        sm: "h-10 px-3.5 text-[0.8125rem]",
        md: "h-11 px-4 text-[0.875rem]",
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
