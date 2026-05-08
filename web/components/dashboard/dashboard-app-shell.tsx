"use client";

import { createContext, useContext, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  LayoutGrid,
  LogOut,
  Menu,
  PackageSearch,
  PanelLeftClose,
  Sparkles,
  User,
} from "lucide-react";

import { Logo } from "@/components/site/logo";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BackendAuthProfile } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { logoutUrl } from "@/lib/auth";

type DashboardSessionContextValue = {
  session: BackendAuthProfile;
};

const DashboardSessionContext = createContext<DashboardSessionContextValue | null>(
  null,
);

export function useDashboardSession() {
  const value = useContext(DashboardSessionContext);
  if (!value) {
    throw new Error("useDashboardSession must be used inside DashboardAppShell");
  }

  return value.session;
}

type DashboardAppShellProps = {
  session: BackendAuthProfile;
  children: React.ReactNode;
};

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Listings", href: "/dashboard/listings", icon: PackageSearch },
  { label: "Matches", href: "/dashboard/matches", icon: Sparkles },
  { label: "AI Insights", href: "/dashboard/ai-insights", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: User },
] as const;

export function DashboardAppShell({ session, children }: DashboardAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const roleLabel =
    session.personalProfile?.role === "recycler" ? "Recycler" : "Waste provider";
  const userInitials = session.user.name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  const currentLabel = useMemo(() => {
    const activeItem = navigation.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    );
    return activeItem?.label ?? "Dashboard";
  }, [pathname]);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch(logoutUrl, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <DashboardSessionContext.Provider value={{ session }}>
      <main className="min-h-screen p-4 md:p-6">
        <div className="mx-auto flex max-w-7xl gap-4 lg:gap-6">
          <aside
            className={cn(
              "fixed inset-y-4 left-4 z-40 flex w-[280px] flex-col rounded-2xl border border-border bg-card p-5 transition-transform lg:static lg:translate-x-0",
              sidebarOpen ? "translate-x-0" : "translate-x-[-120%]",
            )}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/6 lg:hidden"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-8 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm",
                      active
                        ? "bg-accent text-[#13210f]"
                        : "bg-white/4 text-muted hover:bg-white/8",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 rounded-xl border border-border bg-card-strong p-5">
              <Badge>{roleLabel} workspace</Badge>
              <p className="mt-4 text-2xl font-semibold">Marketplace-ready profile</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Your onboarding details power listing visibility, compatibility
                scoring, and pickup context.
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-8">
              <Button
                type="button"
                variant="secondary"
                className="justify-start"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </aside>

          <div className="flex-1 space-y-4">
            <header className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/6 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-sm text-muted">Command center</p>
                  <h1 className="text-xl font-semibold md:text-2xl">
                    {currentLabel}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/6"
                >
                  <Bell className="h-4 w-4" />
                </button>
                <Avatar>{userInitials}</Avatar>
              </div>
            </header>

            <div>{children}</div>
          </div>
        </div>
      </main>
    </DashboardSessionContext.Provider>
  );
}
