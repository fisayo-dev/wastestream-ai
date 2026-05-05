import Link from "next/link";
import { ArrowRight, CheckCircle2, Factory, Recycle } from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const roleCards = [
  {
    title: "Waste Providers",
    icon: Factory,
    points: ["Create clean waste listings", "Track interest from recyclers", "Move recurring streams faster"],
  },
  {
    title: "Recyclers",
    icon: Recycle,
    points: ["Filter by material type", "Find nearby sellers", "Assess supply quality before pickup"],
  },
];

export function HomePage() {
  return (
    <main className="min-h-screen pb-10">
      <SiteHeader />
      <section className="px-4 pb-6 pt-10 md:px-8">
        <div className="mx-auto max-w-6xl px-6 py-14 text-center md:px-10 md:py-16">
          <div className="mx-auto h-1.5 w-28 rounded-full bg-linear-to-r from-transparent via-accent to-transparent" />
          <Badge className="mt-6 bg-accent/10 text-accent">AI marketplace for circular waste trade</Badge>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Move recyclable waste from scattered supply to verified demand.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg">
            WasteStream AI helps providers and recyclers classify, price, and match waste streams
            with a clean, practical workflow.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button variant="secondary" size="lg">
                Preview onboarding
              </Button>
            </Link>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            {[
              ["2.3k+", "Stream listings reviewed"],
              ["94%", "Matched inquiries resolved"],
              ["18h", "Average first response"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-border bg-card-strong px-4 py-4">
                <p className="text-2xl font-semibold">{value}</p>
                <p className="mt-1 text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Built to make waste trade legible, actionable, and fast.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "AI waste classification for cleaner listings",
              "Live pricing guidance based on demand and distance",
              "Local route intelligence for pickup planning",
              "Verified profiles with traceable activity",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <p className="text-sm md:text-base">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            A practical flow from material intake to completed deal.
          </h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Capture stream details",
                text: "Upload material type, volume, and pickup timing so listings start with clean context.",
                meta: "Step 01",
              },
              {
                title: "Get AI pricing guidance",
                text: "Normalize quality signals and expected price range with instant recommendations.",
                meta: "Step 02",
              },
              {
                title: "Confirm the best match",
                text: "Review matched recyclers or providers, then lock route and handoff details.",
                meta: "Step 03",
              },
            ].map((step, index) => (
              <li key={step.title} className="relative rounded-2xl border border-border bg-card p-5">
                {index < 2 ? (
                  <div className="pointer-events-none absolute -right-2 top-10 hidden h-px w-4 bg-border md:block" />
                ) : null}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-[#10210d]">
                    {index + 1}
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent/90">
                    {step.meta}
                  </p>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="roles" className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 lg:grid-cols-2">
            {roleCards.map((role) => {
              const Icon = role.icon;
              return (
                <div key={role.title} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge>{role.title}</Badge>
                      <h3 className="mt-4 text-2xl font-semibold tracking-tight">{role.title} onboarding</h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/12 text-accent">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    {role.points.map((point) => (
                      <div key={point} className="rounded-xl border border-border bg-card-strong px-4 py-3 text-sm text-muted">
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="px-4 pt-6 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 border-t border-border py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">WasteStream AI</p>
            <p className="mt-1 text-sm text-muted">Marketplace UI concept for providers and recyclers.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
