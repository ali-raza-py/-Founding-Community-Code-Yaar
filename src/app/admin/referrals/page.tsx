"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/lib/api/auth";
import { communityApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Breadcrumb } from "@/components/dashboard/page-header";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState, LoadingState } from "@/components/admin/shared";
import { ResponsiveTable, TableBody, TableCell, TableCellHeader, TableHeader, TableHead, TableRow } from "@/components/dashboard/responsive-table";

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
    <div className="space-y-8">
      <DashboardPageHeader
        title="Referral Registrations"
        description="Review and verify ambassador referral registrations."
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Referrals", href: "/admin/referrals" }]}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatisticCard title="Referral Codes" value={referrals.length} icon={<span className="size-5">🔗</span>} />
        <StatisticCard title="Total Registrations" value={totalRegistrations} icon={<span className="size-5">👤</span>} />
        <StatisticCard title="Verified" value={totalVerified} icon={<span className="size-5">✅</span>} />
        <StatisticCard title="Pending Verification" value={totalRegistrations - totalVerified} icon={<span className="size-5">⏳</span>} />
      </div>

      {/* Search */}
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex gap-3">
          <Field label="Search by email or referral code">
            <Input
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder="Email or referral code"
            />
          </Field>
        </div>
        <p className="type-caption mt-3 text-ink-secondary">
          Search is applied client-side across the currently loaded page.
        </p>
      </div>

      {/* Referrals table */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        {error ? (
          <ErrorState message={error} />
        ) : referrals.length === 0 ? (
          <EmptyState title="No referrals found" description="No referral registrations exist yet." />
        ) : (
          <ResponsiveTable caption="Referral registrations">
            <TableHead>
              <TableHeader>
                <TableCellHeader>Referral Code</TableCellHeader>
                <TableCellHeader>Registered Email</TableCellHeader>
                <TableCellHeader>Referral Owner</TableCellHeader>
                <TableCellHeader>Total</TableCellHeader>
                <TableCellHeader>Verified</TableCellHeader>
                <TableCellHeader className="text-right">Action</TableCellHeader>
              </TableHeader>
            </TableHead>
            <TableBody>
              {referrals.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="text-ink font-mono">{r.referral_code || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{r.participants?.profiles?.email || "—"}</TableCell>
                  <TableCell className="text-ink-muted">{r.participants?.profiles?.full_name || "—"}</TableCell>
                  <TableCell className="text-ink">{r.total_registrations ?? 0}</TableCell>
                  <TableCell className="text-ink">{r.verified_registrations ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => void handleVerify(r.id)}
                      disabled={verifyLoading === r.id}
                      size="sm"
                      variant={(r.verified_registrations ?? 0) >= (r.total_registrations ?? 0) ? "outline" : "primary"}
                    >
                      {verifyLoading === r.id ? "Verifying…" : "Verify"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </ResponsiveTable>
        )}
      </div>

      {meta && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[0.8125rem] text-ink-secondary">
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
    </div>
  );
}
