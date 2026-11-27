"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import type { AdminProfile, TaskRecord } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Breadcrumb } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Dialog } from "@/components/dashboard/dialog";
import { ConfirmationDialog } from "@/components/dashboard/confirmation-dialog";
import { ErrorState, LoadingState } from "@/components/admin/shared";
import { cn } from "@/lib/utils";

type ParticipantOption = {
  id: string;
  participantRecordId: string;
  userId: string;
  name: string;
  email: string;
  programId: string;
  status?: string;
};

type TaskStatus = "pending" | "in_progress" | "completed" | "overdue";

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  overdue: "Overdue",
};

const STATUS_SEMANTIC: Record<TaskStatus, "success" | "pending" | "rejected" | "in_progress"> = {
  pending: "pending",
  in_progress: "in_progress",
  completed: "success",
  overdue: "rejected",
};

export default function AdminTasksPage() {
  const { accessToken, isAuthenticated, isLoading } = useAuth();
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [meta, setMeta] = useState<{ page: number; pageSize: number; total: number; totalPages: number } | null>(null);
  const [programs, setPrograms] = useState<Array<{ id: string; name: string }>>([]);
  const [participants, setParticipants] = useState<ParticipantOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterProgram, setFilterProgram] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");

  const participantById = useMemo(() => {
    const map = new Map<string, ParticipantOption>();
    for (const p of participants) map.set(p.id, p);
    return map;
  }, [participants]);

  const participantByUserId = useMemo(() => {
    const map = new Map<string, ParticipantOption>();
    for (const p of participants) map.set(p.userId, p);
    return map;
  }, [participants]);

  function normalizeAssignees(assigned_to: string | string[] | undefined): string[] {
    if (!assigned_to) return [];
    return Array.isArray(assigned_to) ? assigned_to : [assigned_to];
  }

  function resolveAssignees(assigned_to: string | string[] | undefined): Array<{
    name: string;
    email: string;
  }> {
    const ids = Array.isArray(assigned_to) ? assigned_to : assigned_to ? [assigned_to] : [];
    const resolved: Array<{ name: string; email: string }> = [];
    for (const id of ids) {
      const p = participantById.get(id) ?? participantByUserId.get(id);
      if (p) resolved.push({ name: p.name, email: p.email });
    }
    return resolved;
  }

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        communityApi.getAdminPrograms(accessToken).then((r) => {
          if (r.ok) setPrograms((r.data ?? []).map((p) => ({ id: p.id, name: p.name })));
        }),
        communityApi.getAdminParticipants(accessToken, { pageSize: 200 }).then((r) => {
          if (!r.ok || !r.data) return;
          const list = r.data.items as Array<{
            id: string; user_id: string; program_id: string; participant_status?: string;
          }>;
          setParticipants(list.map((p) => ({
            id: p.id,
            participantRecordId: p.id,
            userId: p.user_id,
            name: "Unknown participant",
            email: "",
            programId: p.program_id,
            status: p.participant_status,
          })));
          return communityApi.getAdminProfiles(accessToken).then((pr) => {
            if (!pr.ok || !pr.data) return;
            const profiles = pr.data as AdminProfile[];
            const profileByUserId = new Map(profiles.map((prf) => [prf.id, prf]));
            setParticipants((prev) => prev.map((p) => {
              const profile = profileByUserId.get(p.userId);
              return profile
                ? { ...p, name: profile.full_name ?? p.name, email: profile.email ?? p.email }
                : p;
            }));
          });
        }),
        communityApi.getAdminTasks(accessToken, {
          page: 1,
          pageSize: 50,
          search,
          programId: filterProgram || undefined,
          status: filterStatus || undefined,
        }).then((r) => {
          if (r.ok && r.data) {
            setTasks(r.data.items);
            setMeta(r.data.meta);
          }
        }),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, search, filterProgram, filterStatus, communityApi]);

  // ------------------------------------------------------------------
  // Dialog state
  // ------------------------------------------------------------------
  const EMPTY_CREATE = {
    title: "",
    description: "",
    program_id: "",
    assigned_to: [] as string[],
    due_date: "",
  } as const;

  const [createOpen, setCreateOpen] = useState(false);
  const [createValues, setCreateValues] = useState<{
    title: string;
    description: string;
    program_id: string;
    assigned_to: string[];
    due_date: string;
  }>(EMPTY_CREATE);
  const [createError, setCreateError] = useState("");

  const eligibleParticipants = useMemo(() => {
    if (!createValues.program_id) return [];
    return participants.filter((p) => p.programId === createValues.program_id && p.status === "active");
  }, [createValues.program_id, participants]);

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    title: string;
    description: string;
    program_id: string;
    assigned_to: string[];
    due_date: string;
    status?: TaskStatus;
  } | undefined>(undefined);
  const [editError, setEditError] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const taskForEdit = tasks.find((t) => t.id === editId);

  useEffect(() => {
    void load();
  }, [load]);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <LoadingState />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-12 max-w-[42rem] mx-auto text-center">
        <h2 className="mb-6 text-base font-semibold text-ink">Task Management</h2>
        <p className="type-body mb-6">Sign in to manage tasks.</p>
        <Link href="/sign-in" className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-hover">
          Sign in
        </Link>
      </div>
    );
  }

  const handleCreate = async (values: {
    title: string;
    description: string;
    program_id: string;
    assigned_to: string[];
    due_date: string;
  }) => {
    if (!accessToken) return;
    const fieldErrors: Record<string, string> = {};
    if (!values.title.trim()) fieldErrors.title = "Title is required.";
    if (!values.program_id) fieldErrors.program_id = "Select a program.";
    if (!values.assigned_to || values.assigned_to.length === 0)
      fieldErrors.assigned_to = "Select at least one participant.";
    if (!values.due_date) fieldErrors.due_date = "Select a due date.";
    if (Object.keys(fieldErrors).length > 0) {
      setCreateError(Object.values(fieldErrors).join(" "));
      return;
    }
    setCreateError("");
    const res = await communityApi.createAdminTask(accessToken, {
      title: values.title.trim(),
      description: values.description,
      program_id: values.program_id,
      assigned_to: values.assigned_to,
      due_date: values.due_date,
      status: "pending",
    });
    if (res.ok) {
      setCreateOpen(false);
      setCreateValues(EMPTY_CREATE);
      void load();
    } else {
      setCreateError(res.error?.message ?? "Failed to create task.");
    }
  };

  const handleUpdate = async (id: string, values: {
    title: string;
    description: string;
    due_date: string | null;
    status: TaskStatus;
    assigned_to: string[];
  }) => {
    if (!accessToken) return;
    const fieldErrors: Record<string, string> = {};
    if (!values.title.trim()) fieldErrors.title = "Title is required.";
    if (!values.due_date) fieldErrors.due_date = "Select a due date.";
    if (!values.assigned_to || values.assigned_to.length === 0)
      fieldErrors.assigned_to = "Select at least one participant.";
    if (Object.keys(fieldErrors).length > 0) {
      setEditError(Object.values(fieldErrors).join(" "));
      return;
    }
    setEditError("");
    const res = await communityApi.updateAdminTask(accessToken, id, {
      title: values.title.trim(),
      description: values.description,
      due_date: values.due_date,
      status: values.status,
      assigned_to: values.assigned_to,
    });
    if (res.ok) {
      setEditOpen(false);
      void load();
    } else {
      setEditError(res.error?.message ?? "Failed to update task.");
    }
  };

  const handleComplete = async (id: string) => {
    if (!accessToken) return;
    const res = await communityApi.completeAdminTask(accessToken, id);
    if (res.ok) void load();
    else setError(res.error?.message ?? "Failed to mark task completed.");
  };

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    const res = await communityApi.deleteAdminTask(accessToken, id);
    if (res.ok) {
      setDeleteId(null);
      void load();
    } else {
      setDeleteError(res.error?.message ?? "Failed to delete task.");
    }
  };

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Task Management"
        description="Create, assign, track and complete tasks across programs. Assignees are shown by name — raw IDs stay internal."
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Tasks", href: "/admin/tasks" }]}
        actions={
          <Button
            onClick={() => {
              setCreateValues(EMPTY_CREATE);
              setCreateError("");
              setCreateOpen(true);
            }}
          >
            Create task
          </Button>
        }
      />

      {error && (
        <div className="rounded-lg border border-danger-soft bg-danger-soft p-4">
          <p className="text-sm font-semibold text-danger">{error}</p>
        </div>
      )}

      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1 sm:w-[200px]">
            <Field label="Program">
              <Select
                value={filterProgram}
                onChange={(e) => setFilterProgram(e.currentTarget.value)}
              >
                <option value="">All programs</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="flex-1 sm:w-[160px]">
            <Field label="Status">
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.currentTarget.value)}>
                <option value="">All statuses</option>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="flex-1">
            <Field label="Search" hint="Search by title or assignee name">
              <Input
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                placeholder="Search tasks…"
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-line bg-surface-raised text-xs font-semibold text-ink-secondary">
              <th className="p-4">Task</th>
              <th className="p-4">Assigned to</th>
              <th className="p-4">Program</th>
              <th className="p-4">Due date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const assignees = resolveAssignees(task.assigned_to);
              const statusKey = ((task.status as TaskStatus) ?? "pending") as TaskStatus;
              return (
                <tr key={task.id} className="border-b border-line/50 hover:bg-surface-raised/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-ink">{task.title}</div>
                    {task.description && (
                      <p className="mt-1 text-xs text-ink-secondary">{task.description}</p>
                    )}
                  </td>
                  <td className="p-4">
                    {assignees.length > 0 ? (
                      <div className="space-y-1">
                        {assignees.map((a, idx) => (
                          <div key={idx} className="font-medium text-ink truncate">
                            {escapeHtml(a.name)}
                          </div>
                        ))}
                        <div className="text-xs text-ink-secondary font-mono">
                          {assignees.map((a) => escapeHtml(a.email)).join(", ")}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-ink-secondary">Unknown participant</div>
                    )}
                  </td>
                  <td className="p-4 text-xs text-ink-secondary">
                    {programs.find((p) => p.id === task.program_id)?.name ?? "—"}
                  </td>
                  <td className="p-4 text-xs font-mono text-ink-secondary">
                    {task.due_date ?? "—"}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium border-transparent">
                      <StatusBadge status={task.status} />
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditId(task.id);
                        setEditValues({
                          title: task.title,
                          description: task.description,
                          program_id: task.program_id,
                          assigned_to: Array.isArray(task.assigned_to)
                            ? task.assigned_to
                            : task.assigned_to
                              ? [task.assigned_to]
                              : [],
                          due_date: task.due_date ?? "",
                        });
                        setEditError("");
                        setEditOpen(true);
                      }}
                      className="mr-2 text-xs text-ink-secondary hover:text-emerald"
                    >
                      Edit
                    </Button>
                    {statusKey !== "completed" ? (
                      <Button
                        size="sm"
                        onClick={() => void handleComplete(task.id)}
                        className="mr-2 text-xs text-emerald border border-emerald hover:bg-emerald hover:text-white"
                      >
                        Complete
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      onClick={() => {
                        setDeleteId(task.id);
                        setDeleteError("");
                      }}
                      className="text-xs text-ink-secondary hover:text-danger"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-secondary">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="mt-4 flex items-center justify-between text-xs text-ink-secondary">
          <p>Showing {tasks.length} of {meta.total} task(s) — page {meta.page} of {meta.totalPages}</p>
        </div>
      )}

      {/* Create task dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create task"
        submitLabel="Create task"
        onSubmit={() => handleCreate(createValues)}
      >
        <Field label="Title" required error={createValues.title ? undefined : "Title is required"}>
          <Input
            value={createValues.title}
            onChange={(e) => setCreateValues({ ...createValues, title: e.currentTarget.value })}
            required
          />
        </Field>
        <Field label="Description">
          <Textarea
            value={createValues.description}
            onChange={(e) => setCreateValues({ ...createValues, description: e.currentTarget.value })}
            rows={3}
          />
        </Field>
        <Field label="Program" required>
          <Select
            value={createValues.program_id}
            onChange={(e) => {
              setCreateValues({ ...createValues, program_id: e.currentTarget.value, assigned_to: [] });
            }}
            required
          >
            <option value="">Select a program</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Assign to" required hint="Select one or more active participants in the selected program">
          <Select
            multiple
            value={createValues.assigned_to}
            onChange={(e) => {
              setCreateValues({
                ...createValues,
                assigned_to: Array.from(e.currentTarget.selectedOptions, (o) => o.value),
              });
            }}
            required
          >
            <option value="">Select participants</option>
            {eligibleParticipants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.email}
              </option>
            ))}
            {eligibleParticipants.length === 0 && createValues.program_id && (
              <option value="" disabled>
                No eligible participants in this program
              </option>
            )}
          </Select>
        </Field>
        <Field label="Due date" required hint="ISO date, e.g. 2026-12-13">
          <Input
            type="date"
            value={createValues.due_date}
            onChange={(e) => setCreateValues({ ...createValues, due_date: e.currentTarget.value })}
            required
          />
        </Field>
        {createError && (
          <div className="rounded-md border border-danger-soft bg-danger-soft p-3 mt-2">
            <p className="text-sm text-danger">{createError}</p>
          </div>
        )}
      </Dialog>

      {/* Edit task dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit task"
        submitLabel="Save changes"
        onSubmit={() => {
          if (editId && editValues) {
            handleUpdate(editId, {
              ...editValues,
              status: editValues.status ?? "pending",
            });
          }
        }}
      >
        <Field label="Title" required>
          <Input
            value={editValues?.title ?? ""}
            onChange={(e) => setEditValues({ ...editValues!, title: e.currentTarget.value })}
            required
          />
        </Field>
        <Field label="Description">
          <Textarea
            value={editValues?.description ?? ""}
            onChange={(e) => setEditValues({ ...editValues!, description: e.currentTarget.value })}
            rows={3}
          />
        </Field>
        <Field label="Due date" hint="ISO date, e.g. 2026-12-13">
          <Input
            type="date"
            value={editValues?.due_date ?? ""}
            onChange={(e) => setEditValues({ ...editValues!, due_date: e.currentTarget.value })}
          />
        </Field>
        <Field label="Status">
          <Select
            value={(editValues as any)?.status ?? taskForEdit?.status ?? "pending"}
            onChange={(e) => setEditValues({ ...editValues!, status: e.currentTarget.value as TaskStatus })}
          >
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Reassign to">
          <Select
            multiple
            value={editValues?.assigned_to ?? (taskForEdit ? normalizeAssignees(taskForEdit.assigned_to) : [])}
            onChange={(e) => {
              setEditValues({
                ...editValues!,
                assigned_to: Array.from(e.currentTarget.selectedOptions, (o) => o.value),
              });
            }}
          >
            <option value="">Keep current</option>
            {eligibleParticipants.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — {p.email}</option>
            ))}
          </Select>
        </Field>
        {editError && (
          <div className="rounded-md border border-danger-soft bg-danger-soft p-3 mt-2">
            <p className="text-sm text-danger">{editError}</p>
          </div>
        )}
      </Dialog>

      {/* Delete confirmation dialog */}
      <ConfirmationDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete task"
        description="Are you sure you want to delete this task? This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => void handleDelete(deleteId!)}
        loading={deleteError ? false : undefined}
      />
    </div>
  );
}

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
