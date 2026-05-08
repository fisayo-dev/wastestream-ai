"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardSession } from "@/components/dashboard/dashboard-app-shell";
import { getProfilePreferences } from "@/components/dashboard/dashboard-mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { userProfileUrl } from "@/lib/auth";

export default function ProfilePage() {
  const session = useDashboardSession();
  const router = useRouter();
  const preferences = getProfilePreferences(session);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: session.personalProfile?.fullName ?? session.user.name,
    country: session.personalProfile?.country ?? "Not specified",
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(userProfileUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          country: formData.country,
        }),
        credentials: "include",
      });

      if (res.ok) {
        setIsEditing(false);
        router.refresh(); // Refresh to update the session context with new data
      } else {
        console.error("Failed to update profile", await res.text());
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  const wasteCategories =
    session.roleProfile && "wasteTypesAccepted" in session.roleProfile
      ? session.roleProfile.wasteTypesAccepted.map((item) => item.label)
      : session.roleProfile && "wasteTypesProvided" in session.roleProfile
        ? session.roleProfile.wasteTypesProvided.map((item) => item.label)
        : [];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="border border-border bg-card">
        <CardHeader>
          <p className="text-sm text-muted">Account</p>
          <CardTitle className="text-2xl">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-2xl border border-border bg-card-strong p-4">
            <p className="text-xs text-muted">Full name</p>
            {isEditing ? (
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-2"
              />
            ) : (
              <p className="mt-1 font-medium">{formData.fullName}</p>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-card-strong p-4">
            <p className="text-xs text-muted">Email</p>
            <p className="mt-1 font-medium">{session.user.email}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card-strong p-4">
            <p className="text-xs text-muted">Location</p>
            {isEditing ? (
              <Input
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="mt-2"
              />
            ) : (
              <p className="mt-1 font-medium">{formData.country}</p>
            )}
          </div>
          {isEditing ? (
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
              <Button onClick={() => setIsEditing(false)} disabled={isSaving} variant="secondary">Cancel</Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit profile</Button>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border border-border bg-card">
          <CardHeader>
            <p className="text-sm text-muted">Waste categories</p>
            <CardTitle className="text-xl">Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {wasteCategories.length > 0 ? (
                wasteCategories.map((category) => (
                  <Badge key={category}>{category}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted">No categories selected yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader>
            <p className="text-sm text-muted">Operational preferences</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {preferences.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border bg-card-strong p-4"
              >
                <p className="text-xs text-muted">{item.label}</p>
                <p className="mt-1 text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
