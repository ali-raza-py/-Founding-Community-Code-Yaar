"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, RotateCw, MailOpen } from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState, ErrorState } from "@/components/admin/shared";
import { Badge } from "@/components/ui/badge";
import {
  EmailListItem,
  EmailStatus,
  PaginatedResponse,
} from "@/lib/api/types";
import { EMAIL_STATUS_FILTER_OPTIONS, EMAIL_STATUS_LABELS, EMAIL_TYPE_FILTER_OPTIONS } from "./constants";
import { Skeleton } from "./skeleton";

interface EmailLogsProps {
  refresh?: () => void;
}

const PAGE_SIZE = 20;

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function statusBadge(status: EmailStatus | string) {
  const variant =
    status === "delivered" || status === "accepted" ? "emerald" : "default";
  return (
    <Badge variant={variant}>
      {EMAIL_STATUS_LABELS[status] ?? String(status)}
    </Badge>
  );
}

export function EmailLogs({ refresh }: EmailLogsProps) {
  const { accessToken } = useAuth();
  const [emails, setEmails] = useState<EmailListItem[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<EmailListItem>["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy] = useState<string>("sent_at");
  const [sortDir] = useState<"asc" | "desc">("desc");

  const loadEmails = useCallback(
    async (page = 1) => {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const res = await communityApi.getAdminEmails(accessToken, {
        page,
        pageSize: PAGE_SIZE,
        search: search || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
        sortBy,
        sortDir,
      });
      if (res.ok) {
        setEmails(res.data.items);
        setMeta(res.data.meta);
        setCurrentPage(page);
      } else {
        setError(res.error.message || "Failed to load email logs.");
        setEmails([]);
        setMeta(null);
      }
      setLoading(false);
    },
    [
      accessToken,
      search,
      typeFilter,
      statusFilter,
      dateFrom,
      dateTo,
      sortBy,
      sortDir,
    ]
  );

  useEffect(() => {
    loadEmails(1);
  }, [loadEmails]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.currentTarget.value);
      setCurrentPage(1);
    },
    []
  );

  if (loading) {
    return (
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="border-b border-line bg-surface-raised px-6 py-4">
          <Skeleton width="40%" height="1rem" />
        </div>
        <div className="p-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-md bg-surface-raised mb-3" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <ErrorState message={error} onRetry={() => void loadEmails(1)} />
      </div>
    );
  }

  const isEndpointMissing =
    error === null &&
    loading === false &&
    emails.length === 0 &&
    meta === null;

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading
          eyebrow="Email Activity"
          title="Email Logs"
          description="Searchable, filterable history of emails sent through the provider."
          tag="h2"
        />
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-4 lg:grid-cols-6">
          <Field label="Search by recipient">
            <Input
              value={String(search ?? "")}
              onChange={handleSearchChange}
              placeholder="Recipient email address"
            />
          </Field>
          <Field label="Email type">
            <Select
              value={String(typeFilter ?? "")}
              onChange={(event) => {
                setTypeFilter(event.currentTarget.value);
                setCurrentPage(1);
              }}
            >
              {EMAIL_TYPE_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select
              value={String(statusFilter ?? "")}
              onChange={(event) => {
                setStatusFilter(event.currentTarget.value);
                setCurrentPage(1);
              }}
            >
              {EMAIL_STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex items-end gap-2">
            <Field label="From">
              <Input type="date" value={String(dateFrom ?? "")} onChange={(e) => setDateFrom(e.currentTarget.value)} />
            </Field>
            <Field label="To">
              <Input type="date" value={String(dateTo ?? "")} onChange={(e) => setDateTo(e.currentTarget.value)} />
            </Field>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={() => void loadEmails(1)} disabled={loading}>
              <Search className="size-4 shrink-0 mr-2" /> Apply filters
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setTypeFilter("");
                setStatusFilter("");
                setDateFrom("");
                setDateTo("");
                void loadEmails(1);
              }}
              disabled={loading}
              size="sm"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar: refresh + status summary */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2 text-sm text-ink-muted">
          {EMAIL_STATUS_FILTER_OPTIONS.slice(1).map((option) => {
            const count = emails.filter(
              (e) => e.status === option.value
            ).length;
            return (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-line bg-surface text-xs"
              >
                <span className="font-semibold">{count}</span>{" "}
                {option.label}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => void refresh?.()}
            disabled={loading}
            size="sm"
          >
            <RotateCw className="size-4 shrink-0" />
            Refresh logs
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        {emails.length === 0 ? (
          <EmptyState
            title="No email logs found"
            description={
              isEndpointMissing
                ? "The email logs endpoint has not been implemented in the Founding Community API yet."
                : "No emails match your current filters."
            }
            action={
              isEndpointMissing
                ? undefined
                : { label: "Clear filters", href: "/admin/emails" }
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-raised">
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Recipient</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Email Type</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Subject</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Status</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Provider</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Sent At</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => (
                  <tr
                    key={email.id}
                    className="border-b border-line hover:bg-surface-raised transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-ink font-medium">
                      {email.recipient}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {email.type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {email.subject || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">{statusBadge(email.status)}</td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {email.provider}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {email.sentAt ? formatDateTime(email.sentAt) : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <LinkToDetail id={email.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[0.8125rem] text-ink-muted">
            {meta.total} emails &middot; Page {currentPage} of {meta.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                if (currentPage > 1) void loadEmails(currentPage - 1);
              }}
              disabled={currentPage <= 1 || loading}
              size="sm"
            >
              Prev
            </Button>
            <Button
              onClick={() => {
                if (currentPage < meta.totalPages) void loadEmails(currentPage + 1);
              }}
              disabled={currentPage >= meta.totalPages || loading}
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

function LinkToDetail({ id }: { id: string }) {
  return (
    <a
      href={`/admin/emails/detail?id=${encodeURIComponent(id)}`}
      className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
    >
      View <MailOpen className="size-3 shrink-0" /> Details
    </a>
  );
}
