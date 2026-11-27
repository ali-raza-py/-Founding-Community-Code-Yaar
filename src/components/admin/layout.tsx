"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  UserCheck,
  Users,
  Mail,
  ListChecks,
  BarChart3,
  ShieldAlert,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** When set, only users with the given role(s) see this item. */
  roles?: ("admin" | "super_admin")[];
}

const MAIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/founding-cohort", label: "Founding Cohort", icon: UserCheck },
  { href: "/admin/ambassadors", label: "Ambassadors", icon: UserCheck },
  { href: "/admin/participants", label: "Participants", icon: Users },
  { href: "/admin/referrals", label: "Referrals", icon: Mail },
  { href: "/admin/tasks", label: "Tasks", icon: ListChecks },
] as const;

const MANAGEMENT_NAV: NavItem[] = [
  {
    href: "/admin/announcements",
    label: "Announcements",
    icon: BarChart3,
    roles: ["super_admin"],
  },
  { href: "/admin/mail", label: "Mail", icon: Mail },
] as const;

const SYSTEM_NAV: NavItem[] = [
  { href: "/admin/users", label: "Users", icon: ShieldAlert, roles: ["super_admin"] },
] as const;

export function AdminLayout({ children }: AdminLayoutProps) {
  const {
    user,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    signOut,
    isLoading,
  } = useAuth();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isSidebarOpen = typeof window !== "undefined" && window.innerWidth >= 1024;

  const allNavItems = useMemo(() => {
    if (!isAdmin) return [];
    const visible = (item: NavItem) => {
      if (!item.roles) return true;
      return item.roles.includes("super_admin") ? isSuperAdmin : true;
    };
    return [
      { section: "Main", items: MAIN_NAV.filter(visible) },
      { section: "Management", items: MANAGEMENT_NAV.filter(visible) },
      { section: "System", items: SYSTEM_NAV.filter(visible) },
    ];
  }, [isAdmin, isSuperAdmin]);

  const activeItem = useMemo(() => {
    for (const section of allNavItems) {
      const match = section.items.find(
        (i) => pathname === i.href || pathname.startsWith(i.href + "/"),
      );
      if (match) return match;
    }
    return null;
  }, [pathname, allNavItems]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <p className="type-body text-ink-muted">Loading admin panel…</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-canvas">
      {/* Mobile overlay */}
      {!sidebarCollapsed && isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Glass sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-72 flex-col border-r border-line transition-all duration-300 bg-surface/80 backdrop-blur-md",
          sidebarCollapsed || !isSidebarOpen ? "-translate-x-full lg:translate-x-0" : "",
        )}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-line bg-surface/60">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 group"
          >
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={20}
              height={20}
              className="size-5 group-hover:scale-110 transition-transform duration-200"
            />
            {!sidebarCollapsed && isSidebarOpen && (
              <span className="font-semibold text-ink text-sm tracking-tight whitespace-nowrap group-hover:text-emerald transition-colors">
                Code Yaar Admin
              </span>
            )}
          </Link>
          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="p-2 text-ink-muted hover:text-emerald hover:bg-surface-raised rounded-md transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <X className="size-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {allNavItems.map((section) => (
            <div key={section.section} className="mb-3">
              <h3 className="px-3 py-2 text-[0.7rem] font-semibold text-ink-muted tracking-wider uppercase">
                {section.section}
              </h3>
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (!isSidebarOpen) setSidebarCollapsed(true);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                      isActive
                        ? "bg-emerald-soft text-emerald shadow-sm"
                        : "text-ink-muted hover:bg-surface-raised hover:text-emerald",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {sidebarCollapsed || !isSidebarOpen ? null : (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer - sign out */}
        <div className="p-3 border-t border-line bg-surface/60">
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="w-full whitespace-nowrap"
          >
            <LogOut className="size-4 shrink-0" />
            {!sidebarCollapsed && isSidebarOpen && "Sign out"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn("flex-1 overflow-y-auto bg-canvas transition-all duration-300", sidebarCollapsed || !isSidebarOpen ? "lg:pl-0" : "lg:pl-72")}>
        {/* Header */}
        <header className="sticky top-0 z-20 h-16 border-b border-line bg-surface/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2"
            >
              <Image
                src="/brand/logo-mark.png"
                alt=""
                width={18}
                height={18}
                className="size-4"
              />
              <h1 className="font-semibold text-ink text-sm whitespace-nowrap">
                {activeItem?.label ?? "Admin"}
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline whitespace-nowrap text-[0.75rem] text-ink-muted">
              {user?.email}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm transition-colors",
                isSuperAdmin
                  ? "border-emerald bg-emerald text-white"
                  : "border-line bg-surface-raised text-ink-muted",
              )}
            >
              {isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "Participant"}
            </span>
            <Button onClick={signOut} variant="ghost" size="sm" className="hidden lg:flex whitespace-nowrap">
              <LogOut className="size-3.5 shrink-0" />
            </Button>
          </div>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
