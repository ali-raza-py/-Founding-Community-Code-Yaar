"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

export default function AdminParticipantsPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [participants, setParticipants] = useState<Array<any>>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const pageRef = useRef(1);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  const loadParticipants = useCallback(async (page = 1) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    const res = await communityApi.getAdminParticipants(accessToken, {
      page,
      pageSize: 20,
      search: search || undefined,
      programId: programFilter || undefined,
      status: statusFilter || undefined,
    });
    if (res.ok) {
      setParticipants(res.data.items);
      setMeta(res.data.meta);
      pageRef.current = page;
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  }, [accessToken, search, programFilter, statusFilter]);

  useEffect(() => {
    loadParticipants(1);
  }, [loadParticipants]);

  const handleStatusUpdate = useCallback(async (id: string, status: "active" | "inactive" | "suspended" | "graduated") => {
    setUpdateLoading(id);
    const res = await communityApi.updateAdminParticipant(accessToken!, id, {
      participant_status: status,
    });
    setUpdateLoading(null);
    if (res.ok) {
      setParticipants((prev) =>
        prev.map((p) => (p.id === id ? { ...p, participant_status: status } : p)),
      );
    } else {
      setError(res.error.message);
    }
  }, [accessToken]);

  const handleCreateParticipant = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const user_id = formData.get("user_id") as string;
    const application_id = formData.get("application_id") as string;
    const program_id = formData.get("program_id") as string;
    const participant_status_value = (formData.get("participant_status") as string) || "active";
    const participant_status = participant_status_value as "active" | "inactive" | "suspended" | "graduated";

    if (!user_id || !application_id || !program_id) {
      setError("All fields are required.");
      return;
    }

    const res = await communityApi.createAdminParticipant(accessToken!, {
      user_id,
      application_id,
      program_id,
      participant_status,
    });

    if (res.ok) {
      setParticipants([res.data, ...participants]);
      (event.currentTarget as HTMLFormElement).reset();
    } else {
      setError(res.error.message);
    }
  }, [accessToken, participants]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const statusCounts: Record<string, number> = {};
  participants.forEach((p) => {
    statusCounts[p.participant_status] = (statusCounts[p.participant_status] ?? 0) + 1;
  });

  return (
    <Section padded>
      <SectionInner>
        <SectionHeading
          eyebrow="Participant Management"
          title="Participant Directory"
          description="View, create, and manage community participants."
        />

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <StatCard title="Total Participants" value={participants.length} />
          <StatCard title="Active" value={statusCounts["active"] ?? 0} />
          <StatCard title="Inactive" value={statusCounts["inactive"] ?? 0} />
          <StatCard title="Suspended" value={statusCounts["suspended"] ?? 0} />
        </div>

        {/* Create participant */}
        <div className="mt-8 rounded-xl border border-line bg-surface p-5 sm:p-6">
          <SectionHeading
            eyebrow="Create Participant"
            title="Invite a New Participant"
            description="Create a participant record by linking a user to an application and programme."
            tag="h3"
          />
          <form onSubmit={handleCreateParticipant} className="mt-6 grid gap-4 sm:grid-cols-4">
            <Field label="User ID" required>
              <Input
                name="user_id"
                placeholder="User UUID"
                required
              />
            </Field>
            <Field label="Application ID" required>
              <Input
                name="application_id"
                placeholder="Application UUID"
                required
              />
            </Field>
            <Field label="Program ID" required>
              <Input
                name="program_id"
                placeholder="Program UUID"
                required
              />
            </Field>
            <Field label="Status">
              <Select name="participant_status" defaultValue="active">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="graduated">Graduated</option>
              </Select>
            </Field>
            <div className="flex items-end">
              <Button type="submit" disabled={loading}>
                Create Participant
              </Button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-xl border border-line bg-surface p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <Field label="Search by name or email">
              <Input
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                placeholder="Name or email"
              />
            </Field>
            <Field label="Program">
              <Select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.currentTarget.value)}
              >
                <option value="">All programs</option>
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.currentTarget.value)}
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="graduated">Graduated</option>
              </Select>
            </Field>
            <div className="flex items-end">
              <Button onClick={() => void loadParticipants(1)} disabled={loading} size="sm">
                Apply filters
              </Button>
            </div>
          </div>
        </div>

        {/* Participants table */}
        <div className="mt-8 rounded-xl border border-line bg-surface overflow-hidden">
          {error ? (
            <ErrorState message={error} />
          ) : participants.length === 0 ? (
            <EmptyState
              title="No participants found"
              description="No participants match your current filters."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line bg-surface-raised">
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Name</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Email</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Program</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Status</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Joined</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p: any) => (
                    <tr
                      key={p.id}
                      className="border-b border-line hover:bg-surface-raised transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-ink">
                        {p.profiles?.full_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {p.profiles?.email || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {p.programs?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink">
                        <select
                          defaultValue={p.participant_status}
                          onChange={(e) => void handleStatusUpdate(p.id, e.currentTarget.value as "active" | "inactive" | "suspended" | "graduated")}
                          disabled={updateLoading === p.id}
                          className="text-xs bg-transparent border-none text-ink focus-visible:ring-0"
                        >
                          {["active", "inactive", "suspended", "graduated"].map(
                            (status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ),
                          )}
                        </select>
                        {updateLoading === p.id && (
                          <span className="text-[0.75rem] text-ink-muted">Updating…</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {p.joined_at ? new Date(p.joined_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <AdminStatusBadge status={p.participant_status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {meta && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-[0.8125rem] text-ink-muted">
              {meta.total} participants &middot; Page {meta.page} of {meta.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  if (pageRef.current > 1) void loadParticipants(pageRef.current - 1);
                }}
                disabled={pageRef.current <= 1 || loading}
                size="sm"
              >
                Prev
              </Button>
              <Button
                onClick={() => {
                  if (pageRef.current < meta.totalPages) void loadParticipants(pageRef.current + 1);
                }}
                disabled={pageRef.current >= meta.totalPages || loading}
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </SectionInner>
    </Section>
  );
}
