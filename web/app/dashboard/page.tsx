"use client";

import { ArrowRight, Leaf, MapPin, PackageSearch } from "lucide-react";
import { useDashboardSession } from "@/components/dashboard/dashboard-app-shell";
import { getDashboardHomeModel } from "@/components/dashboard/dashboard-mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const session = useDashboardSession();
  const data = getDashboardHomeModel(session);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4">
        <Card className="border border-border bg-card">
          <CardHeader>
            <Badge className="bg-accent/10 text-accent">Dashboard Home</Badge>
            <CardTitle className="text-3xl">
              This platform intelligently connects waste providers and recyclers.
            </CardTitle>
            <p className="text-sm leading-6 text-muted">
              Welcome back, {session.user.name}. Your role-aware command center
              keeps listings, demand, and insights in one place.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {data.stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-card-strong p-4"
                >
                  <p className="text-3xl font-semibold">{item.value}</p>
                  <p className="mt-2 text-sm text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader>
            <p className="text-sm text-muted">
              {data.role === "recycler" ? "Nearby Waste Listings" : "My Waste Listings"}
            </p>
            <CardTitle className="text-2xl">High-priority marketplace cards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.listings.map((listing) => (
              <div
                key={listing.id}
                className="rounded-2xl border border-border bg-card-strong p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{listing.wasteType}</p>
                    <p className="mt-1 text-sm text-muted">
                      {listing.quantity} • {listing.location}
                    </p>
                  </div>

                  {listing.matchScore ? (
                    <Badge className="bg-accent/10 text-accent">
                      {listing.matchScore}% Match
                    </Badge>
                  ) : null}

                  {listing.status ? (
                    <Badge className="capitalize">{listing.status}</Badge>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary">View</Button>
                  {data.role === "recycler" ? (
                    <Button>Accept interest</Button>
                  ) : (
                    <Button variant="secondary">Interested recyclers</Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <Card className="border border-border bg-card">
          <CardHeader>
            <p className="text-sm text-muted">{data.insightTitle}</p>
            <CardTitle className="text-2xl">{data.insightText}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted">{data.insightMeta}</p>
            <Button className="mt-4 w-full" variant="secondary">
              Open AI Insights
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader>
            <p className="text-sm text-muted">Quick context</p>
            <CardTitle className="text-2xl">What matters right now</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: MapPin, text: "Location-aware listing recommendations" },
              { icon: PackageSearch, text: "Waste categories from your profile" },
              { icon: Leaf, text: "Cleaner sorting improves deal value" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card-strong px-4 py-3"
              >
                <item.icon className="h-4 w-4 text-accent" />
                <p className="text-sm text-muted">{item.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
