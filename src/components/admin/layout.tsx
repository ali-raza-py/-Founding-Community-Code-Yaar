"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/lib/api/auth";
import { DashboardHeader } from "@/components/dashboard/header";
import { AdminSidebar, ADMIN_SECTIONS } from "@/components/admin/admin-sidebar";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const activeItem = ADMIN_SECTIONS.flatMap((s) => s.items).find((i) => {
    if (i.exact) return pathname === i.href;
    return pathname === i.href || pathname.startsWith(`${i.href}/`);
  });

  const breadcrumb = activeItem
    ? [{ label: activeItem.label, href: activeItem.href }]
    : undefined;

  return (
    <div className="flex h-screen bg-canvas">
      <AdminSidebar
        collapsed={collapsed}
        onCollapseChange={setCollapsed}
      />

      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden bg-canvas transition-all duration-300 ease-in-out",
          "lg:pl-[calc(var(--sidebar-width)+1rem)]",
          collapsed && "lg:pl-[calc(var(--sidebar-width-collapsed)+1rem)]",
        )}
      >
        <DashboardHeader
          title={activeItem?.label ?? "Dashboard"}
          breadcrumb={breadcrumb}
          onMenuClick={undefined}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
