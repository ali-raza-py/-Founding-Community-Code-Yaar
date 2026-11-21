"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import type { AdminProfile } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

export default function SuperAdminPage() {
  const { user, accessToken, isAuthenticated, isLoading, isSuperAdmin, signOut } = useAuth();
  const router = useRouter();

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

  if (isLoading) {
    return (
      <Section padded>
        <SectionInner className="text-center py-24">
          <p className="type-body text-ink-muted">Loading super admin dashboard…</p>
        </SectionInner>
      </Section>
    );
  }

  if (!isAuthenticated || !isSuperAdmin) {
    router.push("/dashboard");
    return null;
  }

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  return (
    <>
      <Section padded>
        <SectionInner>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <SectionHeading
                eyebrow="Super Admin Dashboard"
                title="Profile & Role Management"
                description="Manage user profiles and roles. Only super administrators can access this area."
              />
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-[0.8125rem] text-ink-muted hover:text-emerald">
                ← Back to participant dashboard
              </Link>
              <Button onClick={signOut} variant="outline" size="sm">
                Sign out
              </Button>
            </div>
          </div>
        </SectionInner>
      </Section>

      <Section padded className="bg-surface-raised">
        <SectionInner>
          <SectionHeading
            eyebrow="Profiles"
            title="User Directory"
            description="View and manage all user profiles in the Code Yaar community."
          />
          <div className="mt-8 rounded-lg border border-line bg-surface overflow-hidden">
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                      Loading profiles…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-danger">
                      {error}
                    </td>
                  </tr>
                ) : profiles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                      No profiles found.
                    </td>
                  </tr>
                ) : (
                  profiles.map((profile: AdminProfile) => (
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
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2",
                            profile.role === "super_admin"
                              ? "border-emerald bg-emerald text-white focus-visible:ring-emerald"
                              : profile.role === "admin"
                                ? "border-line bg-surface text-ink-muted hover:bg-surface-raised"
                                : "border-line bg-surface-raised text-ink-muted",
                          )}
                        >
                          {profile.role?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-lg border border-line bg-surface p-6">
            <p className="type-label mb-2">Security notes</p>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li>
                Only <strong className="text-ink">super_admin</strong> roles can access this page.
              </li>
              <li>
                Role changes are enforced by the backend. The frontend cannot
                bypass authorization.
              </li>
              <li>
                A user cannot demote themselves if they are the last super
                administrator.
              </li>
            </ul>
          </div>
        </SectionInner>
      </Section>
    </>
  );
}
