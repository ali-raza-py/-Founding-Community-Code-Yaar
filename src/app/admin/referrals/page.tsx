"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  StatCard,
  EmptyState,
  ErrorState,
  LoadingState,
  AdminStatusBadge,
} from "@/components/admin/shared";

export default function AdminReferralsPage() {
  const { accessToken, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [referrals, setReferrals] = useState<Array<any>>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const pageRef = useRef(1);
  const [verifyLoading, setVerifyLoading] = useState<string | null>(null);

  const loadReferrals = useCallback(async (page = 1) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    const res = await communityApi.getAdminReferrals(accessToken, {
      page,
      pageSize: 20,
    });
    if (res.ok) {
      setReferrals(res.data.items);
      setMeta(res.data.meta);
      pageRef.current = page;
    } else {
      setError(res.error.message);
    }
    setLoading(false);
  }, [accessToken]);

  useEffect(() => {
    loadReferrals(1);
  }, [loadReferrals]);

  const handleVerify = useCallback(async (id: string) => {
    setVerifyLoading(id);
    const res = await communityApi.verifyAdminReferral(accessToken!, id);
    setVerifyLoading(null);
    if (res.ok) {
      setReferrals((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, verified_registrations: (r.verified_registrations ?? 0) + 1 } : r,
        ),
      );
    } else {
      setError(res.error.message);
    }
  }, [accessToken]);

  if (isLoading || loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const totalRegistrations = referrals.reduce((sum, r) => sum + (r.total_registrations ?? 0), 0);
  const totalVerified = referrals.reduce((sum, r) => sum + (r.verified_registrations ?? 0), 0);

  return (
    <Section padded>
      <SectionInner>
        <SectionHeading
          eyebrow="Referral Management"
          title="Referral Registrations"
          description="Review and verify ambassador referral registrations."
        />

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <StatCard title="Referral Codes" value={referrals.length} />
          <StatCard title="Total Registrations" value={totalRegistrations} />
          <StatCard title="Verified" value={totalVerified} />
          <StatCard title="Pending Verification" value={totalRegistrations - totalVerified} />
        </div>

        {/* Search */}
        <div className="mt-8 rounded-xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex gap-3">
            <Field label="Search by email or referral code">
              <Input
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                placeholder="Email or referral code"
              />
            </Field>
          </div>
        </div>

        {/* Referrals table */}
        <div className="mt-8 rounded-xl border border-line bg-surface overflow-hidden">
          {error ? (
            <ErrorState message={error} />
          ) : referrals.length === 0 ? (
            <EmptyState title="No referrals found" description="No referral registrations exist yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line bg-surface-raised">
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Referral Code</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Registered Email</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Referral Owner</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Total</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted">Verified</th>
                    <th className="px-4 py-3 text-[0.8125rem] font-semibold text-ink-muted text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r: any) => (
                    <tr
                      key={r.id}
                      className="border-b border-line hover:bg-surface-raised transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-ink font-mono">
                        {r.referral_code || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {r.participants?.profiles?.email || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {r.participants?.profiles?.full_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink">
                        {r.total_registrations ?? 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink">
                        {r.verified_registrations ?? 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <Button
                          onClick={() => void handleVerify(r.id)}
                          disabled={verifyLoading === r.id}
                          size="sm"
                          variant={r.verified_registrations === (r.total_registrations ?? 0) ? "outline" : "primary"}
                        >
                          {verifyLoading === r.id ? "Verifying…" : "Verify"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {meta && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-[0.8125rem] text-ink-muted">
              {meta.total} referrals &middot; Page {meta.page} of {meta.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  if (pageRef.current > 1) void loadReferrals(pageRef.current - 1);
                }}
                disabled={pageRef.current <= 1 || loading}
                size="sm"
              >
                Prev
              </Button>
              <Button
                onClick={() => {
                  if (pageRef.current < meta.totalPages) void loadReferrals(pageRef.current + 1);
                }}
                disabled={pageRef.current >= meta.totalPages || loading}
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </SectionInner>
    </Section>
  );
}
