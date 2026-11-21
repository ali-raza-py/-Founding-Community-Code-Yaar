"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/layout";
import { useAuth } from "@/lib/api/auth";

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect unauthenticated or non-admin users.
  if (isLoading || !mounted) {
    return null;
  }

  if (!isAuthenticated || !isAdmin) {
    router.replace("/dashboard");
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
