"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Task management now lives at /admin/operations (classroom-style workspace).
 * Keep /admin/tasks reachable and redirect it so existing links keep working.
 */
export default function AdminTasksRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    void router.replace("/admin/operations");
  }, [router]);

  return null;
}
