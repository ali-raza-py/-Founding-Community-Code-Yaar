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
  Activity,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Share2,
  User,
  X,
} from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ParticipantMembership {
  program: string | null;
  slug: string | null;
  status: string | null;
  joinedAt: string | null;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  anchor?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const FOUNDING_COHORT_SECTIONS: NavSection[] = [
  {
    label: "FOUNDING COHORT",
    items: [
      { href: "/cohort/dashboard", label: "Overview", icon: LayoutDashboard },
      {
        href: "/cohort/dashboard",
        label: "My Tasks",
        icon: ListChecks,
        anchor: "tasks",
      },
      {
        href: "/cohort/dashboard",
        label: "Announcements",
        icon: FileText,
        anchor: "announcements",
      },
      {
        href: "/cohort/dashboard",
        label: "My Progress",
        icon: Activity,
        anchor: "overview",
      },
      {
        href: "/cohort/dashboard",
        label: "Profile",
        icon: User,
        anchor: "profile",
      },
    ],
  },
];

const AMBASSADOR_SECTIONS: NavSection[] = [
  {
    label: "AMBASSADOR PROGRAMME",
    items: [
      { href: "/ambassador/dashboard", label: "Overview", icon: LayoutDashboard },
      {
        href: "/ambassador/dashboard",
        label: "My Tasks",
        icon: ListChecks,
        anchor: "tasks",
      },
      {
        href: "/ambassador/dashboard",
        label: "Referrals",
        icon: Share2,
        anchor: "referrals",
      },
      {
        href: "/ambassador/dashboard",
        label: "Announcements",
        icon: FileText,
        anchor: "announcements",
      },
      {
        href: "/ambassador/dashboard",
        label: "My Progress",
        icon: Activity,
        anchor: "overview",
      },
      {
        href: "/ambassador/dashboard",
        label: "Profile",
        icon: User,
        anchor: "profile",
      },
    ],
  },
];

interface ParticipantSidebarProps {
  className?: string;
}

export function ParticipantSidebar({ className }: ParticipantSidebarProps) {
  const { user, signOut, accessToken, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [memberships, setMemberships] = useState<ParticipantMembership[]>([]);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  const loadMemberships = useCallback(async () => {
    if (!accessToken || !isAuthenticated) return;
    try {
      const res = await communityApi.getMyParticipants(accessToken);
      if (res.ok && Array.isArray(res.data)) {
        setMemberships(
          (res.data as Array<any>).map((p) => ({
            program: p.programs?.name ?? null,
            slug: p.programs?.slug ?? null,
            status: p.participant_status ?? null,
            joinedAt: p.joined_at ?? null,
          })),
        );
      }
    } catch {
      // Membership load failures are non-fatal; sidebar renders empty groups.
    }
  }, [accessToken, isAuthenticated]);

  useEffect(() => {
    loadMemberships();
  }, [loadMemberships]);

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
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleCollapse = useCallback(() => setCollapsed((prev) => !prev), []);

  const handleItemClick = useCallback(
    (href: string, anchor?: string) => {
      if (!isDesktop) closeMobile();
      const target = anchor ? `${href}#${anchor}` : href;
      void router.push(target);
    },
    [router, isDesktop, closeMobile],
  );

  const isFoundingCohortMember = useMemo(() => {
    return memberships.some(
      (m) => m.slug && m.slug.toLowerCase().includes("cohort"),
    );
  }, [memberships]);

  const isAmbassadorMember = useMemo(() => {
    return memberships.some(
      (m) => m.slug && m.slug.toLowerCase().includes("ambassador"),
    );
  }, [memberships]);

  const visibleSections: NavSection[] = useMemo(() => {
    const sections: NavSection[] = [];
    if (isFoundingCohortMember) {
      sections.push(FOUNDING_COHORT_SECTIONS[0]);
    }
    if (isAmbassadorMember) {
      sections.push(AMBASSADOR_SECTIONS[0]);
    }
    return sections;
  }, [isFoundingCohortMember, isAmbassadorMember]);

  const sidebarUser = useMemo(() => {
    const email = user?.email ?? "";
    return {
      name: email ? email.split("@")[0].replace(/[._-]/g, " ") : "Participant",
      email: user?.email ?? null,
      initials: email
        ? email
            .split("@")[0]
            .split(".")
            .map((part) => part.charAt(0).toUpperCase())
            .join("")
            .slice(0, 2)
        : "PA",
    };
  }, [user]);

  const isInCohortDashboard = pathname.startsWith("/cohort/dashboard");
  const isInAmbassadorDashboard = pathname.startsWith("/ambassador/dashboard");

  const activeItem = useMemo(() => {
    for (const section of visibleSections) {
      const match = section.items.find((i) => {
        const baseMatch = i.href === "/cohort/dashboard" && isInCohortDashboard;
        const ambMatch = i.href === "/ambassador/dashboard" && isInAmbassadorDashboard;
        return baseMatch || ambMatch;
      });
      if (match) return match;
    }
    return null;
  }, [pathname, visibleSections]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const sidebarClasses = cn(
    "flex flex-col border border-admin-sidebar-border bg-admin-sidebar-bg shadow-admin-sidebar-shadow backdrop-blur-md",
    "rounded-[var(--sidebar-radius)] transition-all duration-300 ease-in-out",
    `width-[var(--sidebar-width)]`,
    collapsed ? `width-[var(--sidebar-width-collapsed)]` : "",
    className,
  );

  return (
    <>
      {/* Mobile backdrop */}
      {!isDesktop && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy/70 backdrop-blur-sm"
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
        <div className={sidebarClasses}>
          {/* Brand header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-admin-sidebar-border">
            <Link
              href="/dashboard"
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
                  <span className="font-semibold text-[var(--admin-sidebar-text)] text-sm tracking-tight whitespace-nowrap">
                    Code Yaar
                  </span>
                  <span className="text-[0.65rem] font-medium text-admin-sidebar-text-muted uppercase tracking-tighter">
                    Member Portal
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
              >
                {collapsed ? (
                  <ChevronRight className="size-4 shrink-0" />
                ) : (
                  <ChevronLeft className="size-4 shrink-0" />
                )}
              </button>
            )}
          </div>

          {/* Account profile */}
          {!collapsed && (
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 rounded-xl border border-admin-sidebar-border bg-admin-sidebar-surface px-3 py-2 text-left transition-colors hover:bg-admin-sidebar-surface-hover">
                <div className="relative shrink-0">
                  <div
                    className="size-9 rounded-xl bg-emerald/20 border border-emerald/30 flex items-center justify-center text-emerald font-semibold text-sm shadow-shadow"
                  >
                    {sidebarUser.initials}
                  </div>
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
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <nav className="p-3 space-y-0.5">
              {visibleSections.map((section) => (
                <div key={section.label}>
                  <h3 className="px-3 mb-2 mt-1 text-[0.65rem] font-semibold text-admin-sidebar-text-muted uppercase tracking-wider">
                    {section.label}
                  </h3>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const baseMatch =
                      item.href === "/cohort/dashboard" && isInCohortDashboard;
                    const ambMatch =
                      item.href === "/ambassador/dashboard" &&
                      isInAmbassadorDashboard;
                    const isActive = baseMatch || ambMatch;
                    return (
                      <Link
                        key={item.href + item.label}
                        href={item.anchor ? `${item.href}#${item.anchor}` : item.href}
                        onClick={() => void handleItemClick(item.href, item.anchor)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium transition-colors group",
                          isActive
                            ? "bg-admin-sidebar-active text-emerald border-l-2 border-admin-sidebar-active-border pl-[calc(1.5rem-2px)]"
                            : "text-admin-sidebar-text-muted hover:bg-admin-sidebar-surface hover:text-admin-sidebar-text hover:border-l-transparent",
                        )}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Icon
                            className={cn(
                              "size-4 shrink-0",
                              isActive ? "text-emerald" : "text-admin-sidebar-text-muted",
                            )}
                          />
                          {!collapsed && (
                            <span className="font-medium whitespace-nowrap min-w-0">
                              {item.label}
                            </span>
                          )}
                          {collapsed && (
                            <Tooltip content={item.label} side="right" delayMs={150}>
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

          {/* Footer: sign out */}
          <div className="p-3 border-t border-admin-sidebar-border/50">
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
      </aside>

      {/* Mobile menu button */}
      {!isDesktop && (
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className={cn(
            "fixed left-4 top-4 z-50 flex items-center justify-center size-10 rounded-xl border border-line bg-surface text-ink shadow-sm transition-colors hover:bg-surface-raised hover:text-emerald hover:border-emerald",
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
    </>
  );
}
