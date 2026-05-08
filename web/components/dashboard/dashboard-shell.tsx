"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  CircleDollarSign,
  LayoutGrid,
  LineChart,
  LogOut,
  Menu,
  MessageSquareMore,
  PackageSearch,
  PanelLeftClose,
  Route,
  Settings,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import type { BackendAuthProfile } from "@/lib/auth";
import { logoutUrl } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Overview", icon: LayoutGrid, active: true },
  { label: "Listings", icon: PackageSearch },
  { label: "Matches", icon: Sparkles },
  { label: "Routes", icon: Route },
  { label: "Settings", icon: Settings },
];

const overviewStats = [
  { value: "12", label: "Active listings", icon: PackageSearch },
  { value: "27", label: "Qualified matches", icon: Sparkles },
  { value: "8", label: "Scheduled pickups", icon: Truck },
  { value: "₦4.8M", label: "Estimated trade value", icon: CircleDollarSign },
];

const quickActions = [
  { label: "Create listing", icon: Sparkles },
  { label: "Review routes", icon: Route },
  { label: "Pricing insight", icon: LineChart },
  { label: "Open messages", icon: MessageSquareMore },
];

type DashboardShellProps = {
  session: BackendAuthProfile;
};

export function DashboardShell({ session }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const userInitials = session.user.name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto flex max-w-6xl gap-4 lg:gap-6">
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
              return (
                <button
                  key={item.label}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-sm",
                    item.active ? "bg-accent text-[#13210f]" : "bg-white/4 text-muted hover:bg-white/8",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-xl border border-border bg-card-strong p-5">
            <Badge>Marketplace score</Badge>
            <p className="mt-4 text-4xl font-semibold">89</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Strong profile completeness, recent activity, and response quality.
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-2 pt-8">
            {[
              { label: "Team", icon: Users },
              { label: "Support", icon: MessageSquareMore },
              { label: "Logout", icon: LogOut },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={
                    item.label === "Logout"
                      ? async () => {
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
                      : undefined
                  }
                  className="flex items-center gap-3 rounded-[18px] px-3 py-3 text-sm text-muted hover:bg-white/6"
                >
                  <Icon className="h-4 w-4" />
                  {item.label === "Logout" && isLoggingOut ? "Logging out..." : item.label}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/6 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-sm text-muted">Dashboard</p>
                <h1 className="text-xl font-semibold md:text-2xl">WasteStream command center</h1>
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
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <Badge>Operations overview</Badge>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                      Good afternoon, {session.user.name}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                      Monitor active waste listings, recycler responses, and route-ready deals in one place.
                    </p>
                  </div>
                  <Button variant="secondary" disabled>
                    Profile live
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {overviewStats.map(({ value, label, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-border bg-card-strong p-5">
                      <Icon className="h-5 w-5 text-accent" />
                      <p className="mt-5 text-3xl font-semibold">{value}</p>
                      <p className="mt-2 text-sm text-muted">{label}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Trade activity</p>
                    <h3 className="mt-1 text-2xl font-semibold">Marketplace movement</h3>
                  </div>
                  <Badge>Last 30 days</Badge>
                </div>
                <div className="mt-8 grid h-72 grid-cols-8 gap-3">
                  {[48, 66, 42, 81, 59, 90, 54, 72].map((height, index) => (
                    <div key={index} className="flex items-end rounded-xl bg-card-strong p-2">
                      <div
                        className="w-full rounded-full bg-linear-to-t from-accent via-[#e4ffca] to-white"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-4">
              <section className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Account status</p>
                    <p className="mt-1 text-2xl font-semibold">Profile verified</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">
                  Your company details, materials, and route zones are complete. You are ready to trade.
                </p>
              </section>

              <section className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Top match</p>
                    <p className="mt-1 text-2xl font-semibold">Lagos PET Recovery</p>
                  </div>
                  <Badge>91% fit</Badge>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    "Accepts baled plastic with weekly pickup",
                    "Located within your preferred collection radius",
                    "Recent acceptance rate above marketplace average",
                  ].map((point) => (
                    <div key={point} className="rounded-xl border border-border bg-card-strong px-4 py-3 text-sm text-muted">
                      {point}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm text-muted">Quick actions</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {quickActions.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      className="rounded-xl border border-border bg-card-strong p-4 text-left hover:bg-white/6"
                    >
                      <Icon className="h-5 w-5 text-accent" />
                      <p className="mt-4 text-sm font-medium">{label}</p>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
