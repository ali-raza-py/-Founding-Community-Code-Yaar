"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, ListChecks, UserCheck } from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import type { TaskRecord } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Dialog } from "@/components/dashboard/dialog";
import { ConfirmationDialog } from "@/components/dashboard/confirmation-dialog";
import { LoadingState } from "@/components/admin/shared";
import {
  taskCreationSchema,
  type TaskCreationInput,
} from "@/lib/validation";

type TaskStatus = "pending" | "in_progress" | "completed" | "overdue";

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  overdue: "Overdue",
};

interface ProgramOption {
  id: string;
  name: string;
}

interface ParticipantOption {
  id: string;
  participantRecordId: string;
  userId: string;
  name: string;
  email: string;
  programId: string;
  status?: string | null;
}

interface FieldErrorMap {
  title?: string;
  description?: string;
  program_id?: string;
  assigned_to?: string;
  due_date?: string;
  status?: string;
  _form?: string;
}

function normalizeAssignees(assigned_to: string | string[] | undefined): string[] {
  if (!assigned_to) return [];
  return Array.isArray(assigned_to) ? assigned_to : [assigned_to];
}

function resolveAssignees(
  assigned_to: string | string[] | undefined,
  byId: Map<string, ParticipantOption>,
  byUserId: Map<string, ParticipantOption>,
): Array<{ id: string; name: string; email: string }> {
  const ids = normalizeAssignees(assigned_to);
  const resolved: Array<{ id: string; name: string; email: string }> = [];
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) continue;
    const p = byId.get(id) ?? byUserId.get(id);
    if (p) {
      seen.add(id);
      resolved.push({ id: p.id, name: p.name, email: p.email });
    }
  }
  return resolved;
}

function isSuccess(result: { success: boolean }): result is { success: true } {
  return result.success === true;
}

/** Validate that the selected assignee is an active participant in the
 * chosen programme. The database stores a single `assigned_to` user_id per
 * task, so the form must send one user_id (never an array, never a participant
 * record id). */
function assignedToError(
  assigned_to: string | undefined,
  eligible: ParticipantOption[],
): string | null {
  if (!assigned_to) {
    return "Select at least one eligible participant.";
  }
  if (!eligible.some((p) => p.userId === assigned_to)) {
    return "Select only an active participant in the chosen programme.";
  }
  return null;
}

