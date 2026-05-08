"use client";

import { ImageIcon, Plus, Search } from "lucide-react";
import { getMarketplaceListings } from "@/components/dashboard/dashboard-mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function ListingsPage() {
  const listings = getMarketplaceListings();

  return (
    <div className="space-y-4">
      <Card className="border border-border bg-card">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted">Marketplace</p>
              <CardTitle className="text-2xl">Listings</CardTitle>
            </div>
            <Link href="/dashboard/listings/create">
              <Button>
                <Plus className="h-4 w-4" />
                Create listing
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted">
            Browse available waste streams and act quickly with view, contact,
            or express interest.
          </p>
        </CardHeader>
      </Card>

      <Card className="border border-border bg-card">
        <CardContent className="pt-6">
          <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                placeholder="Search by waste type or location"
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All conditions</SelectItem>
                <SelectItem value="sorted">Sorted</SelectItem>
                <SelectItem value="clean">Clean</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="latest">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="quantity">Quantity</SelectItem>
                <SelectItem value="match">Match score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => (
          <Card key={listing.id} className="border border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex h-36 items-center justify-center rounded-2xl border border-dashed border-border bg-card-strong">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-5 w-5 text-muted" />
                  <p className="mt-2 text-xs text-muted">Listing image</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-lg font-semibold">{listing.wasteType}</p>
                  {listing.matchScore ?
                    <Badge className="bg-accent/10 text-accent">
                      {listing.matchScore}% Match
                    </Badge>
                  : null}
                </div>
                <p className="text-sm text-muted">
                  {listing.quantity} • {listing.location}
                </p>
                <p className="text-sm text-muted">
                  Condition: {listing.condition}
                </p>
                <p className="text-xs text-muted">{listing.date}</p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <Button variant="secondary" className="w-full">
                  View details
                </Button>
                <Button variant="secondary" className="w-full">
                  Contact
                </Button>
                <Button className="w-full">Express interest</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
