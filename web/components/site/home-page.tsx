import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Footer from "./footer";

export function HomePage() {
  return (
    <main className="min-h-screen pb-10">
      <SiteHeader />
      <section className="px-4 pb-6 pt-10 md:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl  px-6 py-14 text-center md:px-10 md:py-16">
          <div className="mx-auto h-1.5 w-28 rounded-full to-transparent" />
          <Badge className="mt-6 bg-accent/10 text-accent">
            AI marketplace for circular waste trade
          </Badge>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
            Move recyclable waste from scattered supply to verified demand.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg">
            WasteStream AI helps providers and recyclers classify, price, and
            match waste streams with a clean, practical workflow.
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
        </div>
      </section>

      <section id="how-it-works" className="my-10 px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <h2 className="text-4xl font-semibold tracking-tight md:text-4xl text-center">
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
              <li
                key={step.title}
                className="relative isolate rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-3 ">
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

      <Footer />
    </main>
  );
}