export default function AdminTasksPage() {
  const { accessToken, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [meta, setMeta] = useState<{
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [participants, setParticipants] = useState<ParticipantOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterProgram, setFilterProgram] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const programById = useMemo(() => {
    const map = new Map<string, ProgramOption>();
    for (const p of programs) map.set(p.id, p);
    return map;
  }, [programs]);

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

  // ------------------------------------------------------------------
  // Create task state
  // ------------------------------------------------------------------
  const EMPTY_CREATE: TaskCreationInput = {
    title: "",
    description: "",
    program_id: "",
    assigned_to: "",
    due_date: "",
    status: "pending",
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [createValues, setCreateValues] = useState<TaskCreationInput>(EMPTY_CREATE);
  const [createErrors, setCreateErrors] = useState<FieldErrorMap>({});
  const [createFormError, setCreateFormError] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const eligibleParticipants = useMemo(() => {
    if (!createValues.program_id) return [];
    return participants.filter(
      (p) => p.programId === createValues.program_id && p.status === "active",
    );
  }, [createValues.program_id, participants]);

  // ------------------------------------------------------------------
  // Edit task state
  // ------------------------------------------------------------------
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<TaskCreationInput | undefined>(undefined);
  const [editErrors, setEditErrors] = useState<FieldErrorMap>({});
  const [editFormError, setEditFormError] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const taskForEdit = tasks.find((t) => t.id === editId);

  // ------------------------------------------------------------------
  // View task state
  // ------------------------------------------------------------------
  const [viewOpen, setViewOpen] = useState(false);
  const [viewTask, setViewTask] = useState<TaskRecord | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // ------------------------------------------------------------------
  // Delete task state
  // ------------------------------------------------------------------
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  // ------------------------------------------------------------------
  // Load
  // ------------------------------------------------------------------
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
            id: string;
            user_id: string;
            program_id: string;
            participant_status?: string;
            profiles?: { full_name: string | null; email: string | null } | null;
          }>;
          setParticipants(
            list.map((p) => ({
              id: p.id,
              participantRecordId: p.id,
              userId: p.user_id,
              name:
                p.profiles?.full_name ?? `Participant ${p.user_id.slice(0, 6)}`,
              email: p.profiles?.email ?? "",
              programId: p.program_id,
              status: p.participant_status ?? null,
            })),
          );
        }),
        communityApi.getAdminTasks(accessToken, {
          page,
          pageSize: 50,
          search: search || undefined,
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
  }, [accessToken, page, search, filterProgram, filterStatus]);

  useEffect(() => {
    void load();
  }, [load]);

  // Early returns must come after all hooks.
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <LoadingState />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  // ------------------------------------------------------------------
  // Validation helpers
  // ------------------------------------------------------------------
  const applyValidationErrors = (
    err: { reason?: string; message?: string; details?: Record<string, string[]> },
    setFieldErrors: React.Dispatch<React.SetStateAction<FieldErrorMap>>,
    setFormError: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const fieldErrors: FieldErrorMap = {};
    if (err.details && typeof err.details === "object") {
      for (const [key, messages] of Object.entries(err.details)) {
        if (Array.isArray(messages) && messages.length > 0) {
          fieldErrors[key as keyof FieldErrorMap] = messages[0];
        }
      }
    }
    setFieldErrors(fieldErrors);
    setFormError(err.message || "Request failed. Please check the highlighted fields.");
  };

  const validateCreate = (): boolean => {
    const result = taskCreationSchema.safeParse(createValues);
    if (!isSuccess(result)) {
      const fieldErrors: FieldErrorMap = {};
      if (!result.success) {
        for (const issue of result.error.issues) {
          const path = issue.path[0];
          if (path && typeof path === "string") {
            fieldErrors[path as keyof FieldErrorMap] = issue.message;
          }
        }
      }
      setCreateErrors(fieldErrors);
      setCreateFormError("Please fix the fields marked below.");
      return false;
    }
    setCreateErrors({});
    setCreateFormError("");
    const assigneeError = assignedToError(createValues.assigned_to, eligibleParticipants);
    if (assigneeError) {
      setCreateErrors({ assigned_to: assigneeError });
      setCreateFormError("Please fix the fields marked below.");
      return false;
    }
    return true;
  };

  const validateUpdate = (): boolean => {
    if (!editValues) return false;
    const result = taskCreationSchema.safeParse(editValues);
    if (!isSuccess(result)) {
      const fieldErrors: FieldErrorMap = {};
      if (!result.success) {
        for (const issue of result.error.issues) {
          const path = issue.path[0];
          if (path && typeof path === "string") {
            fieldErrors[path as keyof FieldErrorMap] = issue.message;
          }
        }
      }
      setEditErrors(fieldErrors);
      setEditFormError("Please fix the fields marked below.");
      return false;
    }
    setEditErrors({});
    setEditFormError("");
    const assigneeError = assignedToError(editValues.assigned_to, eligibleParticipants);
    if (assigneeError) {
      setEditErrors({ assigned_to: assigneeError });
      setEditFormError("Please fix the fields marked below.");
      return false;
    }
    return true;
  };

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------
  const handleCreate = async () => {
    if (!accessToken) return;
    if (!validateCreate()) return;
    setCreateSubmitting(true);
    setCreateErrors({});
    setCreateFormError("");
    try {
      const res = await communityApi.createAdminTask(accessToken, {
        title: createValues.title.trim(),
        description: createValues.description.trim(),
        program_id: createValues.program_id,
        assigned_to: createValues.assigned_to,
        due_date: createValues.due_date,
        status: createValues.status,
      });
      if (res.ok) {
        setCreateOpen(false);
        setCreateValues(EMPTY_CREATE);
        setCreateErrors({});
        setCreateFormError("");
        void load();
      } else {
        applyValidationErrors(res.error, setCreateErrors, setCreateFormError);
      }
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!accessToken || !editId || !editValues) return;
    if (!validateUpdate()) return;
    setEditSubmitting(true);
    setEditErrors({});
    setEditFormError("");
    try {
      const res = await communityApi.updateAdminTask(accessToken, editId, {
        title: editValues.title.trim(),
        description: editValues.description.trim(),
        program_id: editValues.program_id,
        assigned_to: editValues.assigned_to,
        due_date: editValues.due_date || null,
        status: editValues.status,
      });
      if (res.ok) {
        setEditOpen(false);
        setEditId(null);
        setEditValues(undefined);
        setEditErrors({});
        setEditFormError("");
        void load();
      } else {
        applyValidationErrors(res.error, setEditErrors, setEditFormError);
      }
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleComplete = async (id: string) => {
    if (!accessToken) return;
    const res = await communityApi.completeAdminTask(accessToken, id);
    if (res.ok) void load();
    else setError(res.error?.message ?? "Failed to mark task completed.");
  };

  const handleView = async (id: string) => {
    if (!accessToken) return;
    setViewTask(null);
    setViewLoading(true);
    setViewOpen(true);
    try {
      const res = await communityApi.getAdminTask(accessToken, id);
      if (res.ok) setViewTask(res.data);
      else setError(res.error?.message ?? "Failed to load task details.");
    } finally {
      setViewLoading(false);
    }
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

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  const filteredTotal = meta?.total ?? 0;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Task Management"
        description="Create, assign, track and complete tasks across programmes. Assignees are shown by name — raw IDs stay internal."
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Tasks", href: "/admin/tasks" },
        ]}
        actions={
          <Button
            onClick={() => {
              setCreateValues(EMPTY_CREATE);
              setCreateErrors({});
              setCreateFormError("");
              setCreateOpen(true);
            }}
          >
            <ListChecks className="mr-2 size-4" /> Create task
          </Button>
        }
      />

      {error && (
        <div className="rounded-lg border border-danger-soft bg-danger-soft p-4">
          <p className="text-sm font-semibold text-danger">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-4 items-end">
          <div className="sm:col-span-2">
            <Field label="Programme">
              <Select
                value={filterProgram}
                onChange={(e) => {
                  setFilterProgram(e.currentTarget.value);
                  setPage(1);
                }}
              >
                <option value="">All programmes</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div>
            <Field label="Status">
              <Select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.currentTarget.value);
                  setPage(1);
                }}
              >
                <option value="">All statuses</option>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Search" hint="Search by title or assignee name">
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.currentTarget.value);
                  setPage(1);
                }}
                placeholder="Search tasks…"
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="border-b border-line bg-surface-raised px-6 py-4 flex items-center justify-between">
          <div>
            <p className="type-label">Tasks</p>
            <p className="text-[0.8125rem] text-ink-secondary">
              {filteredTotal} task{filteredTotal !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <LoadingState />
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              title="No tasks found"
              description={
                !filterProgram && !filterStatus && !search
                  ? "There are no tasks yet. Create your first task to assign work to participants."
                  : "No tasks match your current filters. Try adjusting the search or filters."
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-raised text-xs font-semibold text-ink-secondary uppercase tracking-tight">
                  <th className="p-4">Task</th>
                  <th className="p-4">Assigned to</th>
                  <th className="p-4">Programme</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const assignees = resolveAssignees(
                    task.assigned_to,
                    participantById,
                    participantByUserId,
                  );
                  const statusKey = ((task.status as TaskStatus) ?? "pending") as TaskStatus;
                  const programName =
                    programById.get(task.program_id)?.name ?? task.program_name ?? "—";
                  return (
                    <tr
                      key={task.id}
                      className="border-b border-line/50 hover:bg-surface-raised/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-ink">{task.title}</div>
                        {task.description && (
                          <p className="mt-1 text-xs text-ink-secondary line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        {assignees.length > 0 ? (
                          <div className="space-y-1">
                            {assignees.map((a) => (
                              <div key={a.id} className="flex items-start gap-2">
                                <div className="flex-shrink-0 mt-0.5">
                                  <UserCheck className="size-3.5 text-ink-secondary" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-medium text-ink truncate">{a.name}</div>
                                  <div className="text-[0.75rem] text-ink-secondary truncate">
                                    {a.email}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {assignees.length > 1 && (
                              <div className="text-[0.75rem] text-ink-secondary font-medium mt-1">
                                +{assignees.length - 1} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-[0.75rem] text-ink-secondary">No assignees</div>
                        )}
                      </td>
                      <td className="p-4 text-xs text-ink-secondary">
                        {programName}
                      </td>
                      <td className="p-4 text-xs font-mono text-ink-secondary">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={statusKey} />
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(task.id)}
                          className="mr-2 text-xs text-ink-muted hover:text-emerald hover:border-emerald"
                          title="View task"
                        >
                          <Eye className="mr-1 size-3.5" /> View
                        </Button>
                        {statusKey !== "completed" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditId(task.id);
                                setEditValues({
                                  title: task.title,
                                  description: task.description,
                                  program_id: task.program_id,
                                  assigned_to: Array.isArray(task.assigned_to)
                                    ? task.assigned_to[0] ?? ""
                                    : task.assigned_to,
                                  due_date: task.due_date ?? "",
                                  status: statusKey,
                                });
                                setEditErrors({});
                                setEditFormError("");
                                setEditOpen(true);
                              }}
                              className="mr-2 text-xs text-ink-secondary hover:text-emerald hover:border-emerald"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => void handleComplete(task.id)}
                              className="mr-2 text-xs text-emerald border border-emerald hover:bg-emerald hover:text-white"
                            >
                              Complete
                            </Button>
                          </>
                        ) : null}
                        <Button
                          size="sm"
                          variant="ghost"
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
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="border-t border-line bg-surface px-6 py-4 flex items-center justify-between text-xs text-ink-secondary">
            <p>
              Showing {tasks.length} of {meta.total} task(s)
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-xs font-medium text-ink">
                Page {page} of {meta.totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create task dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create task"
        submitLabel="Create task"
        onSubmit={handleCreate}
        submitting={createSubmitting}
        error={createFormError || Object.values(createErrors).join(" ")}
      >
        <div className="space-y-6">
          {/* Section A — Basic Information */}
          <div className="rounded-lg border border-line bg-surface-raised p-4">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-tight mb-3">
              Section A · Basic information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Task title" required error={createErrors.title}>
                <Input
                  value={createValues.title}
                  onChange={(e) =>
                    setCreateValues({ ...createValues, title: e.currentTarget.value })
                  }
                  required
                  maxLength={200}
                />
              </Field>
              <Field label="Description" error={createErrors.description} hint="Short description shown in task lists">
                <Textarea
                  value={createValues.description}
                  onChange={(e) =>
                    setCreateValues({ ...createValues, description: e.currentTarget.value })
                  }
                  rows={3}
                />
              </Field>
            </div>
            {createErrors.title && (
              <p className="mt-2 text-[0.8125rem] text-danger font-medium" role="alert">
                {createErrors.title}
              </p>
            )}
          </div>

          {/* Section B — Target audience */}
          <div className="rounded-lg border border-line bg-surface-raised p-4">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-tight mb-3">
              Section B · Target audience
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Programme" required error={createErrors.program_id}>
                <Select
                  value={createValues.program_id}
                  onChange={(e) => {
                    setCreateValues({
                      ...createValues,
                      program_id: e.currentTarget.value,
                      assigned_to: "",
                    });
                  }}
                  required
                >
                  <option value="">Select a programme</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Assign to" required error={createErrors.assigned_to} hint="Select one active participant in the chosen programme">
                  <Select
                    value={createValues.assigned_to}
                    onChange={(e) =>
                      setCreateValues({ ...createValues, assigned_to: e.currentTarget.value })
                    }
                    required
                  >
                    <option value="">Select a participant</option>
                    {eligibleParticipants.map((p) => (
                      <option key={p.userId} value={p.userId}>
                        {p.name} — {p.email}
                      </option>
                    ))}
                  </Select>
                </Field>
                {createErrors.assigned_to && (
                  <p className="mt-1 text-[0.8125rem] text-danger font-medium" role="alert">
                    {createErrors.assigned_to}
                  </p>
                )}
                <p className="type-caption mt-2 text-ink-secondary">
                  {eligibleParticipants.length} eligible active participant{eligibleParticipants.length !== 1 ? "s" : ""} in this programme
                </p>
              </div>
            </div>
          </div>

          {/* Section C — Scheduling */}
          <div className="rounded-lg border border-line bg-surface-raised p-4">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-tight mb-3">
              Section C · Scheduling
            </h3>
            <Field label="Deadline" required error={createErrors.due_date} hint="The task must be completed by this date.">
              <Input
                type="date"
                value={createValues.due_date}
                onChange={(e) =>
                  setCreateValues({ ...createValues, due_date: e.currentTarget.value })
                }
                required
              />
            </Field>
            {createErrors.due_date && (
              <p className="mt-2 text-[0.8125rem] text-danger font-medium" role="alert">
                {createErrors.due_date}
              </p>
            )}
            <p className="type-caption mt-2 text-ink-secondary">
              The backend records a single deadline per task. A separate start date is not part
              of the task creation contract, so the deadline is validated as a real calendar date.
            </p>
          </div>

          {/* Section D — Priority and requirements */}
          <div className="rounded-lg border border-line bg-surface-raised p-4">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-tight mb-3">
              Section D · Priority and requirements
            </h3>
            <Field label="Initial status">
              <Select
                value={createValues.status}
                onChange={(e) =>
                  setCreateValues({ ...createValues, status: e.currentTarget.value as TaskCreationInput["status"] })
                }
              >
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Select>
            </Field>
            <p className="type-caption text-ink-secondary">
              Priority and submission requirements are set by the backend when the task is
              created and cannot be overridden from this form.
            </p>
          </div>

          {/* Section E — Review and publish */}
          <div className="rounded-lg border border-emerald bg-emerald-soft p-4">
            <h3 className="text-sm font-semibold text-emerald uppercase tracking-tight mb-3">
              Section E · Review before creating
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-line/50 pb-1">
                <span className="text-ink-secondary">Task</span>
                <span className="text-ink font-medium truncate max-w-[20rem]">
                  {createValues.title || "—"}
                </span>
              </div>
              <div className="flex justify-between border-b border-line/50 pb-1">
                <span className="text-ink-secondary">Programme</span>
                <span className="text-ink font-medium">
                  {programs.find((p) => p.id === createValues.program_id)?.name || "—"}
                </span>
              </div>
              <div className="flex justify-between border-b border-line/50 pb-1">
                <span className="text-ink-secondary">Assigned participants</span>
                <span className="text-ink font-medium">
                  {createValues.assigned_to.length === 0
                    ? "—"
                    : `${createValues.assigned_to.length} selected`}
                </span>
              </div>
              <div className="flex justify-between border-b border-line/50 pb-1">
                <span className="text-ink-secondary">Deadline</span>
                <span className="text-ink font-medium">
                  {createValues.due_date
                    ? new Date(createValues.due_date).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between border-b border-line/50 pb-1">
                <span className="text-ink-secondary">Status</span>
                <span className="text-ink font-medium">
                  {createValues.status ? STATUS_LABELS[createValues.status] : "—"}
                </span>
              </div>
            </div>
            <p className="type-caption mt-3 text-ink-secondary">
              Creating this task assigns it to the selected participants. It will appear in
              their dashboards immediately.
            </p>
          </div>
        </div>
      </Dialog>

      {/* Edit task dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit task"
        submitLabel="Save changes"
        onSubmit={handleUpdate}
        submitting={editSubmitting}
        error={editFormError || Object.values(editErrors).join(" ")}
      >
        <div className="space-y-4">
          <Field label="Task title" required error={editErrors.title}>
            <Input
              value={editValues?.title ?? ""}
              onChange={(e) =>
                setEditValues({ ...editValues!, title: e.currentTarget.value })
              }
              required
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={editValues?.description ?? ""}
              onChange={(e) =>
                setEditValues({ ...editValues!, description: e.currentTarget.value })
              }
              rows={3}
            />
          </Field>
          <Field label="Programme" required error={editErrors.program_id}>
            <Select
              value={editValues?.program_id ?? ""}
              onChange={(e) =>
                setEditValues({
                  ...editValues!,
                  program_id: e.currentTarget.value,
                  assigned_to: "",
                })
              }
              required
            >
              <option value="">Select a programme</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Reassign to" required error={editErrors.assigned_to} hint="Select one active participant in the chosen programme">
            <Select
              value={editValues?.assigned_to ?? ""}
              onChange={(e) =>
                setEditValues({ ...editValues!, assigned_to: e.currentTarget.value })
              }
              required
            >
              <option value="">Select a participant</option>
              {eligibleParticipants.map((p) => (
                <option key={p.userId} value={p.userId}>
                  {p.name} — {p.email}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Deadline" required error={editErrors.due_date}>
            <Input
              type="date"
              value={editValues?.due_date ?? ""}
              onChange={(e) =>
                setEditValues({ ...editValues!, due_date: e.currentTarget.value })
              }
              required
            />
          </Field>
          <Field label="Status">
            <Select
              value={editValues?.status ?? taskForEdit?.status ?? "pending"}
              onChange={(e) =>
                setEditValues({
                  ...editValues!,
                  status: e.currentTarget.value as TaskStatus,
                })
              }
            >
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
          </Field>
        </div>
      </Dialog>

      {/* View task dialog */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Task details"
        submitting={viewLoading}
      >
        {viewTask ? (
          <div className="space-y-4">
            <div>
              <p className="type-label">Task</p>
              <h4 className="font-semibold text-ink">{viewTask.title}</h4>
            </div>
            {viewTask.description && (
              <div>
                <p className="type-label">Description</p>
                <p className="text-ink-secondary whitespace-pre-line">{viewTask.description}</p>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="type-label">Programme</p>
                <p className="text-ink-secondary">
                  {programById.get(viewTask.program_id)?.name ?? viewTask.program_name ?? "—"}
                </p>
              </div>
              <div>
                <p className="type-label">Deadline</p>
                <p className="text-ink-secondary">
                  {viewTask.due_date
                    ? new Date(viewTask.due_date).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="type-label">Status</p>
                <StatusBadge status={viewTask.status} />
              </div>
              <div>
                <p className="type-label">Priority</p>
                <p className="text-ink-secondary">
                  {viewTask.priority ?? "—"}
                </p>
              </div>
            </div>
            <div>
              <p className="type-label">Assigned to</p>
              <div className="space-y-1">
                {resolveAssignees(viewTask.assigned_to, participantById, participantByUserId)
                  .map((a) => (
                    <div key={a.id} className="text-sm text-ink">
                      {a.name} <span className="text-ink-secondary">({a.email})</span>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <p className="type-label">Created</p>
              <p className="text-ink-secondary">
                {new Date(viewTask.created_at).toLocaleDateString()}
              </p>
            </div>
            {viewTask.submission_description && (
              <div>
                <p className="type-label">Submission</p>
                <p className="text-ink-secondary whitespace-pre-line">
                  {viewTask.submission_description}
                </p>
                {viewTask.submission_link && (
                  <a
                    href={viewTask.submission_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald underline text-sm"
                  >
                    View submission link
                  </a>
                )}
              </div>
            )}
            {viewTask.feedback && (
              <div>
                <p className="type-label">Feedback</p>
                <p className="text-ink-secondary whitespace-pre-line">{viewTask.feedback}</p>
              </div>
            )}
          </div>
        ) : null}
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
