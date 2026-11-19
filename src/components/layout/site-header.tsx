"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

import { Wordmark } from "@/components/layout/wordmark";
import { ThemeToggleButton } from "@/components/ui/theme-toggle";
import { Container } from "@/components/ui/container";

const NAV_ITEMS = [
  { href: "#overview", label: "Overview" },
  { href: "#why-join", label: "Why Join" },
  { href: "#community", label: "Community" },
  { href: "#benefits", label: "Benefits" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "bg-[var(--color-canvas-dark)]/90 backdrop-blur-md border-border"
          : "bg-transparent border-transparent"
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Wordmark />

          <div className="flex items-center gap-3 lg:gap-8">
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/apply"
                className="rounded-[6px] bg-[var(--color-emerald-600)] px-4 py-2 text-[var(--color-canvas-dark)] text-sm font-medium hover:bg-[var(--color-emerald-500)] transition-colors"
              >
                Apply Now
              </Link>
            </nav>

            <ThemeToggleButton />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-foreground hover:bg-elevated-surface transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-[var(--color-canvas-dark)]/95 backdrop-blur-md flex flex-col"
            onClick={() => setIsOpen(false)}
          >
            <div className="Container mx-auto my-8 flex flex-col items-start gap-6 px-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-[var(--color-emerald-500)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/apply"
                onClick={() => setIsOpen(false)}
                className="mt-4 rounded-[6px] bg-[var(--color-emerald-600)] px-6 py-3 text-[var(--color-canvas-dark)] text-sm font-medium hover:bg-[var(--color-emerald-500)] transition-colors w-fit"
              >
                Apply Now
              </Link>
              <div className="mt-auto flex items-center gap-3 pt-8 border-t border-border">
                <ThemeToggleButton />
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
