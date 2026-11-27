"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Breadcrumb } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/shared";

export default function AdminAnnouncementsPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create announcement form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetProgramId, setTargetProgramId] = useState("");
  const [published, setPublished] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const loadAnnouncements = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    const res = await communityApi.getAnnouncements(accessToken);
    if (res.ok) {
      setAnnouncements(res.data);
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  }, [accessToken]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const handleCreateAnnouncement = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!accessToken) return;

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    setCreateLoading(true);
    setError(null);

    const res = await communityApi.createAdminAnnouncement(accessToken, {
      title,
      content,
      target_program_id: targetProgramId || undefined,
      published,
    });

    setCreateLoading(false);

    if (res.ok) {
      setAnnouncements([res.data, ...announcements]);
      setTitle("");
      setContent("");
      setTargetProgramId("");
      setPublished(false);
    } else {
      setError(res.error.message);
    }
  }, [accessToken, title, content, targetProgramId, published, announcements]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Community Announcements"
        description="Create and publish announcements to the Code Yaar community."
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Announcements", href: "/admin/announcements" }]}
      />

      {/* Create announcement form */}
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <p className="type-label">Create New Announcement</p>
            <p className="text-[0.8125rem] text-ink-secondary">Announcements are shown to all authenticated community members.</p>
          </div>
        </div>
        <form onSubmit={handleCreateAnnouncement} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Title" required>
            <Input
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              placeholder="Announcement title"
              required
            />
          </Field>
          <Field label="Content" required>
            <textarea
              value={content}
              onChange={(e) => setContent(e.currentTarget.value)}
              placeholder="Announcement content"
              required
              className="flex h-32 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald transition-colors"
            />
          </Field>
          <Field label="Target Programme (optional)">
            <Input
              value={targetProgramId}
              onChange={(e) => setTargetProgramId(e.currentTarget.value)}
              placeholder="Programme UUID (optional)"
            />
          </Field>
          <Field className="flex items-start gap-2">
            <input
              id="published"
              name="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.currentTarget.checked)}
              className="rounded border-line text-emerald focus-visible:ring-emerald mt-[3px] shrink-0"
            />
            <label htmlFor="published" className="text-sm leading-relaxed cursor-pointer text-ink">
              Publish immediately
            </label>
          </Field>
          <div className="flex items-end col-span-2 lg:col-span-4">
            <Button type="submit" disabled={createLoading}>
              {createLoading ? "Publishing…" : "Publish Announcement"}
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="rounded-lg border border-danger-soft bg-danger-soft p-4">
          <p className="text-sm font-semibold text-danger">{error}</p>
        </div>
      )}

      {/* Announcements list */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="border-b border-line bg-surface-raised px-6 py-4">
          <div>
            <p className="type-label">Published Announcements</p>
            <p className="text-[0.8125rem] text-ink-secondary">Announcements visible to community members.</p>
          </div>
        </div>

        {error ? (
          <ErrorState message={error} />
        ) : announcements.length === 0 ? (
          <div className="p-12 text-center">
            <p className="type-body text-ink-secondary">No announcements found.</p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {announcements.map((a: any) => (
              <div key={a.id} className="px-6 py-4 hover:bg-surface-raised transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-ink">{a.title}</h4>
                    <p className="mt-1 text-sm text-ink-secondary">{a.content}</p>
                    <p className="mt-2 text-[0.75rem] text-ink-secondary">
                      {a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={a.published ? "success" : "pending"} />
                    {a.target_program_id && (
                      <span className="text-[0.75rem] text-ink-secondary">
                        Targeted programme
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-line bg-surface p-4">
          <p className="type-label mb-2">Notes</p>
          <ul className="space-y-1 text-sm text-ink-secondary">
            <li>
              Announcements are created via <code className="font-mono text-xs">POST /api/v1/admin/announcements</code>.
              The backend supports <code className="font-mono text-xs">title</code>,
              <code className="font-mono text-xs">content</code>,
              <code className="font-mono text-xs">target_program_id</code>, and
              <code className="font-mono text-xs">published</code> fields.
            </li>
            <li>
              The backend does not currently provide announcement editing, deletion, or an
              admin draft listing endpoint. Published announcements are retrieved via
              <code className="font-mono text-xs">GET /api/v1/announcements</code>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
