import Link from "next/link";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Code Yaar wordmark. Adapts logo and text colour to the active theme.
 */
export function Wordmark({
  className,
}: {
  className?: string;
}) {
  const { theme } = useTheme();
  const logoSrc =
    theme === "light" ? "/code-yaar-logo.png" : "/code-yaar-logo-light.png";
  const textColor = theme === "light" ? "text-ink" : "text-canvas";

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
