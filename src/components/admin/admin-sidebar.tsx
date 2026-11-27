"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Inbox,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Mail,
  Menu,
  Settings,
  ShieldAlert,
  UserCheck,
  Users,
  X,
  BarChart3,
} from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/dashboard/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AdminNavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: ("super_admin" | "admin")[];
  exact?: boolean;
}

interface AdminNavSection {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_SECTIONS: AdminNavSection[] = [
  {
    label: "OVERVIEW",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "COMMUNITY",
    items: [
      { href: "/admin/participants", label: "Participants", icon: Users },
      {
        href: "/admin/founding-cohort",
        label: "Founding Cohort",
        icon: UserCheck,
      },
      { href: "/admin/ambassadors", label: "Ambassadors", icon: UserCheck },
      { href: "/admin/applications", label: "Applications", icon: FileText },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { href: "/admin/tasks", label: "Tasks", icon: ListChecks },
      { href: "/admin/referrals", label: "Referrals", icon: Mail },
      {
        href: "/admin/announcements",
        label: "Announcements",
        icon: BarChart3,
        roles: ["super_admin"],
      },
    ],
  },
  {
    label: "COMMUNICATION",
    items: [
      { href: "/admin/mail", label: "Email Overview", icon: Inbox },
      {
        href: "/admin/mail?tab=compose",
        label: "Email Composer",
        icon: Mail,
      },
      {
        href: "/admin/mail?tab=templates",
        label: "Email Templates",
        icon: BarChart3,
      },
      {
        href: "/admin/mail?tab=configuration",
        label: "Settings",
        icon: Settings,
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        href: "/admin/users",
        label: "Administration",
        icon: ShieldAlert,
        roles: ["super_admin"],
      },
    ],
  },
] as const;

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
}

