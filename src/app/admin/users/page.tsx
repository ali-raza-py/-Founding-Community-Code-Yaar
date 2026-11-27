"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Breadcrumb } from "@/components/dashboard/page-header";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/shared";
import { ResponsiveTable, TableBody, TableCell, TableCellHeader, TableHeader, TableHead, TableRow } from "@/components/dashboard/responsive-table";

export default function AdminUsersPage() {
  const { accessToken, isAuthenticated, isLoading, isSuperAdmin, signOut } = useAuth();
  const [profiles, setProfiles] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleUpdateLoading, setRoleUpdateLoading] = useState<string | null>(null);

  const loadProfiles = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    const res = await communityApi.getAdminProfiles(accessToken);
    if (res.ok) {
      setProfiles(res.data);
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  }, [accessToken]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const handleRoleUpdate = useCallback(async (id: string, role: string) => {
    setRoleUpdateLoading(id);
    const res = await communityApi.updateAdminProfileRole(accessToken!, id, role);
    setRoleUpdateLoading(null);
    if (res.ok) {
      setProfiles((prev) => prev.map((p) => (p.id === id ? res.data : p)));
    } else {
      setError(res.error.message);
    }
  }, [accessToken]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isSuperAdmin) {
    return null;
  }

  const roleCounts: Record<string, number> = {};
  profiles.forEach((p) => {
    roleCounts[p.role] = (roleCounts[p.role] ?? 0) + 1;
  });

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="User & Role Management"
        description="Manage user profiles and administrative roles. Only super administrators can access this area."
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Administration", href: "/admin/users" }]}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatisticCard title="Total Users" value={profiles.length} icon={<span className="size-5">👤</span>} />
        <StatisticCard title="Super Admins" value={roleCounts["super_admin"] ?? 0} icon={<span className="size-5">🛡️</span>} />
        <StatisticCard title="Admins" value={roleCounts["admin"] ?? 0} icon={<span className="size-5">⚙️</span>} />
        <StatisticCard title="Participants" value={roleCounts["participant"] ?? 0} icon={<span className="size-5">🎓</span>} />
      </div>

      {/* Security notice */}
      <div className="rounded-lg border border-line bg-surface p-4">
        <p className="type-label mb-2">Security notes</p>
        <ul className="space-y-1 text-sm text-ink-secondary">
          <li>Only <strong>super_admin</strong> roles can access this page.</li>
          <li>Role changes are enforced by the backend. The frontend cannot bypass authorization.</li>
          <li>A user cannot demote themselves if they are the last super administrator.</li>
          <li>The existing first Super Admin account is preserved.</li>
        </ul>
      </div>

      {/* Users table */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        {error ? (
          <ErrorState message={error} />
        ) : profiles.length === 0 ? (
          <EmptyState title="No profiles found" description="No user profiles exist in the system." />
        ) : (
          <ResponsiveTable caption="User profiles">
            <TableHead>
              <TableHeader>
                <TableCellHeader>Name</TableCellHeader>
                <TableCellHeader>Email</TableCellHeader>
                <TableCellHeader>Role</TableCellHeader>
                <TableCellHeader>Created</TableCellHeader>
                <TableCellHeader className="text-right">Action</TableCellHeader>
              </TableHeader>
            </TableHead>
            <TableBody>
              {profiles.map((profile: any) => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.full_name || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{profile.email || "—"}</TableCell>
                  <TableCell>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const role = formData.get("role") as string;
                        void handleRoleUpdate(profile.id, role);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Select
                        defaultValue={profile.role}
                        name="role"
                        className="w-40 text-xs"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="participant">Participant</option>
                      </Select>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={roleUpdateLoading === profile.id}
                      >
                        {roleUpdateLoading === profile.id ? "Updating…" : "Update"}
                      </Button>
                    </form>
                  </TableCell>
                  <TableCell className="text-ink-muted">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <StatusBadge status={profile.role} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </ResponsiveTable>
        )}
      </div>
    </div>
  );
}
