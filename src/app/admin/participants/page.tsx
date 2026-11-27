"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  ErrorState,
  LoadingState,
} from "@/components/admin/shared";
import { ResponsiveTable, TableBody, TableCell, TableCellHeader, TableHeader, TableHead, TableRow } from "@/components/dashboard/responsive-table";
import { cn } from "@/lib/utils";
import { normalizeParticipant, participantValue } from "@/lib/participant";

export default function AdminParticipantsPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [participants, setParticipants] = useState<Array<any>>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [programs, setPrograms] = useState<Array<{ id: string; name: string }>>([]);
  const [profiles, setProfiles] = useState<Array<{ id: string; full_name: string | null; email: string | null; role: string | null }>>([]);
  const [programApplications, setProgramApplications] = useState<Array<{ id: string; applicant_name: string; email: string; program_id: string }>>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const pageRef = useRef(1);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [participantStatus, setParticipantStatus] = useState<"active" | "inactive" | "suspended" | "graduated">("active");

  // Confirmation dialog state for status changes.
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState("");
  const [confirmStatus, setConfirmStatus] = useState<"active" | "inactive" | "suspended" | "graduated">("active");

  // Pending (unconfirmed) status per participant row so the select reverts on cancel.
  const [pendingParticipantStatus, setPendingParticipantStatus] = useState<Record<string, string>>({});

  const profileByUserId = useMemo(() => {
    const map = new Map<string, {
      full_name: string | null;
      email: string | null;
      role: string | null;
    }>();
    for (const pr of profiles) map.set(pr.id, pr);
    return map;
  }, [profiles]);

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
        (profRes.data as Array<{ id: string; full_name: string | null; email: string | null; role: string | null }>).map((p) => ({
          id: p.id,
          full_name: p.full_name,
          email: p.email,
          role: p.role ?? null,
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
    setConfirmOpen(false);
    setConfirmId("");
    setUpdateLoading(id);
    const res = await communityApi.updateAdminParticipant(accessToken!, id, {
      participant_status: status,
    });
    setUpdateLoading(null);
    if (res.ok) {
      setPendingParticipantStatus((prev) => {
        const { [id]: _removed, ...rest } = prev;
        return rest;
      });
      setParticipants((prev) =>
        prev.map((p) => (p.id === id ? { ...p, participant_status: status } : p)),
      );
    } else {
      setError(res.error.message);
    }
  }, [accessToken]);

  const requestStatusChange = useCallback((id: string, status: "active" | "inactive" | "suspended" | "graduated") => {
    setPendingParticipantStatus((prev) => ({ ...prev, [id]: status }));
    setConfirmId(id);
    setConfirmStatus(status);
    setConfirmOpen(true);
  }, []);

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
    setError(null);
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
    <div className="space-y-8">
      <DashboardPageHeader
        title="Participant Directory"
        description="View, create, and manage community participants."
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Participants", href: "/admin/participants" }]}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatisticCard title="Total Participants" value={participants.length} icon={<span className="size-5">👥</span>} />
        <StatisticCard title="Active" value={statusCounts["active"] ?? 0} icon={<span className="size-5">✅</span>} />
        <StatisticCard title="Inactive" value={statusCounts["inactive"] ?? 0} icon={<span className="size-5">⏸️</span>} />
        <StatisticCard title="Suspended" value={statusCounts["suspended"] ?? 0} icon={<span className="size-5">🚫</span>} />
      </div>

      {/* Create participant */}
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <p className="type-label">Create Participant</p>
            <p className="text-[0.8125rem] text-ink-secondary">Create a participant record by linking a user to an application and programme.</p>
          </div>
        </div>
        <form onSubmit={handleCreateParticipant} className="mt-4 grid gap-3 sm:grid-cols-4">
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
                <option key={p.id} value={p.id}>{p.name}</option>
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
          <div className="flex items-end col-span-4 sm:col-span-1">
            <Button type="submit" disabled={loading || !selectedUserId || !selectedApplicationId || !selectedProgramId}>
              Create Participant
            </Button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-6">
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
          <div className="flex items-end col-span-4 sm:col-span-1">
            <Button onClick={() => void loadParticipants(1)} disabled={loading} size="sm">
              Apply filters
            </Button>
          </div>
        </div>
      </div>

      {/* Participants table */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        {error ? (
          <ErrorState message={error} />
        ) : participants.length === 0 ? (
          <EmptyState
            title="No participants found"
            description="No participants match your current filters."
          />
        ) : (
          <ResponsiveTable caption="Participant directory">
            <TableHead>
              <TableHeader>
                <TableCellHeader>Name</TableCellHeader>
                <TableCellHeader>Email</TableCellHeader>
                <TableCellHeader>Program</TableCellHeader>
                <TableCellHeader>Status</TableCellHeader>
                <TableCellHeader>Joined</TableCellHeader>
                <TableCellHeader className="text-right">Action</TableCellHeader>
              </TableHeader>
            </TableHead>
            <TableBody>
              {participants.map((p: any) => {
                const np = normalizeParticipant(p, profileByUserId);
                return (
                    <TableRow
                      key={p.id}
                      className="cursor-pointer"
                      onClick={() => void router.push(`/admin/participants/detail?id=${p.id}`)}
                    >
                    <TableCell>
                      {participantValue(np.displayName)}
                    </TableCell>
                    <TableCell className="text-ink-muted">
                      {participantValue(np.email)}
                    </TableCell>
                    <TableCell className="text-ink-muted">
                      {participantValue(np.programme)}
                    </TableCell>
                    <TableCell>
                      <select
                        value={pendingParticipantStatus[p.id] ?? p.participant_status}
                        onChange={(e) => {
                          requestStatusChange(p.id, e.currentTarget.value as "active" | "inactive" | "suspended" | "graduated");
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
                        <span className="text-[0.75rem] text-ink-secondary">Updating…</span>
                      )}
                    </TableCell>
                    <TableCell className="text-ink-muted">
                      {np.joinedAt ? new Date(np.joinedAt).toLocaleDateString() : "—"}
                    </TableCell>
                  <TableCell className="text-right">
                    <StatusBadge status={p.participant_status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </ResponsiveTable>
        )}
      </div>

      {meta && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[0.8125rem] text-ink-secondary">
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
    </div>
  );
}
