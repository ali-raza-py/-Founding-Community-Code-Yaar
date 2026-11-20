"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const APPLY_LABEL = "Apply for the Founding Cohort";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/ambassadors", label: "Global Ambassadors" },
  { href: "/cohort", label: "The First 100" },
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
  const [scrolled, setScrolled] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = useCallback(() => setOpen((current) => !current), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const isActive = (href: string) =>
    typeof window !== "undefined" && window.location.pathname === href;

  return (
    <header
      className={cn(
        "sticky top-[1rem] z-50 mx-4 sm:mx-6 lg:mx-8 max-w-[1152px] rounded-2xl border border-[#e8ece8]/70",
        scrolled
          ? "shadow-xl border-[#e8ece8] bg-[#ffffff]/95 backdrop-blur-md"
          : "shadow-lg border-[#e8ece8]/50 bg-[#ffffff]/90 backdrop-blur supports-[backdrop-filter]:bg-[#ffffff]/80 transition-all duration-300",
      )}
    >
      <div className="flex h-16 max-w-none items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52] focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors"
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
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                  active
                    ? "text-[#087a52] bg-[#eaf3ee]"
                    : "text-[#46534a] hover:text-[#087a52] hover:bg-[#f2f5f3]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52]",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/apply"
            className={cn(
              buttonVariants({ variant: "primary", size: "sm" }),
              "text-base transition-all duration-200",
            )}
          >
            {APPLY_LABEL}
          </Link>

          <button
            ref={menuTriggerRef}
            type="button"
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-[#19231d] hover:bg-[#f2f5f3] transition-colors duration-200"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

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
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-12 items-center border-b border-[#e8ece8]/50 px-3 text-base font-medium transition-colors duration-200",
                        active
                          ? "text-[#087a52] bg-[#eaf3ee]"
                          : "text-[#19231d] hover:bg-[#f2f5f3]",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <Link
                href="/apply"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "mt-4 w-full text-base transition-all duration-200",
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
