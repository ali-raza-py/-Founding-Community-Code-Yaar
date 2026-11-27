"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarNavigationItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  collapsed: boolean;
  notification?: number;
  isActive: boolean;
  onClick?: () => void;
  anchor?: string;
}

export function SidebarNavigationItem({
  href,
  label,
  icon: Icon,
  collapsed,
  notification,
  isActive,
  onClick,
  anchor,
}: SidebarNavigationItemProps) {
  const handleClick = (event: React.MouseEvent) => {
    if (anchor) {
      event.preventDefault();
      const target = document.getElementById(anchor);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      onClick?.();
      return;
    }
    onClick?.();
  };

  const Element = anchor ? "a" : Link;

  return (
    <Element
      href={anchor ? `#${anchor}` : href}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 rounded-[var(--sidebar-item-radius)] border border-transparent text-sm font-medium transition-colors group",
        isActive
          ? "bg-emerald-soft text-emerald border-l-2 border-emerald pl-[calc(1.5rem-2px)]"
          : "text-ink-secondary hover:bg-surface-raised hover:text-ink hover:border-l-transparent",
      )}
    >
      <div className={cn("flex items-center gap-3 w-full", collapsed ? "justify-center" : "justify-start")}>
        <Icon className={cn("size-4 shrink-0", isActive ? "text-emerald" : "text-ink-secondary")} />
        {!collapsed && (
          <span className="font-medium whitespace-nowrap">{label}</span>
        )}
      </div>
      {notification && !collapsed && (
        <Badge
          variant="outline"
          className="ml-auto shrink-0 text-[0.6875rem] font-bold px-2 py-0.5"
        >
          {notification > 99 ? "99+" : notification}
        </Badge>
      )}
    </Element>
  );
}

interface SidebarSectionProps {
  sections: Array<{
    label: string;
    items: Array<{
      href: string;
      label: string;
      icon: React.ElementType;
      roles?: readonly ("super_admin" | "admin")[];
      notification?: number;
      anchor?: string;
    }>;
  }>;
  userRole: "super_admin" | "admin" | "participant" | null;
  collapsed: boolean;
  onItemClick: (href: string) => void;
}

export function SidebarNavigation({
  sections,
  userRole,
  collapsed,
  onItemClick,
}: SidebarSectionProps) {
  const pathname = usePathname();

  const visibleSections = useMemo(() => {
    return sections
      .map((section) => ({
        label: section.label,
        items: section.items.filter((item) => {
          if (!item.roles) return true;
          if (item.roles.includes("super_admin")) return userRole === "super_admin";
          return userRole === "admin" || userRole === "super_admin";
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [sections, userRole]);

  const activeItem = useMemo(() => {
    for (const section of visibleSections) {
      const match = section.items.find(
        (i) => pathname === i.href || pathname.startsWith(`${i.href}/`),
      );
      if (match) return match;
    }
    return null;
  }, [pathname, visibleSections]);

  return (
    <nav className="flex-1 overflow-y-auto p-3 space-y-1">
      {visibleSections.map((section) => (
        <div key={section.label} className="mb-2">
          <h3 className="px-3 mb-1.5 text-[0.7rem] font-semibold text-ink-secondary tracking-wider uppercase">
            {section.label}
          </h3>
          {section.items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <SidebarNavigationItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={Icon}
                collapsed={collapsed}
                notification={item.notification}
                isActive={isActive || item.href === activeItem?.href}
                onClick={() => void onItemClick(item.href)}
                anchor={item.anchor}
              />
            );
          })}
        </div>
      ))}
    </nav>
  );
}
