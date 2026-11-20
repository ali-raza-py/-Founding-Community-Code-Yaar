"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Wordmark } from "@/components/layout/wordmark";
import { ThemeToggleButton } from "@/components/ui/theme-toggle";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const APPLY_LABEL = "Apply for the Founding Cohort";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
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

  const toggleMenu = useCallback(() => setOpen((current) => !current), []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "bg-canvas/85 backdrop-blur-md border-line"
          : "bg-transparent border-transparent",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Wordmark />

          <div className="flex items-center gap-3 lg:gap-8">
            <nav
              aria-label="Main"
              className="hidden lg:flex items-center gap-6 text-sm font-medium"
            >
              <AnimateSharedLayout>
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  const isApply = link.href === "/apply";
                  return (
                    <li key={link.href} className="relative">
                      {isApply ? (
                        <ButtonLink
                          href="/apply"
                          variant="primary"
                          size="sm"
                          className="shrink-0 px-3.5 py-2 text-[0.875rem]"
                        >
                          {APPLY_LABEL}
                        </ButtonLink>
                      ) : (
                        <Link
                          href={link.href}
                          className={cn(
                            "relative transition-colors duration-150",
                            isActive ? "text-ink" : "text-ink-subtle",
                          )}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {link.label}
                        </Link>
                      )}
                      {isActive && !isApply && (
                        <motion.span
                          layoutId="active-indicator"
                          layout
                          className="absolute -bottom-[2px] left-0 right-0 mx-1 h-[2px] rounded-full bg-emerald-600"
                        />
                      )}
                    </li>
                  );
                })}
              </AnimateSharedLayout>
            </nav>

            <ThemeToggleButton />

            <button
              ref={menuTriggerRef}
              type="button"
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-md text-ink hover:bg-surface-raised transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>

        {/* Mobile sheet */}
        <AnimatePresence>
          {open && (
            <div
              id="mobile-navigation"
              className="fixed inset-0 z-40 flex flex-col"
              onClick={(event) => {
                if (event.target === event.currentTarget) setOpen(false);
              }}
            >
              <div className="bg-canvas/95 backdrop-blur-md border-b border-line flex flex-col h-full">
                <div className="mx-auto my-6 flex flex-col items-start gap-5 px-4 flex-shrink-0">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={pathname === link.href ? "page" : undefined}
                        className={cn(
                          "flex min-h-12 items-center border-b border-line/50 px-3 text-[1.125rem] font-medium",
                          pathname === link.href ? "text-ink" : "text-ink-muted",
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <ButtonLink
                    href="/apply"
                    onClick={() => setOpen(false)}
                    className="mt-4 w-full rounded-[6px] bg-emerald-600 text-canvas text-[0.9375rem] font-medium py-3.5"
                  >
                    {APPLY_LABEL}
                  </ButtonLink>
                  <div className="mt-auto pt-6 border-t border-line">
                    <ThemeToggleButton />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto" />
              </div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}
