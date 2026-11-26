"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { getProgramConfig, type AdminParticipantItem } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState, ErrorState } from "@/components/admin/shared";
import { Badge } from "@/components/ui/badge";
import { type EmailListItem, type PaginatedResponse, type Recipient } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { Mail, User, Send, RotateCw } from "lucide-react";

const PAGE_SIZE = 25;

interface EmailRecipientRow {
  id: string;
  email: string;
  name: string;
  source: "participant" | "applicant";
  status: string | null;
  program: string | null;
  joinedAt: string | null;
}

interface EmailRecipientsProps {
  /** Called when the admin chooses to email the currently selected recipients.
   * Recipients are resolved from registered members / applicants (name + email). */
  onEmailSelected?: (recipients: Recipient[]) => void;
}

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function statusVariant(status: string | null) {
  if (!status) return "default";
  switch (status) {
    case "active":
    case "accepted":
      return "emerald";
    case "rejected":
    case "suspended":
      return "default";
    default:
      return "default";
  }
}

export function EmailRecipients({ onEmailSelected }: EmailRecipientsProps) {
  const { accessToken } = useAuth();
  const [view, setView] = useState<"members" | "applicants">("members");
  const [rows, setRows] = useState<EmailRecipientRow[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<EmailListItem>["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const pageRef = useRef(1);

  const foundingCohortProgramId = getProgramConfig().foundingCohort;

  const loadRows = useCallback(
    async (page = 1) => {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      setSelectedIds(new Set());
      setSelectAll(false);

      if (view === "members") {
        const res = await communityApi.getAdminParticipants(accessToken, {
          page,
          pageSize: PAGE_SIZE,
          search: search || undefined,
        });
        if (res.ok) {
          const items = (res.data.items ?? []).map(
            (item) => item as AdminParticipantItem
          ).map((item) => ({
            id: item.id,
            email: item.profiles?.email ?? "",
            name: item.profiles?.full_name ?? "Unnamed participant",
            source: "participant" as const,
            status: item.participant_status ?? null,
            program: item.programs?.name ?? null,
            joinedAt: item.joined_at ?? null,
          }));
          setRows(items.filter((item) => item.email.length > 0));
          setMeta(res.data.meta);
          pageRef.current = page;
        } else {
          setError(res.error.message || "Failed to load registered members.");
          setRows([]);
          setMeta(null);
        }
      } else {
        const res = await communityApi.getAdminApplications(accessToken, {
          page,
          pageSize: PAGE_SIZE,
          search: search || undefined,
          programId: foundingCohortProgramId || undefined,
          sortBy: "created_at",
          sortDir: "desc",
        });
        if (res.ok) {
          const items = (res.data.items ?? []).map((item) => ({
            id: item.id,
            email: item.email,
            name: item.applicant_name ?? "Unnamed applicant",
            source: "applicant" as const,
            status: item.application_status ?? null,
            program: item.programs?.name ?? null,
            joinedAt: item.created_at ?? null,
          }));
          setRows(items.filter((item) => item.email.length > 0));
          setMeta(res.data.meta);
          pageRef.current = page;
        } else {
          setError(res.error.message || "Failed to load founding cohort applicants.");
          setRows([]);
          setMeta(null);
        }
      }
      setLoading(false);
    },
    [accessToken, view, search, foundingCohortProgramId]
  );

  useEffect(() => {
    loadRows(1);
  }, [loadRows]);

  const selectedRecipients = useMemo<Recipient[]>(
    () => rows.filter((row) => selectedIds.has(row.id)).map((row) => ({ email: row.email, name: row.name })),
    [rows, selectedIds]
  );

  const isEndpointMissing =
    error === null &&
    loading === false &&
    rows.length === 0 &&
    meta === null;

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSelectAll(false);
  }, []);

  const toggleSelectAll = useCallback(() => {
    const pageIds = rows.map((row) => row.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
    setSelectAll(!allSelected);
  }, [rows, selectedIds]);

  const handleEmailSelected = useCallback(() => {
    if (selectedRecipients.length === 0) return;
    onEmailSelected?.([...selectedRecipients]);
  }, [selectedRecipients, onEmailSelected]);

  if (!accessToken) {
    return <ErrorState message="Authentication session not available." />;
  }

  const viewLabel = view === "members" ? "Registered members" : "Founding cohort applicants";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <SectionHeading
            eyebrow="Recipients"
            title="Recipient Directory"
            description="Select individual recipients from registered community members and founding cohort applicants. Selection carries over to Compose Email."
            tag="h2"
          />
        </div>
        <div className="flex items-end gap-2">
          <Button
            onClick={() => void loadRows(currentPage)}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            <RotateCw className="size-4 shrink-0" />
          </Button>
        </div>
      </div>

      {/* View switcher */}
      <div className="rounded-xl border border-line bg-surface p-1">
        <div className="flex">
          <Button
            onClick={() => setView("members")}
            variant={view === "members" ? "primary" : "outline"}
            size="sm"
            className="flex-1 rounded-none"
            disabled={loading}
          >
            <User className="size-3.5 shrink-0 mr-2" /> Registered members
          </Button>
          <Button
            onClick={() => setView("applicants")}
            variant={view === "applicants" ? "primary" : "outline"}
            size="sm"
            className="flex-1 rounded-none"
            disabled={loading}
          >
            <Mail className="size-3.5 shrink-0 mr-2" /> Founding cohort applicants
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
        <Field label={`Search ${viewLabel}`}>
          <Input
            value={String(search ?? "")}
            onChange={(event) => {
              setSearch(event.currentTarget.value);
              setCurrentPage(1);
            }}
            placeholder="Name or email address"
          />
        </Field>
      </div>

      {/* List */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        {error ? (
          <ErrorState message={error} onRetry={() => void loadRows(currentPage)} />
        ) : rows.length === 0 ? (
          <EmptyState
            title={`No ${viewLabel.toLowerCase()} found`}
            description={
              isEndpointMissing
                ? "The directory endpoint has not been implemented in the Community API yet."
                : "No records match your current search."
            }
            action={
              isEndpointMissing
                ? undefined
                : { label: "Clear search", href: "/admin/mail?tab=recipients" }
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-raised">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      disabled={rows.length === 0 || loading}
                      className="rounded-md border-line text-emerald focus-visible:ring-2 focus-visible:ring-emerald"
                      aria-label={`Select all ${rows.length} rows on this page`}
                    />
                  </th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Name</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Email</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Program</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Status</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Joined / Submitted</th>
                  <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted text-right">Select</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isSelected = selectedIds.has(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        "border-b border-line hover:bg-surface-raised transition-colors",
                        isSelected && "bg-emerald-soft"
                      )}
                    >
                      <td className="px-4 py-3 text-right">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(row.id)}
                          disabled={!row.email || loading}
                          className="rounded-md border-line text-emerald focus-visible:ring-2 focus-visible:ring-emerald"
                          aria-label={`Select ${row.email}`}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-ink">
                        {row.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted font-mono">
                        {row.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {row.program || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={statusVariant(row.status)}>
                          {row.status
                            ?.split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ") || "—"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {formatDateTime(row.joinedAt)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
                            isSelected
                              ? "border-emerald bg-emerald text-white"
                              : "border-line bg-surface-raised text-ink-muted"
                          )}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selection summary */}
      {selectedRecipients.length > 0 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-[0.8125rem] text-ink-muted">
            {selectedRecipients.length} recipient{selectedRecipients.length !== 1 ? "s" : ""} selected
          </p>
          {onEmailSelected && (
            <Button
              onClick={handleEmailSelected}
              disabled={loading}
            >
              <Send className="size-4 shrink-0 mr-2" />
              Email {selectedRecipients.length} selected
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {meta && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[0.8125rem] text-ink-muted">
            {meta.total} {viewLabel.toLowerCase()}&middot; Page {currentPage} of {meta.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                if (currentPage > 1) void loadRows(currentPage - 1);
              }}
              disabled={currentPage <= 1 || loading}
              size="sm"
            >
              Prev
            </Button>
            <Button
              onClick={() => {
                if (currentPage < meta.totalPages) void loadRows(currentPage + 1);
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
