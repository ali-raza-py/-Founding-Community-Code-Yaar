"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  StatCard,
  EmptyState,
  ErrorState,
  LoadingState,
  AdminStatusBadge,
} from "@/components/admin/shared";

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
    <Section padded>
      <SectionInner>
        <SectionHeading
          eyebrow="Super Admin Management"
          title="User & Role Management"
          description="Manage user profiles and administrative roles. Only super administrators can access this area."
        />

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <StatCard title="Total Users" value={profiles.length} />
          <StatCard title="Super Admins" value={roleCounts["super_admin"] ?? 0} />
          <StatCard title="Admins" value={roleCounts["admin"] ?? 0} />
          <StatCard title="Participants" value={roleCounts["participant"] ?? 0} />
        </div>

        {/* Security notice */}
        <div className="mt-8 rounded-lg border border-amber bg-amber-light p-4">
          <p className="type-label mb-2">Security notes</p>
          <ul className="space-y-1 text-sm text-ink-muted">
            <li>Only <strong>super_admin</strong> roles can access this page.</li>
            <li>Role changes are enforced by the backend. The frontend cannot bypass authorization.</li>
            <li>A user cannot demote themselves if they are the last super administrator.</li>
            <li>The existing first Super Admin account is preserved.</li>
          </ul>
        </div>

        {/* Users table */}
        <div className="mt-8 rounded-xl border border-line bg-surface overflow-hidden">
          {error ? (
            <ErrorState message={error} />
          ) : profiles.length === 0 ? (
            <EmptyState title="No profiles found" description="No user profiles exist in the system." />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-raised">
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Name</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Email</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Role</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Created</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile: any) => (
                  <tr
                    key={profile.id}
                    className="border-b border-line hover:bg-surface-raised transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-ink">
                      {profile.full_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {profile.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink">
                      <AdminStatusBadge status={profile.role} />
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
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
                          className="w-32 text-xs"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </SectionInner>
    </Section>
  );
}