export function AdminSidebar({
  collapsed,
  onCollapseChange,
}: AdminSidebarProps) {
  const { user, signOut, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  const toggleCollapse = useCallback(() => {
    const next = !collapsed;
    onCollapseChange(next);
  }, [collapsed, onCollapseChange]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const closeAccount = useCallback(() => setAccountOpen(false), []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileOpen) setMobileOpen(false);
      if (event.key === "Escape" && accountOpen) setAccountOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, accountOpen]);

  const handleItemClick = useCallback(
    (href: string) => {
      if (!isDesktop) closeMobile();
      setAccountOpen(false);
      void router.push(href);
    },
    [router, isDesktop, closeMobile],
  );

  const sidebarUser = useMemo(() => {
    const email = user?.email ?? "";
    return {
      name: email
        ? email.split("@")[0].replace(/[._-]/g, " ")
        : "Administrator",
      email: user?.email ?? null,
      role: user?.role ?? null,
      initials: email
        ? email
            .split("@")[0]
            .split(".")
            .map((part) => part.charAt(0).toUpperCase())
            .join("")
            .slice(0, 2)
        : "AD",
    };
  }, [user]);

  const visibleSections = useMemo(() => {
    return ADMIN_SECTIONS.map((section) => ({
      label: section.label,
      items: section.items.filter((item) => {
        if (!item.roles) return true;
        if (item.roles.includes("super_admin")) {
          return sidebarUser.role === "super_admin";
        }
        return sidebarUser.role === "admin" || sidebarUser.role === "super_admin";
      }),
    })).filter((section) => section.items.length > 0);
  }, [sidebarUser.role]);

  const activeItem = useMemo(() => {
    for (const section of visibleSections) {
      const match = section.items.find((i) => {
        if (i.exact) return pathname === i.href;
        return pathname === i.href || pathname.startsWith(`${i.href}/`);
      });
      if (match) return match;
    }
    return null;
  }, [pathname, visibleSections]);

  return (
    <>
      {/* Mobile backdrop */}
      {!isDesktop && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed z-50 flex flex-col",
          isDesktop
            ? "left-4 top-4 bottom-4"
            : "inset-y-0 left-0 w-full",
          "transition-all duration-300 ease-in-out",
          !isDesktop && !mobileOpen ? "-translate-x-full" : "",
        )}
        aria-label="Navigation"
      >
        <div
          className={cn(
            "flex flex-col border border-admin-sidebar-border bg-admin-sidebar-border/60 bg-admin-sidebar-bg shadow-admin-sidebar-shadow backdrop-blur-md",
            "rounded-[var(--sidebar-radius)] transition-all duration-300 ease-in-out",
            `width-[var(--sidebar-width)]`,
            collapsed ? `width-[var(--sidebar-width-collapsed)]` : "",
          )}
        >
          {/* Brand header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-admin-sidebar-border">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 group"
              title="Code Yaar Administration"
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
                  <span className="font-semibold text-[var(--admin-sidebar-text)] text-sm tracking-tight whitespace-nowrap">
                    Code Yaar
                  </span>
                  <span className="text-[0.65rem] font-medium text-admin-sidebar-text-muted uppercase tracking-tighter">
                    Administration
                  </span>
                </div>
              )}
            </Link>
            {isDesktop && (
              <button
                onClick={toggleCollapse}
                className={cn(
                  "p-2 text-admin-sidebar-text-muted rounded-lg transition-colors hover:bg-admin-sidebar-surface hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-1 focus-visible:ring-offset-admin-sidebar-bg",
                )}
                aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
                title={collapsed ? "Expand navigation" : "Collapse navigation"}
              >
                {collapsed ? (
                  <ChevronRight className="size-4 shrink-0" />
                ) : (
                  <ChevronLeft className="size-4 shrink-0" />
                )}
              </button>
            )}
          </div>

          {/* Account profile section */}
          {!collapsed && (
            <div className="px-4 py-3">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-3 rounded-xl border border-admin-sidebar-border bg-admin-sidebar-surface px-3 py-2 text-left transition-colors hover:bg-admin-sidebar-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                aria-expanded={accountOpen}
                aria-label="Account menu"
              >
                <div className="relative shrink-0">
                  <div
                    className="size-9 rounded-xl bg-emerald/20 border border-emerald/30 flex items-center justify-center text-emerald font-semibold text-sm shadow-shadow"
                  >
                    {sidebarUser.initials}
                  </div>
                  {accountOpen && (
                    <div className="absolute -right-1 -top-1 size-2.5 rounded-full bg-emerald ring-1 ring-admin-sidebar-bg" />
                  )}
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-sm font-semibold text-[var(--admin-sidebar-text)] truncate">
                    {sidebarUser.name}
                  </p>
                  {sidebarUser.email && (
                    <p className="text-[0.75rem] text-admin-sidebar-text-muted truncate">
                      {sidebarUser.email}
                    </p>
                  )}
                  {sidebarUser.role && (
                    <p className="text-[0.65rem] font-semibold text-emerald uppercase tracking-tighter truncate">
                      {sidebarUser.role}
                    </p>
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-admin-sidebar-text-muted transition-transform duration-200",
                    accountOpen && "rotate-180",
                  )}
                />
              </button>
            </div>
          )}

          {/* Main scrollable navigation */}
          <div className="flex-1 overflow-y-auto sidebar-scrollable">
            <nav className="p-3 space-y-0.5">
              {visibleSections.map((section) => (
                <div key={section.label}>
                  <h3 className="px-3 mb-2 mt-1 text-[0.65rem] font-semibold text-admin-sidebar-text-muted uppercase tracking-wider">
                    {section.label}
                  </h3>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (!item.exact &&
                        pathname.startsWith(`${item.href}/`));
                    const active = isActive || item.href === activeItem?.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => void handleItemClick(item.href)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium transition-colors group",
                          active
                            ? "bg-admin-sidebar-active text-emerald border-l-2 border-admin-sidebar-active-border pl-[calc(1.5rem-2px)]"
                            : "text-admin-sidebar-text-muted hover:bg-admin-sidebar-surface hover:text-admin-sidebar-text hover:border-l-transparent",
                        )}
                      >
                        <div className="flex items-center gap-3 w-full justify-between">
                          <div className="flex items-center gap-3">
                            <Icon
                              className={cn(
                                "size-4 shrink-0",
                                active ? "text-emerald" : "text-admin-sidebar-text-muted",
                              )}
                            />
                            {!collapsed && (
                              <span className="font-medium whitespace-nowrap min-w-0">
                                {item.label}
                              </span>
                            )}
                          </div>
                          {collapsed && (
                            <Tooltip
                              content={item.label}
                              side="right"
                              delayMs={150}
                            >
                              <span className="sr-only">{item.label}</span>
                            </Tooltip>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
              <div className="h-8" />
            </nav>
          </div>

          {/* Bottom account actions */}
          <div className="p-3 border-t border-admin-sidebar-border/50">
            <div className="space-y-2">
              {!collapsed && sidebarUser.email && (
                <div className="flex items-center gap-3 rounded-xl border border-transparent bg-admin-sidebar-surface px-3 py-2 text-left transition-colors hover:bg-admin-sidebar-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">
                  <div className="size-8 rounded-lg bg-surface/10 flex items-center justify-center text-admin-sidebar-text-muted font-semibold text-xs">
                    {sidebarUser.initials}
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-[var(--admin-sidebar-text)] truncate">
                      {sidebarUser.name}
                    </p>
                    <p className="text-[0.7rem] text-admin-sidebar-text-muted truncate">
                      {sidebarUser.email}
                    </p>
                  </div>
                </div>
              )}
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="w-full text-sm text-admin-sidebar-text hover:text-emerald hover:bg-admin-sidebar-surface border-admin-sidebar-border"
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
            <Menu className="size-5 shrink-0" />
          )}
        </button>
      )}

      {/* Account dropdown menu */}
      <Dialog
        open={accountOpen}
        onClose={closeAccount}
        title="Account"
        cancelLabel="Close"
        showCloseButton={false}
      >
        {isAuthenticated && (
          <div className="space-y-2">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              <LogOut className="size-4 shrink-0" />
              Sign out
            </button>
          </div>
        )}
      </Dialog>
    </>
  );
}
