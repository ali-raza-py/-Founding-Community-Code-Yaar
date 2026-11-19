"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-7">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative group",
                  isActive
                    ? "after-pointer-events-none bg-[var(--color-emerald-600)] text-white"
                    : "after:hidden after:border-b after:border-b-[var(--color-emerald-600)] after:after-2 after:after-[var(--color-emerald-600)]",
                )}
              >
                <span className={cn("block transition-colors duration-150", isActive ? "text-white" : "text-ink-muted")}>
                  {link.label}
                </span>
              </Link>
            </li>
          );
        })}
        {NAV_LINKS.some((l) => l.label === "Apply") && (
          <li className="relative shrink-0">
            <ButtonLink
              href="/apply"
              className={cn(
                "inline-flex items-center gap-2 rounded-[6px] bg-[var(--color-emerald-600)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-emerald-700)] transition-colors"
              )}
            >
              Apply Now
            </ButtonLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
