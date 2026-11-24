"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, RotateCw, MailOpen } from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState } from "@/components/admin/shared";
import { type EmailListItem, PaginatedResponse } from "@/lib/api/types";
import { ConfirmDialog } from "./confirm-dialog";

interface FailedEmailsProps {
  refresh?: () => void;
}

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function FailedEmails({ refresh }: FailedEmailsProps) {
  const { accessToken } = useAuth();
  const [emails, setEmails] = useState<EmailListItem[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<EmailListItem>["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // Retry flow state
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [retryTarget, setRetryTarget] = useState<EmailListItem | null>(null);
  const [retryDialogOpen, setRetryDialogOpen] = useState(false);
  const [retryResult, setRetryResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const loadEmails = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    // Request all emails and isolate failed ones client-side. The backend is
    // the authority on retry authorization and idempotency.
    const res = await communityApi.getAdminEmails(accessToken, {
      page: currentPage,
      pageSize: 20,
      status: "failed",
      search: search || undefined,
      sortBy: "sent_at",
      sortDir: "desc",
    });
    if (res.ok) {
      setEmails(res.data.items);
      setMeta(res.data.meta);
    } else {
      setError(res.error.message || "Failed to load failed emails.");
      setEmails([]);
      setMeta(null);
    }
    setLoading(false);
  }, [accessToken, currentPage, search]);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  const openRetryDialog = (email: EmailListItem) => {
    setRetryResult(null);
    setRetryTarget(email);
    setRetryDialogOpen(true);
  };

  const handleConfirmRetry = useCallback(async () => {
    if (!accessToken || !retryTarget) return;
    setRetryDialogOpen(false);
    setRetryingId(retryTarget.id);
    setRetryResult(null);
    const res = await communityApi.postAdminEmailRetry(accessToken, retryTarget.id);
    setRetryingId(null);
    if (res.ok) {
      setRetryResult({
        success: true,
        message: `Retry accepted for ${retryTarget.recipient}.${res.data.messageId ? ` Provider message ID: ${res.data.messageId}` : ""}`,
      });
      // Refresh the failed list so the retried email is removed/updated.
      void loadEmails();
    } else {
      setRetryResult({
        success: false,
        message: res.error.message || "Failed to retry email.",
      });
    }
  }, [accessToken, retryTarget, loadEmails]);

  const failedEmails = emails.filter((e) => e.status === "failed");

  if (loading) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <SectionHeading
          eyebrow="Failed Emails"
          title="Failed Delivery"
          description="Emails that the provider failed to deliver, with retry support."
          tag="h2"
        />
        <div className="mt-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-md bg-surface-raised" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    const missing =
      error.includes("not configured") || error.includes("Route not found");
    return (
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <SectionHeading
          eyebrow="Failed Emails"
          title="Failed Delivery"
          description="Emails that the provider failed to deliver, with retry support."
          tag="h2"
        />
        <div className="mt-6 rounded-xl border border-destructive bg-danger-soft p-6">
          <div className="flex gap-3">
            <AlertCircle className="size-5 text-danger shrink-0" />
            <div>
              <p className="font-semibold text-danger">Failed emails unavailable</p>
              <p className="type-caption mt-1 text-ink-muted">
                {missing
                  ? "The email logs endpoint has not been implemented in the Founding Community API yet."
                  : error}
              </p>
            </div>
          </div>
        </div>
        {missing && refresh && (
          <div className="mt-6">
            <Button onClick={refresh} size="sm">
              Refresh
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <SectionHeading
            eyebrow="Failed Emails"
            title="Failed Delivery"
            description="Emails that the provider failed to deliver. Retry requires backend authorization."
            tag="h2"
          />
        </div>
        <div className="flex items-end gap-2">
          <Button
            onClick={() => void refresh?.()}
            disabled={loading}
            size="sm"
          >
            <RotateCw className="size-4 shrink-0" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
        <Field label="Search by recipient">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
              setCurrentPage(1);
            }}
            placeholder="Recipient email address"
          />
        </Field>
      </div>

      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        {failedEmails.length === 0 ? (
          <EmptyState
            title="No failed emails"
            description={
              error === null
                ? "No emails have failed delivery. Failed emails appear here when the provider reports a delivery failure."
                : ""
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-raised">
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Recipient</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Email Type</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Failure Reason</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Provider Response</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Sent At</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {failedEmails.map((email) => (
                  <tr
                    key={email.id}
                    className="border-b border-line hover:bg-surface-raised transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-ink">
                      {email.recipient}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {email.type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      <span className="font-mono text-[0.8125rem]">—</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      <span className="font-mono text-[0.8125rem]">—</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {email.sentAt ? formatDateTime(email.sentAt) : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <Button
                        onClick={() => openRetryDialog(email)}
                        disabled={retryingId === email.id}
                        size="sm"
                        variant="outline"
                      >
                        {retryingId === email.id ? "Retrying…" : "Retry Email"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {meta && failedEmails.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[0.8125rem] text-ink-muted">
            Showing {failedEmails.length} failed email(s)
          </p>
        </div>
      )}

      <ConfirmDialog
        open={retryDialogOpen}
        onClose={() => setRetryDialogOpen(false)}
        onConfirm={handleConfirmRetry}
        title="Retry failed email"
        description={
          <div className="flex flex-col gap-2">
            <p className="text-sm text-ink">
              Retry sending to <span className="font-medium">{retryTarget?.recipient}</span>
              ({retryTarget?.type.replace(/-/g, " ") || "email"}). The backend
              handles idempotency so the email is not sent twice.
            </p>
          </div>
        }
        confirmLabel="Retry email"
        loading={retryingId !== null}
        destructive
      />

      {retryResult && (
        <div className={cn(
          "mt-6 rounded-lg border p-4",
          retryResult.success
            ? "border-emerald bg-emerald-soft"
            : "border-destructive bg-danger-soft"
        )}>
          <div className="flex gap-3">
            {retryResult.success ? (
              <MailOpen className="size-5 text-emerald shrink-0" />
            ) : (
              <AlertCircle className="size-5 text-danger shrink-0" />
            )}
            <p className="text-sm">{retryResult.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
