"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { ProtectedShell } from "@/components/auth/protected-shell";
import { DashboardAppShell } from "@/components/dashboard/dashboard-app-shell";
import { Logo } from "@/components/site/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedShell>
      {(session) => (
        <div className="flex min-h-screen flex-col">
          <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
            <Logo />
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background hover:bg-accent"
            >
              <Menu className="h-5 w-5" />
            </button>
          </header>
          <div className="flex-1">
            <DashboardAppShell 
              session={session}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            >
              {children}
            </DashboardAppShell>
          </div>
        </div>
      )}
    </ProtectedShell>
  );
}
