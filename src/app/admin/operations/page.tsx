"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ListChecks,
  Mail,
  Plus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState, LoadingState } from "@/components/admin/shared";
import { Dialog } from "@/components/dashboard/dialog";
import {
  ResponsiveTable,
  TableBody,
  TableCell,
  TableCellHeader,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/dashboard/responsive-table";
import { ParticipantSelector } from "@/components/participant/participant-selector";
import { taskCreationSchema } from "@/lib/validation";
import type { ApiClientError, AdminParticipantItem } from "@/lib/api/types";

type TaskStatus = "pending" | "in_progress" | "completed" | "overdue";

interface TaskCard {
  id: string;
  title: string;
  description: string | null;
  program_name: string | null;
  program_id: string | null;
  status: TaskStatus;
  due_date: string | null;
  assigned_name: string | null;
  assigned_email: string | null;
  created_at: string | null;
  feedback: string | null;
  submission_description: string | null;
  submission_link: string | null;
  submitted_at: string | null;
}

const STATUS_ORDER: TaskStatus[] = ["pending", "in_progress", "completed", "overdue"];

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Assigned",
  in_progress: "In progress",
  completed: "Completed",
  overdue: "Overdue",
};

export default function AdminOperationsPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskCard[]>([]);
  const [programs, setPrograms] = useState<Array<{ id: string; name: string }>>([]);
  const [participants, setParticipants] = useState<AdminParticipantItem[]>([]);
  const [profilesByUserId, setProfilesByUserId] = useState<Map<string, { full_name: string | null; email: string | null; role: string | null }>>(new Map());
  const [filterProgram, setFilterProgram] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "">("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Task creation dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createProgram, setCreateProgram] = useState("");
  const [createAssignedTo, setCreateAssignedTo] = useState<string>("");
  const [createDueDate, setCreateDueDate] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterProgram && t.program_id !== filterProgram) return false;
      if (filterStatus && t.status !== filterStatus) return false;
      const q = search.toLowerCase();
      if (q && !t.title.toLowerCase().includes(q) && !t.assigned_name?.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tasks, filterProgram, filterStatus, search]);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const [progRes, partRes, profRes, taskRes] = await Promise.all([
        communityApi.getAdminPrograms(accessToken),
        communityApi.getAdminParticipants(accessToken, { page: 1, pageSize: 200 }),
        communityApi.getAdminProfiles(accessToken),
        communityApi.getAdminTasks(accessToken, { page: 1, pageSize: 200 }),
      ]);
      if (progRes.ok) setPrograms(progRes.data.map((p) => ({ id: p.id, name: p.name })));
      if (partRes.ok) {
        setParticipants(partRes.data.items);
      }
      if (profRes.ok && profRes.data) {
        const profileList = (profRes.data as Array<{ id: string; full_name: string | null; email: string | null; role: string | null }>).map((p) => ({
          id: p.id,
          full_name: p.full_name,
          email: p.email,
          role: p.role ?? null,
        }));
        const map = new Map<string, { full_name: string | null; email: string | null; role: string | null }>();
        for (const p of profileList) map.set(p.id, p);
        setProfilesByUserId(map);
      }
      if (taskRes.ok) {
        setTasks(taskRes.data.items.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description ?? null,
          program_name: t.program_name ?? null,
          program_id: t.program_id ?? null,
          status: t.status as TaskStatus,
          due_date: t.due_date ?? null,
          assigned_name: t.assigned_name ?? null,
          assigned_email: t.assigned_email ?? null,
          created_at: t.created_at ?? null,
          feedback: t.feedback ?? null,
          submission_description: t.submission_description ?? null,
          submission_link: t.submission_link ?? null,
          submitted_at: t.submitted_at ?? null,
        })));
      }
    } catch {
      setError("Failed to load operations data.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const stats = {
    active: tasks.filter((t) => t.status === "in_progress").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    submissions: tasks.filter((t) => t.submission_description).length,
  };

  const handleCreateTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!accessToken) return;

    const parsed = taskCreationSchema.safeParse({
      title: createTitle,
      description: createDescription,
      program_id: createProgram,
      assigned_to: createAssignedTo,
      due_date: createDueDate,
    });
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setCreateErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).flatMap(([field, messages]) =>
            messages?.[0] ? [[field, messages[0]]] : [],
          ),
        ),
      );
      setCreateError(null);
      return;
    }

    setCreateLoading(true);
    setCreateError(null);
    setCreateErrors({});
    const res = await communityApi.createAdminTask(accessToken, {
      ...parsed.data,
    });
    setCreateLoading(false);
    if (res.ok) {
      setCreateOpen(false);
      setCreateTitle("");
      setCreateDescription("");
      setCreateProgram("");
      setCreateAssignedTo("");
      setCreateDueDate("");
      void load();
    } else {
      const details = res.error.details ?? {};
      const fieldErrors = Object.fromEntries(
        Object.entries(details).flatMap(([field, messages]) =>
          messages?.[0] ? [[field.replace(/\\.\\d+$/, ""), messages[0]]] : [],
        ),
      );
      setCreateErrors(fieldErrors);
      setCreateError(formatTaskCreateError(res.error, fieldErrors));
    }
  };

  const closeCreateDialog = () => {
    if (createLoading) return;
    setCreateOpen(false);
    setCreateError(null);
    setCreateErrors({});
  };

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Operations"
        description="Classroom-style task management workspace. Create, assign, review, and track tasks across programmes."
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Operations", href: "/admin/operations" }]}
        actions={
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <Plus className="size-4 mr-1.5" /> Create task
          </Button>
        }
      />

      {error && (
        <div className="rounded-md border border-danger-soft bg-danger-soft p-3 text-sm text-danger" role="alert">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatisticCard title="Active tasks" value={stats.active} icon={<ListChecks className="size-5" />} subtitle="In progress" />
        <StatisticCard title="Assigned" value={stats.pending} icon={<Clock className="size-5" />} subtitle="Not yet started" />
        <StatisticCard title="Completed" value={stats.completed} icon={<CheckCircle2 className="size-5" />} subtitle="Finished work" />
        <StatisticCard title="Overdue" value={stats.overdue} icon={<AlertCircle className="size-5" />} subtitle="Past deadline" />
        <StatisticCard title="Pending submissions" value={stats.submissions} icon={<Mail className="size-5" />} subtitle="Work submitted" />
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Field label="Programme" className="flex-1 lg:flex-[220px]">
            <Select
              defaultValue=""
              value={filterProgram}
              onChange={(event) => setFilterProgram(event.currentTarget.value)}
              className="w-full"
            >
              <option value="">All programmes</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status" className="flex-1 lg:flex-[180px]">
            <Select
              defaultValue=""
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.currentTarget.value as TaskStatus | "")}
              className="w-full"
            >
              <option value="">All statuses</option>
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Search" className="flex-1 lg:flex-[300px]">
            <Input
              placeholder="Search tasks or assignee..."
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              className="pl-10"
            />
          </Field>
          <Button
            onClick={() => {
              setFilterProgram("");
              setFilterStatus("");
              setSearch("");
            }}
            variant="outline"
            size="sm"
          >
            Clear
          </Button>
        </div>

        {/* Task table */}
        <div className="overflow-x-auto">
          {filteredTasks.length === 0 ? (
            <EmptyState
              title="No tasks"
              description="No tasks match the current filters."
            />
          ) : (
            <ResponsiveTable caption="Tasks">
              <TableHead>
                <TableHeader>
                  <TableCellHeader>Task</TableCellHeader>
                  <TableCellHeader>Programme</TableCellHeader>
                  <TableCellHeader>Assigned to</TableCellHeader>
                  <TableCellHeader>Deadline</TableCellHeader>
                  <TableCellHeader>Status</TableCellHeader>
                  <TableCellHeader className="text-right">Action</TableCellHeader>
                </TableHeader>
              </TableHead>
              <TableBody>
                {filteredTasks.map((t) => (
                  <TableRow key={t.id} onClick={() => void router.push(`/admin/operations/detail?id=${t.id}`)} className="cursor-pointer group">
                    <TableCell className="font-medium text-ink">{t.title}</TableCell>
                    <TableCell className="text-ink-muted">{t.program_name || "—"}</TableCell>
                    <TableCell className="text-ink-muted font-mono text-xs">
                      {t.assigned_name || "Unassigned"}
                    </TableCell>
                    <TableCell className="text-ink-muted font-mono text-xs">
                      {t.due_date ? new Date(t.due_date).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-[0.75rem] font-medium text-emerald group-hover:underline">
                        View
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ResponsiveTable>
          )}
        </div>
      </div>

      {/* Create task dialog */}
      <Dialog
        open={createOpen}
        onClose={closeCreateDialog}
        title="Create task"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={closeCreateDialog} disabled={createLoading}>
              Cancel
            </Button>
            <Button type="submit" form="create-task-form" disabled={createLoading}>
              {createLoading ? "Creating…" : "Create task"}
            </Button>
          </div>
        }
      >
        <form id="create-task-form" onSubmit={handleCreateTask} className="space-y-5">
          <Field label="Task title" required error={createErrors.title}>
            <Input
              value={createTitle}
              onChange={(event) => setCreateTitle(event.currentTarget.value)}
              placeholder="e.g. Build a landing page"
            />
          </Field>
          <Field label="Description / instructions" required error={createErrors.description}>
            <TextareaField
              value={createDescription}
              onValueChange={(v) => setCreateDescription(v)}
              placeholder="What should participants do?"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Programme" required error={createErrors.program_id}>
              <Select
                value={createProgram}
                onChange={(event) => {
                  setCreateProgram(event.currentTarget.value);
                  setCreateAssignedTo("");
                }}
                className="w-full"
              >
                <option value="">Select programme</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Due date" required error={createErrors.due_date}>
              <Input type="date" value={createDueDate} onChange={(event) => setCreateDueDate(event.currentTarget.value)} />
            </Field>
          </div>
          <Field label="Assign to participant(s)" required error={createErrors.assigned_to}>
            <ParticipantSelector
              participants={participants}
              profilesByUserId={profilesByUserId}
              value={createAssignedTo}
              onChange={setCreateAssignedTo}
              programFilter={createProgram || undefined}
              disabled={!createProgram || loading}
            />
            {!createProgram && (
              <p className="type-caption mt-1 text-ink-secondary">
                Select a programme first to see eligible participants.
              </p>
            )}
          </Field>
          {createError && (
            <div className="rounded-md border border-danger-soft bg-danger-soft p-3 text-danger text-sm">
              {createError}
            </div>
          )}
        </form>
      </Dialog>

    </div>
  );
};

function TextareaField({ value, onValueChange, placeholder }: { value: string; onValueChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder={placeholder}
      className="block w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-emerald transition-colors"
      rows={4}
    />
  );
}

function formatTaskCreateError(error: ApiClientError, fieldErrors: Record<string, string>): string | null {
  if (Object.keys(fieldErrors).length > 0) return "Please correct the highlighted fields.";
  if (error.message && error.message !== "Validation failed") return error.message;
  return "The task could not be created. Please review the highlighted fields and try again.";
}
