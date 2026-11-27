"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { useCallback, useMemo } from "react";

import { useAuth } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  breadcrumb?: Array<{ label: string; href: string }>;
  onMenuClick?: () => void;
}

export function DashboardHeader({
  title,
  breadcrumb,
  onMenuClick,
}: DashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const crumbs = useMemo(() => {
    if (!breadcrumb || breadcrumb.length === 0) return null;
    return breadcrumb.slice(0, -1);
  }, [breadcrumb]);
  const current = breadcrumb ? breadcrumb[breadcrumb.length - 1] : null;

  return (
    <header
      className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-line bg-surface/90 backdrop-blur-sm px-4"
    >
      <div className="flex items-center gap-4 min-w-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="invisible lg:hidden p-1.5 text-ink transition-colors hover:bg-surface-raised rounded-md"
            aria-label="Open navigation"
          >
            <Menu className="size-5 shrink-0" />
          </button>
        )}
        <div className="flex flex-col min-w-0">
          <p className="text-[0.6875rem] font-semibold text-ink-secondary uppercase tracking-tight">
            {crumbs ? (
              <>
                {crumbs.map((crumb) => (
                  <Link
                    key={crumb.href}
                    href={crumb.href}
                    className="text-ink-secondary hover:text-emerald transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ))}
                <span className="mx-1">/</span>
              </>
            ) : null}
          </p>
          <h1 className="text-sm font-semibold text-ink tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 min-w-0">
        <button
          className="p-1.5 text-ink-secondary rounded-md transition-colors hover:bg-surface-raised hover:text-emerald"
          aria-label="Notifications"
        >
          <Bell className="size-4 shrink-0" />
        </button>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-raised px-2.5 py-0.5">
            <Avatar
              src={undefined}
              size={20}
              alt={user?.email ?? "Account"}
              fallback={<span className="text-[0.7rem]">{user?.email?.charAt(0).toUpperCase() ?? "U"}</span>}
            />
            <span className="text-[0.7rem] font-medium text-ink truncate max-w-[140px]">
              {user?.email ?? "Account"}
            </span>
            <span className="inline-flex items-center rounded-md border border-emerald bg-emerald text-[0.65rem] font-bold text-white px-1.5 py-0.5">
              {user?.role?.replace(/_/g, " ") ?? "Participant"}
            </span>
          </span>
          <button
            onClick={signOut}
            className="hidden sm:flex p-1.5 text-ink-secondary rounded-md transition-colors hover:bg-surface-raised hover:text-emerald"
            aria-label="Sign out"
          >
            <LogOut className="size-4 shrink-0" />
          </button>
        </div>
      </div>
    </header>
  );
}
