"use client";

import { ProtectedShell } from "@/components/auth/protected-shell";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardPage() {
  return <ProtectedShell>{(session) => <DashboardShell session={session} />}</ProtectedShell>;
}
