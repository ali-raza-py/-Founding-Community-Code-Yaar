import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Code Yaar mark. Dark mode only.
 */
export function Wordmark({
  className,
}: {
  className?: string;
}) {
  const logoSrc = "/code-yaar-logo-light.png";
  const textColor = "text-white";
  return (
    <Link
      href="/"
      aria-label="Code Yaar — home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <img
        src={logoSrc}
        alt=""
        aria-hidden
        width={24}
        height={30}
        className={cn("h-[26px] w-auto shrink-0", "decoding-async")}
      />
      <span
        className={cn(
          "text-[0.9375rem] font-semibold tracking-[-0.01em]",
          textColor,
        )}
      >
        Code Yaar
      </span>
    </Link>
  );
}
