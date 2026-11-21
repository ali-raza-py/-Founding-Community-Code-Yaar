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
  EmptyState,
  ErrorState,
  LoadingState,
  AdminStatusBadge,
} from "@/components/admin/shared";

export default function AdminTasksPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [tasks, setTasks] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Task creation form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [programId, setProgramId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [createLoading, setCreateLoading] = useState(false);

  const loadTasks = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    const res = await communityApi.getMyTasks(accessToken);
    if (res.ok) {
      setTasks(res.data);
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  }, [accessToken]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!accessToken) return;

    if (!title || !description || !programId || !assignedTo || !dueDate) {
      setError("All fields are required.");
      return;
    }

    setCreateLoading(true);
    setError(null);

    const res = await communityApi.createAdminTask(accessToken, {
      title,
      description,
      program_id: programId,
      assigned_to: assignedTo,
      due_date: dueDate,
      status,
    });

    setCreateLoading(false);

    if (res.ok) {
      setTasks([res.data, ...tasks]);
      setTitle("");
      setDescription("");
      setProgramId("");
      setAssignedTo("");
      setDueDate("");
      setStatus("pending");
    } else {
      setError(res.error.message);
    }
  }, [accessToken, title, description, programId, assignedTo, dueDate, status, tasks]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <Section padded>
      <SectionInner>
        <SectionHeading
          eyebrow="Task Management"
          title="Task Assignments"
          description="Create and assign tasks to community participants."
        />

        {/* Create task form */}
        <div className="mt-8 rounded-xl border border-line bg-surface p-5 sm:p-6">
          <SectionHeading
            eyebrow="Create Task"
            title="Assign a New Task"
            description="Assign tasks to participants with due dates and priorities."
            tag="h3"
          />
          <form onSubmit={handleCreateTask} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Title" required>
              <Input
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                placeholder="Task title"
                required
              />
            </Field>
            <Field label="Description" required>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
                placeholder="Task description"
                required
                className="flex h-32 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald transition-colors"
              />
            </Field>
            <Field label="Program ID" required>
              <Input
                value={programId}
                onChange={(e) => setProgramId(e.currentTarget.value)}
                placeholder="Program UUID"
                required
              />
            </Field>
            <Field label="Assigned To (User ID)" required>
              <Input
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.currentTarget.value)}
                placeholder="User UUID"
                required
              />
            </Field>
            <Field label="Due Date" required>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.currentTarget.value)}
                required
                className="flex h-10 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald transition-colors"
              />
            </Field>
            <Field label="Status">
              <Select
                value={status}
                onChange={(e) => setStatus(e.currentTarget.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </Select>
            </Field>
            <div className="flex items-end col-span-2 lg:col-span-4">
              <Button type="submit" disabled={createLoading}>
                {createLoading ? "Creating…" : "Create Task"}
              </Button>
            </div>
          </form>
        </div>

        {/* Tasks list */}
        <div className="mt-10 rounded-xl border border-line bg-surface overflow-hidden">
          <div className="border-b border-line bg-surface-raised px-6 py-4">
            <SectionHeading
              eyebrow="Assigned Tasks"
              title="All Tasks"
              description="View tasks assigned to community members."
              tag="h3"
            />
          </div>

          {error ? (
            <ErrorState message={error} />
          ) : tasks.length === 0 ? (
            <div className="p-12 text-center">
              <p className="type-body text-ink-muted">No tasks found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-raised">
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Title</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Description</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Assigned To</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Due Date</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t: any) => (
                  <tr
                    key={t.id}
                    className="border-b border-line hover:bg-surface-raised transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-ink">
                      {t.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {t.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted font-mono">
                      {t.assigned_to}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {t.due_date ? new Date(t.due_date).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink">
                      <AdminStatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-line bg-surface p-4">
          <p className="type-label mb-2">Notes</p>
          <ul className="space-y-1 text-sm text-ink-muted">
            <li>
              Tasks are created via <code className="font-mono text-xs">POST /api/v1/admin/tasks</code>.
              The backend does not currently provide task update, completion, or deletion endpoints.
            </li>
            <li>
              Ensure the <code className="font-mono text-xs">assigned_to</code> user ID belongs to
              the correct programme — the backend does not enforce programme validation on task
              assignment.
            </li>
          </ul>
        </div>
      </SectionInner>
    </Section>
  );
}
