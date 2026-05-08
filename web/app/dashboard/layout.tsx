"use client";

import { ProtectedShell } from "@/components/auth/protected-shell";
import { DashboardAppShell } from "@/components/dashboard/dashboard-app-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedShell>
      {(session) => <DashboardAppShell session={session}>{children}</DashboardAppShell>}
    </ProtectedShell>
  );
}
