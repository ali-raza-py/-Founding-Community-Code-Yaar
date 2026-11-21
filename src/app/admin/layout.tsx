"use client";

import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/layout";
import { useAuth } from "@/lib/api/auth";

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  // While auth state is being resolved, show a neutral loading state
  // to prevent flashing unauthorized content.
  if (isLoading) {
    return null;
  }

  // Redirect unauthenticated or non-admin users.
  if (!isAuthenticated || !isAdmin) {
    router.replace("/dashboard");
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
