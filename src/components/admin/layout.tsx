"use client";

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

const MAIN_NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/founding-cohort", label: "Founding Cohort", icon: UserCheck },
  { href: "/admin/ambassadors", label: "Ambassadors", icon: UserCheck },
  { href: "/admin/participants", label: "Participants", icon: Users },
  { href: "/admin/referrals", label: "Referrals", icon: Mail },
  { href: "/admin/tasks", label: "Tasks", icon: ListChecks },
] as const;

const MANAGEMENT_NAV = [
  { href: "/admin/announcements", label: "Announcements", icon: BarChart3 },
] as const;

const SYSTEM_NAV = [
  { href: "/admin/users", label: "Users", icon: ShieldAlert },
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
    return [
      { section: "MAIN", items: MAIN_NAV },
      ...(isSuperAdmin ? [{ section: "MANAGEMENT", items: MANAGEMENT_NAV }] : []),
      ...(isSuperAdmin ? [{ section: "SYSTEM", items: SYSTEM_NAV }] : []),
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
    <div className="flex h-screen bg-surface">
      {/* Mobile overlay */}
      {!sidebarCollapsed && isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen z-30 flex-col border-r border-line transition-all duration-300",
          sidebarCollapsed || !isSidebarOpen
            ? "w-20 -translate-x-full lg:translate-x-0"
            : "w-72",
        )}
      >
        <div className="flex items-center justify-between h-12 px-4 border-b border-line bg-surface">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-emerald flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">CY</span>
            </div>
            {!sidebarCollapsed && isSidebarOpen && (
              <span className="font-semibold text-ink text-sm whitespace-nowrap">Code Yaar</span>
            )}
          </div>
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

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {allNavItems.map((section) => (
            <div key={section.section} className="mb-4">
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
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                      isActive
                        ? "bg-emerald-soft text-emerald border-r-2 border-emerald"
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

        <div className="p-3 border-t border-line">
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
      <div className={cn("flex-1 overflow-y-auto bg-surface transition-all duration-300", sidebarCollapsed || !isSidebarOpen ? "lg:pl-0" : "lg:pl-72")}>
        {/* Compact header */}
        <header className="sticky top-0 z-20 h-12 border-b border-line bg-surface/95 backdrop-blur-md flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-md bg-emerald flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">CY</span>
            </div>
            <h1 className="font-semibold text-ink text-sm whitespace-nowrap">
              {activeItem?.label ?? "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline whitespace-nowrap text-[0.75rem] text-ink-muted">
              {user?.email}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold shadow-sm transition-colors",
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
