"use client";

import { Bot, ImageUp, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AiInsightsPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="border border-border bg-card">
        <CardHeader>
          <Badge className="bg-accent/10 text-accent">AI Analysis Panel</Badge>
          <CardTitle className="text-2xl">Upload waste for AI analysis</CardTitle>
          <p className="text-sm text-muted">
            Interface is ready. Connect this page to your LangGraph pipeline for
            detection, valuation, and recommendations.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card-strong text-center">
            <ImageUp className="h-7 w-7 text-muted" />
            <p className="mt-3 text-sm text-muted">
              Drag and drop waste image here, or click to upload.
            </p>
            <Button className="mt-4" variant="secondary">
              Choose image
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border border-border bg-card">
          <CardHeader>
            <p className="text-sm text-muted">Expected output format</p>
            <CardTitle className="text-xl">Analysis result card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <span className="text-muted">Detected:</span> PET Plastic Bottles
            </p>
            <p>
              <span className="text-muted">Estimated recyclability:</span> High
            </p>
            <p>
              <span className="text-muted">Estimated value:</span> ₦500–₦900
            </p>
            <p>
              <span className="text-muted">Recommended action:</span> Separate caps
              for higher recycling efficiency.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[
                { icon: Bot, text: "Plug in classifier + valuation graph" },
                { icon: Lightbulb, text: "Render recycler recommendations by match" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card-strong px-4 py-3 text-sm text-muted"
                >
                  <item.icon className="h-4 w-4 text-accent" />
                  {item.text}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
