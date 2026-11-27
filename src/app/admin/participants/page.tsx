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
  const [programs, setPrograms] = useState<Array<{ id: string; name: string }>>([]);
  const [profiles, setProfiles] = useState<Array<{ id: string; full_name: string | null; email: string | null }>>([]);
  const [programApplications, setProgramApplications] = useState<Array<{ id: string; applicant_name: string; email: string; program_id: string }>>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTasks, setDetailTasks] = useState<Array<any>>([]);
  const pageRef = useRef(1);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [participantStatus, setParticipantStatus] = useState<"active" | "inactive" | "suspended" | "graduated">("active");

  const loadParticipants = useCallback(async (page = 1) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    const [progRes, partRes, profRes] = await Promise.all([
      communityApi.getAdminPrograms(accessToken),
      communityApi.getAdminParticipants(accessToken, {
        page,
        pageSize: 20,
        search: search || undefined,
        programId: programFilter || undefined,
        status: statusFilter || undefined,
      }),
      communityApi.getAdminProfiles(accessToken),
    ]);
    if (progRes.ok && progRes.data) setPrograms(progRes.data.map((p: any) => ({ id: p.id, name: p.name })));
    if (profRes.ok && profRes.data) {
      setProfiles(
        (profRes.data as Array<{ id: string; full_name: string | null; email: string | null }>).map((p) => ({
          id: p.id,
          full_name: p.full_name,
          email: p.email,
        })),
      );
    }
    if (partRes.ok) {
      setParticipants(partRes.data.items);
      setMeta(partRes.data.meta);
      pageRef.current = page;
    } else {
      setError(partRes.error.message);
    }
    setLoading(false);
  }, [accessToken, search, programFilter, statusFilter]);

  useEffect(() => {
    loadParticipants(1);
  }, [loadParticipants]);

  const handleStatusUpdate = useCallback(async (id: string, status: "active" | "inactive" | "suspended" | "graduated") => {
    if (!confirm(`Change participant status to ${status}?`)) return;
    setUpdateLoading(id);
    const res = await communityApi.updateAdminParticipant(accessToken!, id, {
      participant_status: status,
    });
    setUpdateLoading(null);
    if (res.ok) {
      setParticipants((prev) =>
        prev.map((p) => (p.id === id ? { ...p, participant_status: status } : p)),
      );
      if (selected?.id === id) setSelected((prev: any) => ({ ...prev, participant_status: status }));
    } else {
      setError(res.error.message);
    }
  }, [accessToken, selected]);

  const openDetail = useCallback(async (p: any) => {
    setSelected(p);
    setDetailLoading(true);
    setDetailTasks([]);
    try {
      const res = await communityApi.getAdminTasks(accessToken!, { assignedTo: p.user_id, pageSize: 50 });
      if (res.ok && res.data) setDetailTasks(res.data.items);
    } finally {
      setDetailLoading(false);
    }
  }, [accessToken]);

  // Load applications for the selected programme so admins pick by name/email,
  // not by raw UUID.
  useEffect(() => {
    if (!accessToken || !selectedProgramId) {
      setProgramApplications([]);
      setSelectedApplicationId("");
      return;
    }
    (async () => {
      const res = await communityApi.getAdminApplications(accessToken, {
        page: 1,
        pageSize: 100,
        programId: selectedProgramId,
        sortBy: "created_at",
        sortDir: "desc",
      });
      if (res.ok && res.data) {
        setProgramApplications(
          (res.data.items as Array<{ id: string; applicant_name: string; email: string; program_id: string }>).map(
            (a) => ({
              id: a.id,
              applicant_name: a.applicant_name,
              email: a.email,
              program_id: a.program_id,
            }),
          ),
        );
      }
    })();
  }, [accessToken, selectedProgramId]);

  const handleCreateParticipant = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUserId || !selectedApplicationId || !selectedProgramId) {
      setError("Please select a user, application, and programme.");
      return;
    }
    const res = await communityApi.createAdminParticipant(accessToken!, {
      user_id: selectedUserId,
      application_id: selectedApplicationId,
      program_id: selectedProgramId,
      participant_status: participantStatus,
    });

    if (res.ok) {
      setParticipants([res.data, ...participants]);
      setSelectedUserId("");
      setSelectedProgramId("");
      setSelectedApplicationId("");
      setParticipantStatus("active");
      setProgramApplications([]);
    } else {
      setError(res.error.message);
    }
  }, [accessToken, participants, selectedUserId, selectedProgramId, selectedApplicationId, participantStatus]);

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
            <Field label="Programme" required>
              <Select
                value={selectedProgramId}
                onChange={(e) => {
                  setSelectedProgramId(e.currentTarget.value);
                  setSelectedUserId("");
                  setSelectedApplicationId("");
                }}
                required
              >
                <option value="">Select a programme</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="User (search by name or email)" required>
              <Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.currentTarget.value)}
                required
                disabled={!selectedProgramId}
              >
                <option value="">Select a user</option>
                {profiles
                  .filter((p) => p.email || p.full_name)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name ?? "—"} — {p.email ?? "no email"}
                    </option>
                  ))}
              </Select>
            </Field>
            <Field label="Application" required hint="Applications already submitted to the selected programme.">
              <Select
                value={selectedApplicationId}
                onChange={(e) => setSelectedApplicationId(e.currentTarget.value)}
                required
                disabled={!selectedProgramId || !selectedUserId}
              >
                <option value="">Select an application</option>
                {programApplications.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.applicant_name} — {a.email}
                  </option>
                ))}
                {programApplications.length === 0 && selectedProgramId && (
                  <option value="" disabled>
                    No applications found for this programme
                  </option>
                )}
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={participantStatus}
                onChange={(e) => setParticipantStatus(e.currentTarget.value as "active" | "inactive" | "suspended" | "graduated")}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="graduated">Graduated</option>
              </Select>
            </Field>
            <div className="flex items-end">
              <Button type="submit" disabled={loading || !selectedUserId || !selectedApplicationId || !selectedProgramId}>
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
             <Field label="Programme">
               <Select
                 value={programFilter}
                 onChange={(e) => setProgramFilter(e.currentTarget.value)}
               >
                 <option value="">All programmes</option>
                 {programs.map((p) => (
                   <option key={p.id} value={p.id}>{p.name}</option>
                 ))}
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
                       className="border-b border-line hover:bg-surface-raised transition-colors cursor-pointer"
                       onClick={() => void openDetail(p)}
                     >
                      <td className="px-4 py-3 text-sm text-ink">
                        {p.full_name || p.profiles?.full_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {p.email || p.profiles?.email || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {p.programs?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink">
                        <select
                          defaultValue={p.participant_status}
                          onChange={(e) => {
                            e.stopPropagation();
                            void handleStatusUpdate(p.id, e.currentTarget.value as "active" | "inactive" | "suspended" | "graduated");
                          }}
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
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={() => setSelected(null)}>
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-line bg-surface p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold text-ink">Participant Profile</h3>
                <button onClick={() => setSelected(null)} className="text-ink-muted">✕</button>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p><span className="font-semibold">Name:</span> {selected.full_name ?? selected.profiles?.full_name ?? "—"}</p>
                <p><span className="font-semibold">Email:</span> {selected.email ?? selected.profiles?.email ?? "—"}</p>
                <p><span className="font-semibold">Programme:</span> {selected.program_name ?? selected.programs?.name ?? "—"}</p>
                <p><span className="font-semibold">Status:</span> {selected.participant_status}</p>
                <p><span className="font-semibold">Joined:</span> {selected.joined_at ? new Date(selected.joined_at).toLocaleDateString() : "—"}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["active", "inactive", "suspended", "graduated"] as const).map((s) => (
                  <Button key={s} size="sm" onClick={() => void handleStatusUpdate(selected.id, s)} disabled={updateLoading === selected.id}>
                    {s}
                  </Button>
                ))}
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-ink mb-2">Assigned tasks</h4>
                {detailLoading ? (
                  <p className="text-sm text-ink-muted">Loading…</p>
                ) : detailTasks.length === 0 ? (
                  <p className="text-sm text-ink-muted">No tasks assigned.</p>
                ) : (
                  <ul className="space-y-2">
                    {detailTasks.map((t: any) => (
                      <li key={t.id} className="rounded-md border border-line p-3 text-sm">
                        <div className="font-medium text-ink">{t.title}</div>
                        <div className="text-xs text-ink-muted">Status: {t.status} {t.due_date ? `· Due ${new Date(t.due_date).toLocaleDateString()}` : ""}</div>
                        {t.feedback && <div className="mt-1 text-xs text-ink-muted">Feedback: {t.feedback}</div>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

      </SectionInner>
    </Section>
  );
}
