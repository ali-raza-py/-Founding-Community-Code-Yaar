"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ErrorState, LoadingState } from "@/components/admin/shared";

export default function AdminTaskDetailPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id") ?? "";

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const loadTask = useCallback(async () => {
    if (!accessToken || !taskId) return;
    setLoading(true);
    setError(null);
    const res = await communityApi.getAdminTask(accessToken, taskId);
    if (res.ok) {
      setTask(res.data);
    } else {
      setError(res.error.message || "Task not found.");
    }
    setLoading(false);
  }, [accessToken, taskId]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleComplete = async () => {
    if (!accessToken || !taskId) return;
    setUpdateLoading(true);
    const res = await communityApi.completeAdminTask(accessToken, taskId);
    setUpdateLoading(false);
    if (res.ok) {
      setTask((prev: any) => (prev ? { ...prev, status: "completed" } : prev));
    } else {
      setError(res.error.message || "Failed to mark task complete.");
    }
  };

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (!taskId) {
    return <ErrorState message="No task ID provided." />;
  }

  if (error || !task) {
    return <ErrorState message={error || "Task not found."} />;
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Task details"
        description={task.title}
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Operations", href: "/admin/operations" },
          { label: "Task details", href: `/admin/operations/detail?id=${taskId}` },
        ]}
        actions={
          <Link href="/admin/operations" className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">
            <ArrowRight className="size-3.5" /> Back to operations
          </Link>
        }
      />

      {/* Header card */}
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="type-label">Task</p>
            <h1 className="text-xl font-semibold text-ink">{task.title}</h1>
            <p className="type-caption mt-1 text-ink-secondary">
              {task.description || "No description provided."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
            {task.status !== "completed" && (
              <Button
                onClick={handleComplete}
                disabled={updateLoading}
                className="text-sm"
              >
                {updateLoading ? "Updating…" : "Mark complete"}
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="type-label mb-1">Programme</p>
            <p className="text-sm font-medium text-ink">{task.program_name || "—"}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="type-label mb-1">Assigned participant</p>
            <p className="text-sm text-ink-muted font-mono break-all">
              {task.assigned_name || "Unassigned"} {task.assigned_email ? `• ${task.assigned_email}` : ""}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="type-label mb-1">Deadline</p>
            <p className="text-sm font-mono text-ink-muted">
              {task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="type-label mb-1">Status</p>
            <p className="text-sm text-ink-muted">
              {task.status.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
            </p>
          </div>
        </div>
      </div>

      {/* Submission & feedback */}
      {task.submission_description || task.submission_link || task.feedback && (
        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-base font-semibold text-ink mb-4">Submission &amp; feedback</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {task.submission_description && (
              <div className="rounded-lg border border-line bg-surface p-4">
                <p className="type-label mb-2">Submitted work</p>
                <p className="text-sm text-ink-secondary whitespace-pre-line">
                  {task.submission_description}
                </p>
              </div>
            )}
            {task.submission_link && (
              <div className="rounded-lg border border-line bg-surface p-4">
                <p className="type-label mb-2">Submission link</p>
                <a
                  href={task.submission_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-emerald hover:underline font-medium"
                >
                  Open submission <span className="size-3.5">→</span>
                </a>
              </div>
            )}
            {task.submitted_at && (
              <div className="rounded-lg border border-line bg-surface p-4">
                <p className="type-label mb-1">Submitted at</p>
                <p className="text-sm text-ink-muted font-mono">
                  {new Date(task.submitted_at).toLocaleString()}
                </p>
              </div>
            )}
            {task.feedback && (
              <div className="rounded-lg border border-line bg-surface p-4">
                <p className="type-label mb-2">Feedback</p>
                <p className="text-sm text-ink-secondary whitespace-pre-line">
                  {task.feedback}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-line bg-surface p-4">
        <p className="type-label mb-2">Created</p>
        <p className="text-sm text-ink-muted">
          {task.created_at ? new Date(task.created_at).toLocaleString() : "—"}
        </p>
      </div>
    </div>
  );
}
