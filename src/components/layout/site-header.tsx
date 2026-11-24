"use client";

import { ArrowRight, LogIn, ShieldCheck, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/api/auth";
import { Spinner } from "@/components/auth/spinner";

import { Wordmark } from "./wordmark";

const APPLY_LABEL = "Apply for the Founding Cohort";
const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/apply", label: "Apply" },
  { href: "/ambassadors", label: "Global Ambassadors" },
  { href: "/cohort", label: "The First 100" },
  { href: "/faq", label: "FAQ" },
] as const;

function NavigationLinks({
  pathname,
  onSelect,
}: {
  pathname: string;
  onSelect?: () => void;
}) {
  return (
    <ul className={onSelect ? "grid gap-1" : "flex items-center gap-0.5 xl:gap-1"}>
      {NAV_LINKS.map(({ href, label }) => {
        const current = pathname === href ? "page" : pathname.startsWith(href + "/") ? "location" : undefined;

        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onSelect}
              aria-current={current}
              className={cn(
                "flex min-h-11 items-center whitespace-nowrap rounded-md px-2.5 text-sm font-medium transition-colors xl:px-3",
                onSelect && "px-3",
                current
                  ? "bg-emerald-soft text-emerald"
                  : "text-ink-muted hover:bg-surface-raised hover:text-emerald",
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const {
    isAuthenticated,
    isAdmin,
    isLoading,
    signOut,
  } = useAuth();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeMenu = () => setOpen(false);
    const closeOnDesktop = () => {
      if (desktop.matches) closeMenu();
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        closeMenu();
      }
    };

    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    window.addEventListener("popstate", closeMenu);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      window.removeEventListener("popstate", closeMenu);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="relative z-50 mx-auto mt-3 w-[calc(100%-2rem)] max-w-page rounded-2xl border border-line bg-surface shadow-[0_6px_24px_rgba(25,35,29,0.08)] sm:mt-4 sm:w-[calc(100%-3rem)] lg:sticky lg:top-4 lg:mt-0 lg:w-[calc(100%-4rem)]"
      onBlur={(event) => {
        if (open && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.preventDefault();
          setOpen(false);
          menuTriggerRef.current?.focus();
        }
      }}
    >
      <div className="flex min-h-15 items-center justify-between gap-3 px-3 sm:px-4 lg:min-h-16 lg:gap-4 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:px-5">
        <Wordmark className="min-h-11 xl:text-base xl:[&_img]:size-7 xl:justify-self-start" onClick={() => setOpen(false)} />

        <nav aria-label="Primary" className="hidden lg:block">
          <NavigationLinks pathname={pathname} />
          {isAuthenticated && isAdmin && (
            <li>
              <Link
                href="/admin"
                aria-current={pathname === "/admin" ? "page" : pathname.startsWith("/admin/") ? "location" : undefined}
                className="flex min-h-11 items-center whitespace-nowrap rounded-md px-2.5 text-sm font-medium transition-colors xl:px-3 text-emerald hover:bg-surface-raised"
              >
                <ShieldCheck className="size-4 mr-1.5" />
                Admin
              </Link>
            </li>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 xl:justify-self-end">
          {isLoading ? (
            <>
              <span className="flex items-center gap-2 rounded-md bg-surface p-1">
                <Spinner className="size-3 size-sm shrink-0" />
              </span>
            </>
          ) : isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                aria-current={pathname === "/dashboard" ? "page" : undefined}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 gap-2 rounded-lg whitespace-nowrap px-3.5 sm:px-4 text-ink",
                )}
              >
                <LayoutDashboard className="size-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Button onClick={signOut} variant="outline" size="sm" className="hidden sm:flex">
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                aria-label="Sign in"
                aria-current={pathname === "/auth/sign-in" ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 gap-2 rounded-lg whitespace-nowrap px-3.5 sm:px-4 text-ink",
                )}
              >
                <LogIn className="size-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Link>

              <Link
                href="/apply"
                aria-label={APPLY_LABEL}
                aria-current={pathname === "/apply" ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(buttonVariants(), "h-11 gap-2 rounded-lg whitespace-nowrap px-3.5 sm:px-4")}
              >
                <span className="sm:hidden">Apply</span>
                <span className="hidden sm:inline">{APPLY_LABEL}</span>
                <ArrowRight aria-hidden="true" className="hidden size-[1.125rem] shrink-0 lg:block" />
              </Link>
            </>
          )}

          <button
            ref={menuTriggerRef}
            type="button"
            onClick={() => setOpen((current) => !current)}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-surface-raised lg:hidden",
              open && "bg-surface-raised text-emerald",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            <svg
              aria-hidden="true"
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Primary"
        hidden={!open}
        className="mx-3 mb-2 max-h-[calc(100dvh-6.25rem)] overflow-y-auto overscroll-contain border-t border-line px-1 pt-2 lg:hidden"
      >
        <NavigationLinks pathname={pathname} onSelect={() => setOpen(false)} />
        {isAuthenticated && isAdmin && (
          <li>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center whitespace-nowrap rounded-md px-2.5 text-sm font-medium transition-colors xl:px-3 text-emerald hover:bg-surface-raised"
            >
              <ShieldCheck className="size-4 mr-1.5" />
              Admin
            </Link>
          </li>
        )}
        {isLoading ? (
          <li>
            <span className="flex min-h-11 items-center whitespace-nowrap rounded-md px-2.5 text-sm font-medium text-ink-muted">
              <Spinner className="size-3 mr-1.5" />
              Loading…
            </span>
          </li>
        ) : isAuthenticated && (
          <li>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center whitespace-nowrap rounded-md px-2.5 text-sm font-medium transition-colors xl:px-3"
            >
              <LayoutDashboard className="size-4 mr-1.5" />
              Dashboard
            </Link>
          </li>
        )}
        {isLoading ? null : isAuthenticated && (
          <li>
            <button
              onClick={signOut}
              className="flex min-h-11 items-center whitespace-nowrap rounded-md px-2.5 text-sm font-medium transition-colors xl:px-3 text-danger hover:bg-surface-raised"
            >
              <LogOut className="size-4 mr-1.5" />
              Sign out
            </button>
          </li>
        )}
      </nav>
    </header>
  );
}
