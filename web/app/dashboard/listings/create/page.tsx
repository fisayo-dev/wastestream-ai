"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState({
    country: "",
    state: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      description,
      quantity,
      quantityUnit: unit,
      condition,
      country: location.country,
      state: location.state,
      city: location.city,
    };

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Failed to create listing");
        setLoading(false);
        return;
      }

      router.push("/dashboard/listings");
    } catch (err) {
      console.error(err);
      setError("Failed to create listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-3xl">
        <Card className="border border-border bg-card">
          <CardHeader>
            <div>
              <p className="text-sm text-muted">Create</p>
              <CardTitle className="text-2xl">New Listing</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-muted">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-muted">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm text-muted">
                    Quantity
                  </label>
                  <Input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-muted">Unit</label>
                  <Input
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-muted">
                  Condition
                </label>
                <Input
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-2 block text-sm text-muted">
                    Country
                  </label>
                  <Input
                    value={location.country}
                    onChange={(e) =>
                      setLocation((s) => ({ ...s, country: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-muted">State</label>
                  <Input
                    value={location.state}
                    onChange={(e) =>
                      setLocation((s) => ({ ...s, state: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-muted">City</label>
                  <Input
                    value={location.city}
                    onChange={(e) =>
                      setLocation((s) => ({ ...s, city: e.target.value }))
                    }
                  />
                </div>
              </div>

              {error ?
                <p className="text-sm text-destructive">{error}</p>
              : null}

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="h-12">
                  {loading ? "Creating..." : "Create listing"}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => router.back()}
                  className="h-12"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
