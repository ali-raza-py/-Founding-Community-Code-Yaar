"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  UserCheck,
  Mail,
  ListChecks,
  ShieldAlert,
  Settings,
  BarChart3,
  LogOut,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/founding-cohort", label: "Founding Cohort", icon: UserCheck },
  { href: "/admin/ambassadors", label: "Ambassadors", icon: UserCheck },
  { href: "/admin/participants", label: "Participants", icon: Users },
  { href: "/admin/referrals", label: "Referrals", icon: Mail },
  { href: "/admin/tasks", label: "Tasks", icon: ListChecks },
  { href: "/admin/announcements", label: "Announcements", icon: BarChart3 },
] as const;

const SUPER_ADMIN_NAV = [
  { href: "/admin/users", label: "User Management", icon: ShieldAlert },
  { href: "/admin/users", label: "Role Management", icon: Settings },
] as const;

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, isAdmin, isSuperAdmin, signOut, isLoading } = useAuth();
  const pathname = usePathname();

  const navItems = useMemo(() => {
    if (!isAdmin) return [];
    return [
      ...ADMIN_NAV,
      ...(isSuperAdmin ? SUPER_ADMIN_NAV : []),
    ];
  }, [isAdmin, isSuperAdmin]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="type-body text-ink-muted">Loading admin panel…</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const isSidebarOpen = typeof window !== "undefined" && window.innerWidth >= 1024;

  return (
    <div className="flex h-screen bg-surface">
      {/* Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:w-72 flex-col border-r border-line",
          !isSidebarOpen && "lg:hidden"
        )}
      >
        <div className="flex items-center gap-2 p-6 border-b border-line bg-surface-raised">
          <div className="h-8 w-8 rounded-md bg-emerald flex items-center justify-center">
            <span className="text-white font-bold text-xs">CY</span>
          </div>
          <span className="font-semibold text-ink text-sm">Code Yaar Admin</span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-soft text-emerald"
                    : "text-ink-muted hover:bg-surface-raised hover:text-emerald",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-6 border-t border-line">
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut className="size-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-surface">
        <div className="sticky top-0 z-10 border-b border-line bg-surface/95 backdrop-blur">
          <div className="flex items-center justify-between px-6 py-4 lg:px-8">
            <div>
              <h1 className="text-lg font-semibold text-ink">
                {navItems.find((n) => n.href === pathname || pathname.startsWith(n.href + "/"))?.label ?? "Admin"}
              </h1>
              <p className="text-[0.8125rem] text-ink-muted">
                Community Administration Panel
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline whitespace-nowrap text-[0.75rem] text-ink-muted">
                {user?.email}
              </span>
              <Badge
                variant={isSuperAdmin ? "emerald" : "outline"}
                className="whitespace-nowrap text-[0.75rem] px-2 py-1"
              >
                {isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "Participant"}
              </Badge>
              <Button onClick={signOut} variant="ghost" size="sm" className="hidden sm:flex whitespace-nowrap">
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function Badge({ variant, className, children }: { variant: "default" | "outline" | "emerald"; className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-colors",
        variant === "emerald"
          ? "border-emerald bg-emerald text-white"
          : variant === "outline"
            ? "border-line bg-surface text-ink-muted"
            : "border-line bg-surface-raised text-ink-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
