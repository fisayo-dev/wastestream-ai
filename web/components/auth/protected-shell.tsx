"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useBackendSession } from "@/hooks/use-backend-session";
import type { BackendSession } from "@/lib/auth";

type ProtectedShellProps = {
  children: (session: BackendSession) => ReactNode;
};

export function ProtectedShell({ children }: ProtectedShellProps) {
  const router = useRouter();
  const { data, isLoading } = useBackendSession();

  useEffect(() => {
    if (!isLoading && !data) {
      router.replace("/login");
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
