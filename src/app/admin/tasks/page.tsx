"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import type { AdminProfile, TaskRecord } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Section, SectionInner } from "@/components/ui/section";
import { cn } from "@/lib/utils";

type ParticipantOption = {
  id: string;
  name: string;
  email: string;
  programId: string;
};

type TaskStatus = "pending" | "in_progress" | "completed" | "overdue";

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  overdue: "Overdue",
};

const STATUS_VARIANT: Record<TaskStatus, string> = {
  pending: "bg-surface-raised text-ink",
  in_progress: "bg-emerald-soft text-emerald",
  completed: "bg-success-soft text-success",
  overdue: "bg-danger-soft text-danger",
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

  // Resolve each task's assigned_to (participant id) to a readable name/email.
  const participantById = useMemo(() => {
    const map = new Map<string, ParticipantOption>();
    for (const p of participants) map.set(p.id, p);
    return map;
  }, [participants]);

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
            id: string; user_id: string; program_id: string;
          }>;
          // Profiles are fetched separately to resolve names without assuming
          // the participants endpoint joins them.
          return communityApi.getAdminProfiles(accessToken).then((pr) => {
            if (!pr.ok || !pr.data) return;
            const profiles = pr.data as AdminProfile[];
            const profileByUserId = new Map(profiles.map((prf) => [prf.id, prf]));
            const options = list.map((p) => {
              const profile = profileByUserId.get(p.user_id);
              return {
                id: p.id,
                name: profile?.full_name ?? "Unknown participant",
                email: profile?.email ?? "",
                programId: p.program_id,
              };
            });
            setParticipants(options);
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
  // Dialog state (declared before any early return so hooks run in order)
  // ------------------------------------------------------------------
  const EMPTY_CREATE = {
    title: "",
    description: "",
    program_id: "",
    assigned_to: "",
    due_date: "",
  } as const;

  const [createOpen, setCreateOpen] = useState(false);
  const [createValues, setCreateValues] = useState<{
    title: string;
    description: string;
    program_id: string;
    assigned_to: string;
    due_date: string;
  }>(EMPTY_CREATE);
  const [createError, setCreateError] = useState("");

  const eligibleParticipants = useMemo(() => {
    if (!createValues.program_id) return [];
    return participants.filter((p) => p.programId === createValues.program_id);
  }, [createValues.program_id, participants]);

  // ------------------------------------------------------------------
  // Edit task dialog state
  // ------------------------------------------------------------------
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    title: string;
    description: string;
    program_id: string;
    assigned_to: string;
    due_date: string;
    status?: TaskStatus;
  } | undefined>(undefined);
  const [editError, setEditError] = useState("");

  // ------------------------------------------------------------------
  // Delete confirmation state
  // ------------------------------------------------------------------
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const taskForEdit = tasks.find((t) => t.id === editId);

  useEffect(() => {
    void load();
  }, [load]);

  if (isLoading) {
    return (
      <Section padded>
        <SectionInner className="text-center py-24">
          <p className="type-body text-ink-muted">Loading task management…</p>
        </SectionInner>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Section padded>
        <SectionInner className="max-w-[42rem] text-center">
          <h2 className="mb-6">Task Management</h2>
          <p className="type-body mb-6">Sign in to manage tasks.</p>
          <Link href="/sign-in" className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald px-8 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">
            Sign in
          </Link>
        </SectionInner>
      </Section>
    );
  }

  const handleCreate = async (values: {
    title: string;
    description: string;
    program_id: string;
    assigned_to: string;
    due_date: string;
  }) => {
    if (!accessToken) return;
    const res = await communityApi.createAdminTask(accessToken, {
      title: values.title,
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
    assigned_to: string;
  }) => {
    if (!accessToken) return;
    const res = await communityApi.updateAdminTask(accessToken, id, {
      title: values.title,
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
    <Section padded>
      <SectionInner className="max-w-7xl">
        <div className="flex items-start justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-base font-semibold text-ink">Task Management</h2>
            <p className="type-caption text-ink-muted">
              Create, assign, track and complete tasks across programs.
              Assignees are shown by name — raw IDs stay internal.
            </p>
          </div>
          <Button
            onClick={() => {
              setCreateValues(EMPTY_CREATE);
              setCreateError("");
              setCreateOpen(true);
            }}
            className="rounded-md bg-emerald px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
          >
            Create task
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-danger-soft bg-danger-soft p-4">
            <p className="text-sm font-semibold text-danger">{error}</p>
          </div>
        )}

        <div className="rounded-lg border border-line bg-surface p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1 sm:w-[200px]">
              <Field label="Program" >
                <Select
                  value={filterProgram}
                  onChange={(e) => setFilterProgram(e.currentTarget.value)}
                >
                  <option value="">All programs</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
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

        <div className="rounded-lg border border-line bg-surface overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-surface-raised text-xs font-semibold text-ink-muted">
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
                const assignee = participantById.get(task.assigned_to);
                const statusKey = (task.status as TaskStatus) ?? "pending";
                return (
                  <tr key={task.id} className="border-b border-line/50 hover:bg-surface-raised/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-ink">{task.title}</div>
                      {task.description && (
                        <p className="mt-1 text-xs text-ink-muted">{task.description}</p>
                      )}
                    </td>
                    <td className="p-4">
                      {assignee ? (
                        <>
                          <div className="font-medium text-ink">{escapeHtml(assignee.name)}</div>
                          <div className="text-xs text-ink-muted font-mono">{escapeHtml(assignee.email)}</div>
                        </>
                      ) : (
                        <div className="text-xs text-ink-muted">Unknown participant</div>
                      )}
                    </td>
                    <td className="p-4 text-xs text-ink-muted">
                      {programs.find((p) => p.id === task.program_id)?.name ?? "—"}
                    </td>
                    <td className="p-4 text-xs font-mono text-ink-muted">
                      {task.due_date ?? "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${STATUS_VARIANT[statusKey]}`}
                      >
                        {STATUS_LABELS[statusKey]}
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
                            assigned_to: task.assigned_to,
                            due_date: task.due_date ?? "",
                          });
                          setEditError("");
                          setEditOpen(true);
                        }}
                        className="mr-2 text-xs text-ink-muted hover:text-emerald"
                      >
                        Edit
                      </Button>
                      {statusKey !== "completed" ? (
                        <Button
                          size="sm"
                          onClick={() => void handleComplete(task.id)}
                          className="mr-2 text-xs bg-emerald-soft text-emerald hover:bg-emerald"
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
                        className="text-xs text-ink-muted hover:text-danger"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink-muted">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {meta && (
          <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
            <p>Showing {tasks.length} of {meta.total} task(s) — page {meta.page} of {meta.totalPages}</p>
          </div>
        )}

        {/* Create task dialog */}
        <Dialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          title="Create task"
          submitLabel="Create task"
          submitting={false}
          error={createError}
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
                setCreateValues({ ...createValues, program_id: e.currentTarget.value, assigned_to: "" });
              }}
              required
            >
              <option value="">Select a program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Assign to" required hint="Search by name or email within the selected program">
            <Select
              value={createValues.assigned_to}
              onChange={(e) => setCreateValues({ ...createValues, assigned_to: e.currentTarget.value })}
              required
            >
              <option value="">Select a participant</option>
              {eligibleParticipants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.email}
                </option>
              ))}
              {eligibleParticipants.length === 0 && createValues.program_id && (
                <option value="" disabled>No eligible participants in this program</option>
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
        </Dialog>

        {/* Edit task dialog */}
        <Dialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          title="Edit task"
          submitLabel="Save changes"
          submitting={false}
          error={editError}
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
              value={editValues?.assigned_to ?? taskForEdit?.assigned_to ?? ""}
              onChange={(e) => setEditValues({ ...editValues!, assigned_to: e.currentTarget.value })}
            >
              <option value="">Keep current</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.email}</option>
              ))}
            </Select>
          </Field>
        </Dialog>

        {/* Delete confirmation dialog */}
        {deleteId && (
          <Dialog
            open={true}
            onClose={() => setDeleteId(null)}
            title="Delete task"
            submitLabel="Delete"
            submitting={false}
            error={deleteError}
            variant="danger"
            onSubmit={() => void handleDelete(deleteId!)}
          >
            <p className="type-body mb-4">
              Are you sure you want to delete this task? This cannot be undone.
            </p>
          </Dialog>
        )}
      </SectionInner>
    </Section>
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

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  submitting: boolean;
  error: string;
  variant?: "default" | "danger";
  onSubmit: () => void;
  children: React.ReactNode;
}

function Dialog({
  open,
  onClose,
  title,
  submitLabel,
  submitting,
  error,
  variant = "default",
  onSubmit,
  children,
}: DialogProps) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-surface shadow-lg"
      >
        <div className="flex items-start justify-between p-6 sm:p-8">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-ink-muted hover:bg-surface-raised transition-colors"
            aria-label="Close"
          >
            <span className="size-5">✕</span>
          </button>
        </div>
        <div className="border-t border-line p-6 sm:p-8 space-y-4">
          {error && (
            <div className="rounded-md border border-danger-soft bg-danger-soft p-3">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}
          {children}
          <div className="flex justify-end gap-2 pt-4 border-t border-line/50">
            <Button
              type="button"
              onClick={onClose}
              className="text-sm text-ink-muted hover:bg-surface-raised"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={submitting}
              className={`text-sm font-medium transition-colors hover:bg-surface-raised ${
                variant === "danger"
                  ? "text-danger border border-danger hover:bg-danger-soft"
                  : "bg-emerald text-white hover:bg-emerald-hover"
              }`}
            >
              {submitting ? "Working…" : submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
