"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = "mobile-navigation";

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid size-11 place-items-center rounded-[6px] border border-line-strong text-ink transition-colors hover:bg-surface-muted"
      >
        {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-line bg-canvas shadow-sm transform transition-transform duration-300 ease-out"
      >
        <nav aria-label="Mobile" className="px-5 py-4 sm:px-8">
          <ul className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center border-b border-line text-[0.9375rem]"
                  )}
                >
                  <span className={cn("flex-1", pathname === link.href ? "font-medium text-ink" : "text-ink-muted")}>
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink
            href="/apply"
            onClick={() => setOpen(false)}
            className="mt-4 w-full rounded-[6px] bg-[var(--color-emerald-600)] text-white text-sm font-medium text-center"
          >
            Apply for the Founding Cohort
          </ButtonLink>
        </nav>
      </div>
    </div>
  );
}
