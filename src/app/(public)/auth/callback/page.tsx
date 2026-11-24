"use client";

import { Suspense } from "react";

import AuthCallbackPageClient from "./client";

/**
 * Auth callback route (email verification / password reset handling).
 *
 * The client component reads `searchParams` client-side; the Suspense boundary
 * allows static prerendering (next export) without forcing dynamic rendering
 * for this route.
 */
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p className="type-caption text-ink-muted">Confirming your email…</p>}>
      <AuthCallbackPageClient />
    </Suspense>
  );
}
