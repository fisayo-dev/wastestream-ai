import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const apiBaseUrl =
  process.env.NEXT_BACKEND_PUBLIC_URL ?? "http://localhost:2300/v1";

const authProfileUrl = `${apiBaseUrl}/auth/profile`;

const authRoutes = new Set(["/login", "/signup"]);
const onboardingRoutes = new Set(["/onboard", "/onboarding"]);
const dashboardRoutes = ["/dashboard"];

async function getAuthState(request: NextRequest) {
  const cookie = request.headers.get("cookie");

  if (!cookie) {
    return null;
  }

  try {
    const response = await fetch(authProfileUrl, {
      headers: {
        cookie,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as {
      onboardingCompleted: boolean;
    };
  } catch {
    return null;
  }
}

function isDashboardRoute(pathname: string) {
  return dashboardRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isOnboardingRoute(pathname: string) {
  return Array.from(onboardingRoutes).some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute =
    isDashboardRoute(pathname) || isOnboardingRoute(pathname);
  const isAuthRoute = authRoutes.has(pathname);

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const authState = await getAuthState(request);

  if (!authState) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  if (isAuthRoute) {
    return NextResponse.redirect(
      new URL(
        authState.onboardingCompleted ? "/dashboard" : "/onboarding",
        request.url,
      ),
    );
  }

  if (isDashboardRoute(pathname) && !authState.onboardingCompleted) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (isOnboardingRoute(pathname) && authState.onboardingCompleted) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/onboard/:path*",
  ],
};
