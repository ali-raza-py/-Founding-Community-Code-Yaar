import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { validateRedirectDestination } from "@/lib/auth-url";

/** Routes that require an authenticated session. */
const PROTECTED_ROUTES = ["/dashboard", "/admin"];

/** Auth routes that authenticated users should be redirected away from. */
const AUTH_ROUTES = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/callback",
  "/auth/forgot-password",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createSupabaseServerClient({
    getAll: () => request.cookies.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options as Record<string, unknown>);
      });
    },
  });

  if (!supabase) {
    // Supabase not configured: allow the request through; client-side auth
    // will surface a configuration error if needed.
    return response;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAuthenticated = Boolean(session);

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtected && !isAuthenticated) {
    const redirectTo = validateRedirectDestination(pathname) ?? "/dashboard";
    const signInUrl = new URL("/auth/sign-in", request.nextUrl.origin);
    signInUrl.searchParams.set("redirectTo", redirectTo);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*"],
};
