import Image from "next/image";
import Link from "next/link";
import type { MouseEventHandler } from "react";

import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  onClick,
}: {
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("inline-flex shrink-0 items-center gap-2 rounded-md text-sm font-semibold hover:text-emerald", className)}
      aria-label="Code Yaar Home"
    >
      <Image
        src="/brand/logo-mark.png"
        alt=""
        width={24}
        height={24}
        className="size-6 shrink-0 object-contain"
      />
      <span className="whitespace-nowrap tracking-tight">
        Code Yaar
      </span>
    </Link>
  );
}
