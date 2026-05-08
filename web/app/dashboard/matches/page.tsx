"use client";

import { CheckCircle2 } from "lucide-react";
import { getMatches } from "@/components/dashboard/dashboard-mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MatchesPage() {
  const matches = getMatches();

  return (
    <div className="space-y-4">
      <Card className="border border-border bg-card">
        <CardHeader>
          <p className="text-sm text-muted">Connection pipeline</p>
          <CardTitle className="text-2xl">Matches</CardTitle>
          <p className="text-sm text-muted">
            This page shows UI-ready compatibility cards. You can plug in your
            LangGraph scoring flow later.
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {matches.map((match) => (
          <Card key={match.id} className="border border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-3">
                <p className="text-lg font-semibold">{match.name}</p>
                <Badge className="bg-accent/10 text-accent">
                  {match.matchScore}% Match
                </Badge>
              </div>

              <div className="mt-4 space-y-2">
                {match.reasons.map((reason) => (
                  <div key={reason} className="flex items-center gap-2 text-sm text-muted">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {reason}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="secondary" className="w-full">
                  View profile
                </Button>
                <Button className="w-full">Start conversation</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
