"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Check,
  Factory,
  ImageUp,
  LoaderCircle,
  Recycle,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Role = "recycler" | "provider";

type FormState = {
  fullName: string;
  age: string;
  location: string;
  companyName: string;
  website: string;
  bio: string;
  wasteTypes: string[];
  tradeTypes: string;
  profilePicture: string;
};

const recyclerWasteTypes = ["plastic", "scrap", "nylons"] as const;

const baseFormState: Record<Role, FormState> = {
  recycler: {
    fullName: "",
    age: "",
    location: "",
    companyName: "",
    website: "",
    bio: "",
    wasteTypes: [],
    tradeTypes: "",
    profilePicture: "",
  },
  provider: {
    fullName: "",
    age: "",
    location: "",
    companyName: "",
    website: "",
    bio: "",
    wasteTypes: [],
    tradeTypes: "",
    profilePicture: "",
  },
};

const roleMeta = {
  recycler: {
    title: "Recycler onboarding",
    description: "Set your intake profile, service footprint, and material preferences.",
    icon: Recycle,
  },
  provider: {
    title: "Waste provider onboarding",
    description: "Describe your waste stream and create a clean operator-facing profile.",
    icon: Factory,
  },
};

export function OnboardingFlow() {
  const [role, setRole] = useState<Role>("recycler");
  const [forms, setForms] = useState(baseFormState);
  const [locations, setLocations] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => {
    let ignore = false;

    async function loadLocations() {
      const response = await fetch("/api/locations");
      const data = (await response.json()) as { locations: string[] };
      if (!ignore) {
        setLocations(data.locations);
      }
    }

    loadLocations();

    return () => {
      ignore = true;
    };
  }, []);

  const currentForm = forms[role];
  const currentMeta = roleMeta[role];

  const locationOptions = useMemo(
    () => [
      { label: "Select location", value: "" },
      ...locations.map((location) => ({ label: location, value: location })),
    ],
    [locations],
  );

  function updateField(name: keyof FormState, value: string | string[]) {
    setForms((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [name]: value,
      },
    }));
  }

  function toggleWasteType(type: string) {
    const next = currentForm.wasteTypes.includes(type)
      ? currentForm.wasteTypes.filter((item) => item !== type)
      : [...currentForm.wasteTypes, type];

    updateField("wasteTypes", next);
  }

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    updateField("profilePicture", file.name);
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    if (!currentForm.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!currentForm.age.trim()) nextErrors.age = "Age is required.";
    if (!currentForm.location.trim()) nextErrors.location = "Location is required.";
    if (!currentForm.bio.trim()) nextErrors.bio = "Bio is required.";
    if (!currentForm.profilePicture.trim()) nextErrors.profilePicture = "Profile picture is required.";

    if (role === "recycler") {
      if (!currentForm.companyName.trim()) nextErrors.companyName = "Company or agency name is required.";
      if (currentForm.wasteTypes.length === 0) nextErrors.wasteTypes = "Choose at least one waste type.";
    }

    if (role === "provider" && !currentForm.tradeTypes.trim()) {
      nextErrors.tradeTypes = "Types of waste likely to trade is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1100));
    setStatus("success");
  }


  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full name" error={errors.fullName}>
              <Input
                value={currentForm.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                placeholder="e.g. Dara Okafor"
              />
            </Field>
            <Field label="Age" error={errors.age}>
              <Input
                value={currentForm.age}
                onChange={(event) => updateField("age", event.target.value)}
                placeholder="28"
                type="number"
              />
            </Field>
            <Field label="Location" error={errors.location}>
              <Select
                value={currentForm.location}
                onChange={(event) => updateField("location", event.target.value)}
                options={locationOptions}
              />
            </Field>
            {role === "recycler" ? (
              <Field label="Recycling company/agency name" error={errors.companyName}>
                <Input
                  value={currentForm.companyName}
                  onChange={(event) => updateField("companyName", event.target.value)}
                  placeholder="GreenCycle Hub"
                />
              </Field>
            ) : (
              <Field label="Types of waste likely to trade" error={errors.tradeTypes}>
                <Input
                  value={currentForm.tradeTypes}
                  onChange={(event) => updateField("tradeTypes", event.target.value)}
                  placeholder="PET bottles, scrap metal, nylon sacks"
                />
              </Field>
            )}

            {role === "recycler" && (
              <Field
                label="Recycling company website"
                optional
                className="md:col-span-2"
              >
                <Input
                  value={currentForm.website}
                  onChange={(event) => updateField("website", event.target.value)}
                  placeholder="https://greencyclehub.com"
                />
              </Field>
            )}

            <Field label="Bio / description" error={errors.bio} className="md:col-span-2">
              <Textarea
                value={currentForm.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                placeholder={
                  role === "recycler"
                    ? "Describe collection capacity, service area, and material standards."
                    : "Describe your waste output pattern, packaging format, and pickup needs."
                }
              />
            </Field>

            {role === "recycler" && (
              <Field
                label="Types of waste collected"
                error={errors.wasteTypes}
                className="md:col-span-2"
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  {recyclerWasteTypes.map((type) => {
                    const active = currentForm.wasteTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleWasteType(type)}
                        className={cn(
                          "flex items-center justify-between rounded-xl border px-4 py-4 text-left capitalize",
                          active
                            ? "border-accent bg-accent/10 text-foreground"
                            : "border-border bg-card-strong text-muted",
                        )}
                      >
                        {type}
                        {active ? <Check className="h-4 w-4 text-accent" /> : null}
                      </button>
                    );
                  })}
                </div>
              </Field>
            )}

            <Field
              label="Profile picture upload"
              error={errors.profilePicture}
              className="md:col-span-2"
            >
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card-strong px-6 py-10 text-center hover:bg-white/6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  {currentForm.profilePicture ? (
                    <ImageUp className="h-6 w-6" />
                  ) : (
                    <Upload className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {currentForm.profilePicture || "Upload a profile image"}
                  </p>
                  <p className="mt-1 text-sm text-muted">PNG, JPG, or WEBP. UI-only preview state.</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
              </label>
            </Field>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {status === "success"
                ? "Submission UI complete. In a real flow, this would unlock dashboard access."
                : "Required fields show local validation only."}
            </p>
            <Button onClick={handleSubmit} className="min-w-44">
              {status === "loading" ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving profile
                </>
              ) : status === "success" ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved
                </>
              ) : (
                "Complete onboarding"
              )}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

type FieldProps = {
  children: React.ReactNode;
  className?: string;
  error?: string;
  label: string;
  optional?: boolean;
};

function Field({ children, className, error, label, optional }: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="flex items-center gap-2">
        {label}
        {optional ? <span className="text-xs text-muted">(optional)</span> : null}
      </Label>
      {children}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
