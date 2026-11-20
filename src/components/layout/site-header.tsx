"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const APPLY_LABEL = "Apply for the Founding Cohort";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/cohort", label: "The Cohort" },
  { href: "/faq", label: "FAQ" },
] as const;

function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("size-5 shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("size-5 shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = useCallback(() => setOpen((current) => !current), []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuTriggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8ece8] bg-[#ffffff]/95 backdrop-blur supports-[backdrop-filter]:bg-[#ffffff]/80">
      <div className="mx-auto flex h-16 max-w-[1152px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label="Code Yaar Home"
        >
          <div className="relative h-6 w-6 shrink-0">
            <Image
              src="/brand/logo-mark.png"
              alt=""
              fill
              sizes="24px"
              className="object-contain"
              priority
            />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[#19231d]">
            Code Yaar
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3.5 py-2 text-sm font-medium text-[#46534a] transition-colors hover:text-[#087a52] hover:bg-[#f2f5f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52]"
              aria-current={typeof window !== "undefined" && window.location.pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/apply"
            className={cn(
              buttonVariants({ variant: "primary", size: "sm" }),
              "text-base",
            )}
          >
            {APPLY_LABEL}
          </Link>

          <button
            ref={menuTriggerRef}
            type="button"
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-[#19231d] hover:bg-[#f2f5f3] transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-40 flex flex-col"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-[#ffffff] border-b border-[#e8ece8] flex flex-col h-full w-[80vw] max-w-xs sm:w-[92vw]">
            <div className="mx-auto my-6 flex flex-col items-start gap-5 px-4 flex-shrink-0">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={
                      typeof window !== "undefined" &&
                      window.location.pathname === link.href
                        ? "page"
                        : undefined
                    }
                    className="flex min-h-12 items-center border-b border-[#e8ece8]/50 px-3 text-[#19231d] text-base font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <Link
                href="/apply"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "mt-4 w-full text-base",
                )}
              >
                {APPLY_LABEL}
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto" />
          </div>
        </div>
      )}
    </header>
  );
}
