"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useBackendSession } from "@/hooks/use-backend-session";
import type { BackendAuthProfile } from "@/lib/auth";

type ProtectedShellProps = {
  children: (session: BackendAuthProfile) => ReactNode;
};

export function ProtectedShell({ children }: ProtectedShellProps) {
  const router = useRouter();
  const { data, isLoading } = useBackendSession();

  useEffect(() => {
    if (!isLoading && !data) {
      router.replace("/login");
      return;
    }

    if (!isLoading && data && !data.onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [data, isLoading, router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-muted">Checking your session...</p>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  return <>{children(data)}</>;
}
