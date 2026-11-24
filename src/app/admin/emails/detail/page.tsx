"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ErrorState } from "@/components/admin/shared";
import { Badge } from "@/components/ui/badge";
import { type EmailDetail } from "@/lib/api/types";
import { EMAIL_STATUS_LABELS } from "@/components/admin/emails/constants";

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function statusVariant(status: string) {
  switch (status) {
    case "delivered":
    case "accepted":
      return "emerald";
    case "failed":
      return "default";
    default:
      return "default";
  }
}

export default function AdminEmailDetailPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [email, setEmail] = useState<EmailDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadEmail = useCallback(async () => {
    if (!accessToken || !id) return;
    setError(null);
    const res = await communityApi.getAdminEmail(accessToken, id);
    if (res.ok) {
      setEmail(res.data);
    } else {
      setError(res.error.message || "Failed to load email details.");
    }
  }, [accessToken, id]);

  useEffect(() => {
    loadEmail();
  }, [loadEmail]);

  if (isLoading) return null;
  if (!isAuthenticated || !isAdmin) return null;
  if (!id) return <ErrorState message="No email ID provided." />;
  if (error || !email) {
    return <ErrorState message={error || "Email not found."} />;
  }

  return (
    <Section padded>
      <SectionInner>
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <SectionHeading
              eyebrow="Email Details"
              title={email.subject || "Untitled Email"}
              description={`Recipient: ${email.recipient}`}
              tag="h2"
            />
          </div>
          <div className="flex items-end gap-3">
            <Link
              href="/admin/emails"
              className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised hover:text-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              <ArrowLeft className="size-3.5 shrink-0" /> Back to email logs
            </Link>
            <Badge variant={statusVariant(email.status)}>
              {EMAIL_STATUS_LABELS[email.status] ?? email.status}
            </Badge>
          </div>
        </div>

        {/* Email details grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <p className="type-label">Recipient</p>
            <p className="text-sm font-semibold text-ink break-all">
              {email.recipient}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <p className="type-label">Email Type</p>
            <p className="text-sm text-ink-muted break-all">
              {email.type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "—"}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <p className="type-label">Subject</p>
            <p className="text-sm text-ink-muted break-all">
              {email.subject || "—"}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <p className="type-label">Provider</p>
            <p className="text-sm font-semibold text-ink">
              {email.provider.charAt(0).toUpperCase() + email.provider.slice(1)}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6 lg:col-span-2">
            <p className="type-label">Provider Message ID</p>
            <p className="text-sm text-ink-muted font-mono break-all">
              {email.messageId || "—"}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <p className="type-label">Delivery Status</p>
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant(email.status)}>
                {EMAIL_STATUS_LABELS[email.status] ?? email.status}
              </Badge>
              <span className="ml-auto text-[0.8125rem] text-ink-muted">
                {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <p className="type-label">Created</p>
            <p className="text-sm text-ink-muted">
              {formatDateTime(email.createdAt)}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <p className="type-label">Accepted</p>
            <p className="text-sm text-ink-muted">
              {email.acceptedAt ? formatDateTime(email.acceptedAt) : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <p className="type-label">Delivered</p>
            <p className="text-sm text-ink-muted">
              {email.deliveredAt ? formatDateTime(email.deliveredAt) : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 sm:p-6 lg:col-span-2">
            <p className="type-label">Failure Reason</p>
            <p className="text-sm text-ink-muted break-all">
              {email.failureReason || "—"}
            </p>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-10 rounded-xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex gap-3">
            <ShieldCheck className="size-5 text-emerald shrink-0" />
            <div>
              <p className="font-semibold text-ink">Private data is not displayed</p>
              <p className="type-caption mt-1 text-ink-muted">
                API keys, SMTP credentials, and authentication tokens are never
                stored or shown in this interface. Only provider-reported
                delivery metadata is presented here.
              </p>
            </div>
          </div>
        </div>
      </SectionInner>
    </Section>
  );
}
