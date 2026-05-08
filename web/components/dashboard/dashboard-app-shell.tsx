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

const DashboardSessionContext =
  createContext<DashboardSessionContextValue | null>(null);

export function useDashboardSession() {
  const value = useContext(DashboardSessionContext);
  if (!value) {
    throw new Error(
      "useDashboardSession must be used inside DashboardAppShell",
    );
  }

  return value.session;
}

type DashboardAppShellProps = {
  session: BackendAuthProfile;
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Listings", href: "/dashboard/listings", icon: PackageSearch },
  { label: "Matches", href: "/dashboard/matches", icon: Sparkles },
  { label: "AI Insights", href: "/dashboard/ai-insights", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: User },
] as const;

export function DashboardAppShell({
  session,
  children,
  sidebarOpen,
  setSidebarOpen,
}: DashboardAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const roleLabel =
    session.personalProfile?.role === "recycler" ?
      "Recycler"
    : "Waste provider";
  // const userInitials = session.user.name
  //   .split(" ")
  //   .map((part) => part[0]?.toUpperCase() ?? "")
  //   .join("")
  //   .slice(0, 2);

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
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="mx-auto flex max-w-7xl gap-4 lg:gap-6 relative">
          <aside
            className={cn(
              "fixed inset-y-4 left-4 z-40 flex h-[calc(100vh-2rem)] w-72 flex-col overflow-hidden rounded-2xl bg-card lg:bg-transparent p-2 transition-transform lg:sticky lg:top-4 lg:translate-x-0 border border-border lg:border-none",
              sidebarOpen ? "translate-x-0 shadow-xl" : "translate-x-[-120%]",
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
                  pathname === item.href 

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm",
                      active ?
                        "bg-accent text-[#13210f]"
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

            <div className="mt-8 p-3">
              <Badge>{roleLabel} workspace</Badge>
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
            <div>{children}</div>
          </div>
        </div>
      </div>
    </DashboardSessionContext.Provider>
  );
}
