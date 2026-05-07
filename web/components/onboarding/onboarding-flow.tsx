"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Factory, LoaderCircle, Recycle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useBackendSession } from "@/hooks/use-backend-session";
import { type BackendAuthProfile, userProfileUrl } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { FormState } from "@/types/onboarding";
import { buildFormFromProfile } from "@/utils/onboarding";
import { fallbackWasteTypes, onboardingSteps } from "@/constants/onboarding";
import { WasteTypeOption } from "@/types/waste";

export function OnboardingFlow() {
  const { data, isLoading } = useBackendSession();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-muted">Loading onboarding...</p>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <OnboardingEditor
      key={`${data.user.id}-${data.personalProfile?.updatedAt ?? "draft"}`}
      data={data}
    />
  );
}

function OnboardingEditor({ data }: { data: BackendAuthProfile }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(() => buildFormFromProfile(data));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const wasteTypes =
    data.wasteTypes.length > 0 ? data.wasteTypes : fallbackWasteTypes;
  const currentStep = onboardingSteps[step - 1];
  const avatarInitials = data.user.name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function updatePersonalField(
    field: keyof Pick<
      FormState,
      "fullName" | "phoneNumber" | "bio" | "country"
    >,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateRecyclerField(
    field: keyof FormState["recycler"],
    value: string | string[],
  ) {
    setForm((current) => ({
      ...current,
      recycler: {
        ...current.recycler,
        [field]: value,
      },
    }));
  }

  function updateWasteProviderField(
    field: keyof FormState["wasteProvider"],
    value: string | string[],
  ) {
    setForm((current) => ({
      ...current,
      wasteProvider: {
        ...current.wasteProvider,
        [field]: value,
      },
    }));
  }

  function syncCountryIntoRoleStep() {
    setForm((current) => ({
      ...current,
      recycler: {
        ...current.recycler,
        serviceCountry: current.recycler.serviceCountry || current.country,
      },
      wasteProvider: {
        ...current.wasteProvider,
        country: current.wasteProvider.country || current.country,
      },
    }));
  }

  function toggleWasteType(slug: string) {
    if (form.role === "recycler") {
      const nextValues = form.recycler.wasteTypesAccepted.includes(slug)
        ? form.recycler.wasteTypesAccepted.filter((item) => item !== slug)
        : [...form.recycler.wasteTypesAccepted, slug];

      updateRecyclerField("wasteTypesAccepted", nextValues);
      return;
    }

    const nextValues = form.wasteProvider.wasteTypesProvided.includes(slug)
      ? form.wasteProvider.wasteTypesProvided.filter((item) => item !== slug)
      : [...form.wasteProvider.wasteTypesProvided, slug];

    updateWasteProviderField("wasteTypesProvided", nextValues);
  }

  function validateCurrentStep(nextStep: number) {
    const nextErrors: Record<string, string> = {};

    if (nextStep >= 1) {
      if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
      if (!form.phoneNumber.trim())
        nextErrors.phoneNumber = "Phone number is required.";
      if (!form.country.trim()) nextErrors.country = "Country is required.";
    }

    if (nextStep >= 3) {
      if (form.role === "recycler") {
        if (form.recycler.wasteTypesAccepted.length === 0) {
          nextErrors.recyclerWasteTypesAccepted =
            "Select at least one waste type.";
        }
        if (!form.recycler.collectionCapacityAmount.trim()) {
          nextErrors.recyclerCollectionCapacityAmount =
            "Capacity amount is required.";
        }
        if (!form.recycler.collectionCapacityUnit.trim()) {
          nextErrors.recyclerCollectionCapacityUnit = "Select a capacity unit.";
        }
        if (!form.recycler.pickupAvailability.trim()) {
          nextErrors.recyclerPickupAvailability = "Select a pickup option.";
        }
        if (!form.recycler.serviceCountry.trim()) {
          nextErrors.recyclerServiceCountry = "Service country is required.";
        }
        if (!form.recycler.serviceState.trim()) {
          nextErrors.recyclerServiceState = "Service state is required.";
        }
        if (!form.recycler.serviceCity.trim()) {
          nextErrors.recyclerServiceCity = "Service city is required.";
        }
      } else {
        if (form.wasteProvider.wasteTypesProvided.length === 0) {
          nextErrors.wasteProviderWasteTypesProvided =
            "Select at least one waste type.";
        }
        if (!form.wasteProvider.estimatedQuantityAmount.trim()) {
          nextErrors.wasteProviderEstimatedQuantityAmount =
            "Quantity amount is required.";
        }
        if (!form.wasteProvider.estimatedQuantityUnit.trim()) {
          nextErrors.wasteProviderEstimatedQuantityUnit =
            "Select a quantity unit.";
        }
        if (!form.wasteProvider.frequency.trim()) {
          nextErrors.wasteProviderFrequency = "Select a frequency.";
        }
        if (!form.wasteProvider.wasteCondition.trim()) {
          nextErrors.wasteProviderWasteCondition = "Select a waste condition.";
        }
        if (!form.wasteProvider.country.trim()) {
          nextErrors.wasteProviderCountry = "Location country is required.";
        }
        if (!form.wasteProvider.state.trim()) {
          nextErrors.wasteProviderState = "Location state is required.";
        }
        if (!form.wasteProvider.city.trim()) {
          nextErrors.wasteProviderCity = "Location city is required.";
        }
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleNext() {
    if (!validateCurrentStep(step)) {
      return;
    }

    if (step === 1) {
      syncCountryIntoRoleStep();
    }

    setSubmitError("");
    setStep((current) => Math.min(current + 1, 3));
  }

  async function handleSubmit() {
    if (!validateCurrentStep(3)) {
      setStep(3);
      return;
    }

    setIsSaving(true);
    setSubmitError("");

    const payload =
      form.role === "recycler"
        ? {
            fullName: form.fullName.trim(),
            phoneNumber: form.phoneNumber.trim(),
            bio: form.bio.trim(),
            country: form.country.trim(),
            role: "recycler",
            recycler: {
              wasteTypesAccepted: form.recycler.wasteTypesAccepted,
              collectionCapacityAmount:
                form.recycler.collectionCapacityAmount.trim(),
              collectionCapacityUnit: form.recycler.collectionCapacityUnit,
              pickupAvailability: form.recycler.pickupAvailability,
              serviceCountry: form.recycler.serviceCountry.trim(),
              serviceState: form.recycler.serviceState.trim(),
              serviceCity: form.recycler.serviceCity.trim(),
              businessDescription: form.recycler.businessDescription.trim(),
            },
          }
        : {
            fullName: form.fullName.trim(),
            phoneNumber: form.phoneNumber.trim(),
            bio: form.bio.trim(),
            country: form.country.trim(),
            role: "waste-provider",
            wasteProvider: {
              wasteTypesProvided: form.wasteProvider.wasteTypesProvided,
              estimatedQuantityAmount:
                form.wasteProvider.estimatedQuantityAmount.trim(),
              estimatedQuantityUnit: form.wasteProvider.estimatedQuantityUnit,
              frequency: form.wasteProvider.frequency,
              wasteCondition: form.wasteProvider.wasteCondition,
              country: form.wasteProvider.country.trim(),
              state: form.wasteProvider.state.trim(),
              city: form.wasteProvider.city.trim(),
              additionalNotes: form.wasteProvider.additionalNotes.trim(),
            },
          };

    try {
      const response = await fetch(userProfileUrl, {
        method: data.personalProfile ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          message?: string;
          errors?: string[];
        } | null;

        setSubmitError(
          result?.errors?.[0] ??
            result?.message ??
            "Unable to complete onboarding.",
        );
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-5xl">
        <div>
          <header className="px-5 py-6 md:px-8">
            <div className="flex flex-col gap-5 md:flex-row items-start md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.18em] text-muted">
                  Onboarding
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  Set up your marketplace profile
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                  Three short steps. We use this to route waste to the right
                  operator with fewer bad matches.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-background/20 px-4 py-3">
                {data.user.image ? (
                  <Avatar>
                    <AvatarImage src={data.user.image} />
                    <AvatarFallback>{data.user.name.split(" ")[0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full  bg-white/5 text-sm font-semibold">
                    {avatarInitials}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">
                    {form.fullName || data.user.name}
                  </p>
                  <p className="text-xs text-muted">{data.user.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {onboardingSteps.map((item) => {
                const isActive = item.id === step;
                const isComplete = item.id < step;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id < step || validateCurrentStep(item.id - 1)) {
                        if (item.id === 3) {
                          syncCountryIntoRoleStep();
                        }
                        setStep(item.id);
                      }
                    }}
                    className={cn(
                      "border px-4 py-4 text-left",
                      isActive
                        ? "border-accent bg-accent/8"
                        : "border-border bg-transparent hover:bg-white/4",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                          isComplete || isActive
                            ? "border-accent bg-accent text-[#13210f]"
                            : "border-border text-muted",
                        )}
                      >
                        {isComplete ? <Check className="h-4 w-4" /> : item.id}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-muted">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </header>

          <section className="px-5 py-6 md:px-8 md:py-8">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm uppercase tracking-[0.18em] text-muted">
                Step {step}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                {currentStep.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {currentStep.description}
              </p>
            </div>

            {step === 1 ? (
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Full name" error={errors.fullName}>
                  <Input
                    value={form.fullName}
                    onChange={(event) =>
                      updatePersonalField("fullName", event.target.value)
                    }
                    placeholder="Ada Okafor"
                  />
                </Field>
                <Field label="Email">
                  <Input value={form.email} disabled />
                </Field>
                <Field label="Phone number" error={errors.phoneNumber}>
                  <Input
                    value={form.phoneNumber}
                    onChange={(event) =>
                      updatePersonalField("phoneNumber", event.target.value)
                    }
                    placeholder="+234 801 234 5678"
                  />
                </Field>
                <Field label="Country" error={errors.country}>
                  <Input
                    value={form.country}
                    onChange={(event) =>
                      updatePersonalField("country", event.target.value)
                    }
                    placeholder="Nigeria"
                  />
                </Field>
                <Field label="Bio" optional className="md:col-span-2">
                  <Textarea
                    value={form.bio}
                    onChange={(event) =>
                      updatePersonalField("bio", event.target.value)
                    }
                    placeholder="Optional context about your operation."
                    className="min-h-28 rounded-none"
                  />
                </Field>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <RoleOption
                  title="Recycler"
                  description="You collect and process waste materials."
                  icon={Recycle}
                  active={form.role === "recycler"}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      role: "recycler",
                    }))
                  }
                />
                <RoleOption
                  title="Waste provider"
                  description="You generate or supply waste for collection."
                  icon={Factory}
                  active={form.role === "waste-provider"}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      role: "waste-provider",
                    }))
                  }
                />
              </div>
            ) : null}

            {step === 3 ? (
              form.role === "recycler" ? (
                <div className="space-y-8">
                  <SectionTitle
                    title="Waste collection info"
                    description="These fields determine who you match with and where you can operate."
                  />

                  <Field
                    label="Waste types accepted"
                    error={errors.recyclerWasteTypesAccepted}
                  >
                    <WasteTypeGrid
                      options={wasteTypes}
                      selected={form.recycler.wasteTypesAccepted}
                      onToggle={toggleWasteType}
                    />
                  </Field>

                  <div className="grid gap-5 md:grid-cols-[1fr_220px]">
                    <Field
                      label="Collection capacity amount"
                      error={errors.recyclerCollectionCapacityAmount}
                    >
                      <Input
                        value={form.recycler.collectionCapacityAmount}
                        onChange={(event) =>
                          updateRecyclerField(
                            "collectionCapacityAmount",
                            event.target.value,
                          )
                        }
                        placeholder="50"
                      />
                    </Field>
                    <Field
                      label="Collection capacity unit"
                      error={errors.recyclerCollectionCapacityUnit}
                    >
                      <Select
                        value={form.recycler.collectionCapacityUnit}
                        onChange={(event) =>
                          updateRecyclerField(
                            "collectionCapacityUnit",
                            event.target.value,
                          )
                        }
                        options={[
                          { label: "Select unit", value: "" },
                          ...data.meta.capacityUnitOptions.map((option) => ({
                            label: option,
                            value: option,
                          })),
                        ]}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Pickup availability"
                    error={errors.recyclerPickupAvailability}
                  >
                    <div className="grid gap-3 md:grid-cols-3">
                      {[
                        { value: "i-offer-pickup", label: "I offer pickup" },
                        { value: "drop-off-only", label: "Drop-off only" },
                        { value: "both", label: "Both" },
                      ].map((option) => (
                        <ChoicePill
                          key={option.value}
                          active={
                            form.recycler.pickupAvailability === option.value
                          }
                          label={option.label}
                          onClick={() =>
                            updateRecyclerField(
                              "pickupAvailability",
                              option.value,
                            )
                          }
                        />
                      ))}
                    </div>
                  </Field>

                  <div className="grid gap-5 md:grid-cols-3">
                    <Field
                      label="Service country"
                      error={errors.recyclerServiceCountry}
                    >
                      <Input
                        value={form.recycler.serviceCountry}
                        onChange={(event) =>
                          updateRecyclerField(
                            "serviceCountry",
                            event.target.value,
                          )
                        }
                        placeholder="Nigeria"
                      />
                    </Field>
                    <Field label="State" error={errors.recyclerServiceState}>
                      <Input
                        value={form.recycler.serviceState}
                        onChange={(event) =>
                          updateRecyclerField(
                            "serviceState",
                            event.target.value,
                          )
                        }
                        placeholder="Lagos"
                      />
                    </Field>
                    <Field label="City" error={errors.recyclerServiceCity}>
                      <Input
                        value={form.recycler.serviceCity}
                        onChange={(event) =>
                          updateRecyclerField("serviceCity", event.target.value)
                        }
                        placeholder="Ikeja"
                      />
                    </Field>
                  </div>

                  <Field label="Short business description" optional>
                    <Textarea
                      value={form.recycler.businessDescription}
                      onChange={(event) =>
                        updateRecyclerField(
                          "businessDescription",
                          event.target.value,
                        )
                      }
                      placeholder="We recycle PET plastics and aluminum cans."
                      className="min-h-28 rounded-none"
                    />
                  </Field>
                </div>
              ) : (
                <div className="space-y-8">
                  <SectionTitle
                    title="Waste details"
                    description="Keep this practical. The goal is enough signal to match you well."
                  />

                  <Field
                    label="Waste types provided"
                    error={errors.wasteProviderWasteTypesProvided}
                  >
                    <WasteTypeGrid
                      options={wasteTypes}
                      selected={form.wasteProvider.wasteTypesProvided}
                      onToggle={toggleWasteType}
                    />
                  </Field>

                  <div className="grid gap-5 md:grid-cols-[1fr_220px]">
                    <Field
                      label="Estimated quantity"
                      error={errors.wasteProviderEstimatedQuantityAmount}
                    >
                      <Input
                        value={form.wasteProvider.estimatedQuantityAmount}
                        onChange={(event) =>
                          updateWasteProviderField(
                            "estimatedQuantityAmount",
                            event.target.value,
                          )
                        }
                        placeholder="20"
                      />
                    </Field>
                    <Field
                      label="Unit"
                      error={errors.wasteProviderEstimatedQuantityUnit}
                    >
                      <Select
                        value={form.wasteProvider.estimatedQuantityUnit}
                        onChange={(event) =>
                          updateWasteProviderField(
                            "estimatedQuantityUnit",
                            event.target.value,
                          )
                        }
                        options={[
                          { label: "Select unit", value: "" },
                          ...data.meta.quantityUnitOptions.map((option) => ({
                            label: option,
                            value: option,
                          })),
                        ]}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Frequency"
                      error={errors.wasteProviderFrequency}
                    >
                      <Select
                        value={form.wasteProvider.frequency}
                        onChange={(event) =>
                          updateWasteProviderField(
                            "frequency",
                            event.target.value,
                          )
                        }
                        options={[
                          { label: "Select frequency", value: "" },
                          ...data.meta.providerFrequencyOptions.map(
                            (option) => ({
                              label: option
                                .replace("one-time", "One-time")
                                .replace("daily", "Daily")
                                .replace("weekly", "Weekly")
                                .replace("monthly", "Monthly"),
                              value: option,
                            }),
                          ),
                        ]}
                      />
                    </Field>
                    <Field
                      label="Waste condition"
                      error={errors.wasteProviderWasteCondition}
                    >
                      <Select
                        value={form.wasteProvider.wasteCondition}
                        onChange={(event) =>
                          updateWasteProviderField(
                            "wasteCondition",
                            event.target.value,
                          )
                        }
                        options={[
                          { label: "Select condition", value: "" },
                          { label: "Sorted", value: "sorted" },
                          { label: "Mixed", value: "mixed" },
                          { label: "Clean", value: "clean" },
                          {
                            label: "Dirty/contaminated",
                            value: "dirty-contaminated",
                          },
                        ]}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    <Field label="Country" error={errors.wasteProviderCountry}>
                      <Input
                        value={form.wasteProvider.country}
                        onChange={(event) =>
                          updateWasteProviderField(
                            "country",
                            event.target.value,
                          )
                        }
                        placeholder="Nigeria"
                      />
                    </Field>
                    <Field label="State" error={errors.wasteProviderState}>
                      <Input
                        value={form.wasteProvider.state}
                        onChange={(event) =>
                          updateWasteProviderField("state", event.target.value)
                        }
                        placeholder="Oyo"
                      />
                    </Field>
                    <Field label="City" error={errors.wasteProviderCity}>
                      <Input
                        value={form.wasteProvider.city}
                        onChange={(event) =>
                          updateWasteProviderField("city", event.target.value)
                        }
                        placeholder="Ibadan"
                      />
                    </Field>
                  </div>

                  <Field label="Additional notes" optional>
                    <Textarea
                      value={form.wasteProvider.additionalNotes}
                      onChange={(event) =>
                        updateWasteProviderField(
                          "additionalNotes",
                          event.target.value,
                        )
                      }
                      placeholder="Mostly plastic bottles from a restaurant."
                      className="min-h-28 rounded-none"
                    />
                  </Field>
                </div>
              )
            ) : null}
          </section>

          <footer className="border-t border-border px-5 py-5 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                {submitError ? (
                  <p className="text-sm text-danger">{submitError}</p>
                ) : (
                  <p className="text-sm text-muted">
                    Your email comes from the active session and stays locked.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep((current) => Math.max(current - 1, 1))}
                  disabled={step === 1 || isSaving}
                >
                  Back
                </Button>

                {step < 3 ? (
                  <Button type="button" onClick={handleNext}>
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      "Complete onboarding"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </footer>
        </div>
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
      <Label className="flex items-center gap-2 text-sm">
        {label}
        {optional ? (
          <span className="text-xs text-muted">(optional)</span>
        ) : null}
      </Label>
      {children}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-border pb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function RoleOption({
  title,
  description,
  icon: Icon,
  active,
  onClick,
}: {
  title: string;
  description: string;
  icon: typeof Recycle;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-5 py-5 text-left",
        active ? "border-accent bg-accent/8" : "border-border hover:bg-white/4",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border",
            active ? "border-accent bg-accent text-[#13210f]" : "border-border",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </button>
  );
}

function WasteTypeGrid({
  options,
  selected,
  onToggle,
}: {
  options: WasteTypeOption[];
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {options.map((option) => {
        const active = selected.includes(option.slug);

        return (
          <button
            key={option.slug}
            type="button"
            onClick={() => onToggle(option.slug)}
            className={cn(
              "flex items-center justify-between border px-4 py-3 text-left text-sm",
              active
                ? "border-accent bg-accent/8 text-foreground"
                : "border-border hover:bg-white/4",
            )}
          >
            <span>{option.label}</span>
            {active ? <Check className="h-4 w-4 text-accent" /> : null}
          </button>
        );
      })}
    </div>
  );
}

function ChoicePill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-4 py-3 text-left text-sm",
        active ? "border-accent bg-accent/8" : "border-border hover:bg-white/4",
      )}
    >
      {label}
    </button>
  );
}
