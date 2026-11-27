"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import { SidebarNavigation } from "./sidebar-item";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  logoHref: string;
  program: {
    label: string;
    identifier: string;
  };
  sections: Array<{
    label: string;
    items: Array<{
      href: string;
      label: string;
      icon: React.ElementType;
      roles?: readonly ("super_admin" | "admin")[];
      notification?: number;
    }>;
  }>;
  onCollapseChange?: (collapsed: boolean) => boolean | void;
}

interface SidebarUser {
  email: string | null;
  role: string | null;
}

export function DashboardSidebar({
  logoHref,
  program,
  sections,
  onCollapseChange,
}: DashboardSidebarProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  const sidebarUser = useMemo<SidebarUser>(() => {
    return {
      email: user?.email ?? null,
      role: user?.role ?? null,
    };
  }, [user]);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      onCollapseChange?.(next);
      return next;
    });
  }, [onCollapseChange]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileOpen) setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const handleItemClick = useCallback(
    (href: string) => {
      if (!isDesktop) closeMobile();
      void router.push(href);
    },
    [router, isDesktop, closeMobile],
  );

  const visibleSections = useMemo(() => {
    return sections
      .map((section) => ({
        label: section.label,
        items: section.items.filter((item) => {
          if (!item.roles) return true;
          if (item.roles.includes("super_admin")) {
            return sidebarUser.role === "super_admin";
          }
          return sidebarUser.role === "admin" || sidebarUser.role === "super_admin";
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [sections, sidebarUser.role]);

  const sidebarClasses = cn(
    "flex flex-col border border-line bg-surface shadow-sm rounded-[var(--sidebar-radius)]",
    "transition-all duration-300 ease-in-out",
    `width-[var(--sidebar-width)]`,
    collapsed ? `width-[var(--sidebar-width-collapsed)]` : "",
  );

  return (
    <>
      {/* Mobile backdrop */}
      {!isDesktop && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed z-30 flex flex-col",
          !isDesktop && "z-50",
          isDesktop
            ? "left-4 top-4 bottom-4"
            : "inset-y-0 left-0 w-full",
          "transition-transform duration-300 ease-in-out",
          !isDesktop && !mobileOpen ? "-translate-x-full" : "",
        )}
        aria-label="Navigation"
      >
        <div className={sidebarClasses}>
          {/* Brand header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-surface/95">
            <Link
              href={logoHref}
              className="flex items-center gap-2.5 group"
              title="Code Yaar"
            >
              <Image
                src="/brand/logo-mark.png"
                alt=""
                width={20}
                height={20}
                className="size-5 shrink-0 group-hover:scale-110 transition-transform duration-200"
              />
              {!collapsed && (
                <div className="flex flex-col leading-none">
                  <span className="font-semibold text-ink text-sm tracking-tight whitespace-nowrap">
                    Code Yaar
                  </span>
                  <span className="text-[0.6875rem] font-medium text-ink-secondary uppercase tracking-tight">
                    {program.identifier}
                  </span>
                </div>
              )}
            </Link>
            {isDesktop && (
              <button
                onClick={toggleCollapse}
                className="p-2 text-ink-secondary rounded-md transition-colors hover:bg-surface-raised hover:text-emerald"
                aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
              >
                {collapsed ? (
                  <ChevronRight className="size-4 shrink-0" />
                ) : (
                  <ChevronLeft className="size-4 shrink-0" />
                )}
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <SidebarNavigation
              sections={visibleSections}
              userRole={sidebarUser.role as
                | "super_admin"
                | "admin"
                | "participant"
                | null}
              collapsed={collapsed}
              onItemClick={handleItemClick}
            />
          </div>

          {/* Footer: account + sign out */}
          <div className="p-3 border-t border-line bg-surface/95">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 px-1">
                <Avatar
                  src={undefined}
                  size={28}
                  alt={sidebarUser.email ?? "Account"}
                  fallback={
                    <span className="text-[0.875rem]">
                      {(sidebarUser.email ?? "U").charAt(0).toUpperCase()}
                    </span>
                  }
                />
                <div className="min-w-0 flex-1">
                  {!collapsed && sidebarUser.email && (
                    <p className="text-sm font-medium text-ink truncate">
                      {sidebarUser.email}
                    </p>
                  )}
                  {sidebarUser.role && !collapsed && (
                    <p className="text-[0.7rem] font-semibold text-ink-secondary uppercase tracking-tight truncate">
                      {sidebarUser.role}
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="w-full text-sm"
              >
                <LogOut className="size-4 shrink-0 mr-2" />
                {!collapsed && "Sign out"}
                {collapsed && (
                  <Tooltip content="Sign out" side="right">
                    <span className="sr-only">Sign out</span>
                  </Tooltip>
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      {!isDesktop && (
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className={cn(
            "fixed left-4 top-4 z-50 flex items-center justify-center size-10 rounded-xl border border-line bg-surface text-ink shadow-sm transition-colors hover:bg-surface-raised",
            mobileOpen && "text-emerald border-emerald",
          )}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="size-5 shrink-0" />
          ) : (
            <ChevronRight className="size-5 shrink-0" />
          )}
        </button>
      )}
    </>
  );
}
