"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * User & role management has moved to /admin/administration (SYSTEM section).
 * Keep /admin/users reachable and redirect it so existing links keep working.
 * Super Admin permissions are unchanged.
 */
export default function AdminUsersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    void router.replace("/admin/administration");
  }, [router]);

  return null;
}
