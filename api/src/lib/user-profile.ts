import { eq } from "drizzle-orm";

import { db } from "../database";
import {
  recyclerProfile,
  recyclerWasteType,
  user,
  userProfile,
  wasteProviderProfile,
  wasteProviderWasteType,
  wasteType,
} from "../database/schema";
import type { AuthSession } from "./request-auth";

export const wasteTypeOptions = [
  { slug: "plastic", label: "Plastic" },
  { slug: "metal", label: "Metal" },
  { slug: "paper", label: "Paper" },
  { slug: "glass", label: "Glass" },
  { slug: "organic", label: "Organic" },
  { slug: "e-waste", label: "E-waste" },
  { slug: "textile", label: "Textile" },
  { slug: "rubber", label: "Rubber" },
] as const;

export const recyclerPickupOptions = [
  "i-offer-pickup",
  "drop-off-only",
  "both",
] as const;

export const quantityUnitOptions = [
  "kg",
  "tons",
  "bags",
  "bins",
] as const;

export const capacityUnitOptions = [
  "kg/week",
  "kg/month",
  "tons/week",
  "tons/month",
] as const;

export const providerFrequencyOptions = [
  "one-time",
  "daily",
  "weekly",
  "monthly",
] as const;

export const wasteConditionOptions = [
  "sorted",
  "mixed",
  "clean",
  "dirty-contaminated",
] as const;

export type OnboardingRole = "recycler" | "waste-provider";

type BaseProfileInput = {
  fullName: string;
  phoneNumber: string;
  bio?: string | null;
  country: string;
};

type RecyclerInput = BaseProfileInput & {
  role: "recycler";
  recycler: {
    wasteTypesAccepted: string[];
    collectionCapacityAmount: string;
    collectionCapacityUnit: string;
    pickupAvailability: string;
    serviceCountry: string;
    serviceState: string;
    serviceCity: string;
    businessDescription?: string | null;
  };
};

type WasteProviderInput = BaseProfileInput & {
  role: "waste-provider";
  wasteProvider: {
    wasteTypesProvided: string[];
    estimatedQuantityAmount: string;
    estimatedQuantityUnit: string;
    frequency: string;
    wasteCondition: string;
    country: string;
    state: string;
    city: string;
    additionalNotes?: string | null;
  };
};

export type OnboardingInput = RecyclerInput | WasteProviderInput;

function trimString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function optionalString(value: unknown) {
  const trimmed = trimString(value);
  return trimmed.length > 0 ? trimmed : null;
}

function parseWasteTypes(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasOnlyAllowedValues(values: string[], allowed: readonly string[]) {
  return values.every((value) => allowed.includes(value));
}

export function validateOnboardingInput(payload: unknown): {
  data: OnboardingInput | null;
  errors: string[];
} {
  if (!payload || typeof payload !== "object") {
    return {
      data: null,
      errors: ["Invalid request body."],
    };
  }

  const body = payload as Record<string, unknown>;
  const fullName = trimString(body.fullName);
  const phoneNumber = trimString(body.phoneNumber);
  const bio = optionalString(body.bio);
  const country = trimString(body.country);
  const role = trimString(body.role) as OnboardingRole;
  const errors: string[] = [];

  if (!fullName) errors.push("Full name is required.");
  if (!phoneNumber) errors.push("Phone number is required.");
  if (!country) errors.push("Country is required.");
  if (role !== "recycler" && role !== "waste-provider") {
    errors.push("Role must be recycler or waste-provider.");
  }

  if (role === "recycler") {
    const recyclerBody = (body.recycler ?? {}) as Record<string, unknown>;
    const wasteTypesAccepted = parseWasteTypes(recyclerBody.wasteTypesAccepted);
    const collectionCapacityAmount = trimString(
      recyclerBody.collectionCapacityAmount,
    );
    const collectionCapacityUnit = trimString(
      recyclerBody.collectionCapacityUnit,
    );
    const pickupAvailability = trimString(recyclerBody.pickupAvailability);
    const serviceCountry = trimString(recyclerBody.serviceCountry);
    const serviceState = trimString(recyclerBody.serviceState);
    const serviceCity = trimString(recyclerBody.serviceCity);
    const businessDescription = optionalString(recyclerBody.businessDescription);

    if (wasteTypesAccepted.length === 0) {
      errors.push("Select at least one waste type.");
    }
    if (!hasOnlyAllowedValues(wasteTypesAccepted, wasteTypeOptions.map((item) => item.slug))) {
      errors.push("Recycler waste types are invalid.");
    }
    if (!collectionCapacityAmount) errors.push("Collection capacity amount is required.");
    if (!capacityUnitOptions.includes(collectionCapacityUnit as (typeof capacityUnitOptions)[number])) {
      errors.push("Collection capacity unit is invalid.");
    }
    if (!recyclerPickupOptions.includes(pickupAvailability as (typeof recyclerPickupOptions)[number])) {
      errors.push("Pickup availability is invalid.");
    }
    if (!serviceCountry) errors.push("Service country is required.");
    if (!serviceState) errors.push("Service state is required.");
    if (!serviceCity) errors.push("Service city is required.");

    return {
      data:
        errors.length === 0
          ? {
              fullName,
              phoneNumber,
              bio,
              country,
              role,
              recycler: {
                wasteTypesAccepted,
                collectionCapacityAmount,
                collectionCapacityUnit,
                pickupAvailability,
                serviceCountry,
                serviceState,
                serviceCity,
                businessDescription,
              },
            }
          : null,
      errors,
    };
  }

  const providerBody = (body.wasteProvider ?? {}) as Record<string, unknown>;
  const wasteTypesProvided = parseWasteTypes(providerBody.wasteTypesProvided);
  const estimatedQuantityAmount = trimString(providerBody.estimatedQuantityAmount);
  const estimatedQuantityUnit = trimString(providerBody.estimatedQuantityUnit);
  const frequency = trimString(providerBody.frequency);
  const wasteCondition = trimString(providerBody.wasteCondition);
  const providerCountry = trimString(providerBody.country);
  const state = trimString(providerBody.state);
  const city = trimString(providerBody.city);
  const additionalNotes = optionalString(providerBody.additionalNotes);

  if (wasteTypesProvided.length === 0) {
    errors.push("Select at least one waste type.");
  }
  if (!hasOnlyAllowedValues(wasteTypesProvided, wasteTypeOptions.map((item) => item.slug))) {
    errors.push("Waste provider waste types are invalid.");
  }
  if (!estimatedQuantityAmount) errors.push("Estimated quantity amount is required.");
  if (!quantityUnitOptions.includes(estimatedQuantityUnit as (typeof quantityUnitOptions)[number])) {
    errors.push("Estimated quantity unit is invalid.");
  }
  if (!providerFrequencyOptions.includes(frequency as (typeof providerFrequencyOptions)[number])) {
    errors.push("Frequency is invalid.");
  }
  if (!wasteConditionOptions.includes(wasteCondition as (typeof wasteConditionOptions)[number])) {
    errors.push("Waste condition is invalid.");
  }
  if (!providerCountry) errors.push("Location country is required.");
  if (!state) errors.push("Location state is required.");
  if (!city) errors.push("Location city is required.");

  return {
    data:
      errors.length === 0
        ? {
            fullName,
            phoneNumber,
            bio,
            country,
            role,
            wasteProvider: {
              wasteTypesProvided,
              estimatedQuantityAmount,
              estimatedQuantityUnit,
              frequency,
              wasteCondition,
              country: providerCountry,
              state,
              city,
              additionalNotes,
            },
          }
        : null,
    errors,
  };
}

export async function ensureWasteTypeSeedData() {
  const existingTypes = await db.select().from(wasteType);
  const existingSlugs = new Set(existingTypes.map((item) => item.slug));
  const missingTypes = wasteTypeOptions.filter(
    (item) => !existingSlugs.has(item.slug),
  );

  if (missingTypes.length === 0) {
    return existingTypes;
  }

  const now = new Date();

  await db.insert(wasteType).values(
    missingTypes.map((item) => ({
      slug: item.slug,
      label: item.label,
      createdAt: now,
    })),
  );

  return db.select().from(wasteType);
}

async function getWasteTypeMap() {
  const rows = await ensureWasteTypeSeedData();
  return new Map(rows.map((item) => [item.slug, item.id]));
}

async function getRecyclerWasteTypes(userId: string) {
  const rows = await db
    .select({
      slug: wasteType.slug,
      label: wasteType.label,
    })
    .from(recyclerWasteType)
    .innerJoin(wasteType, eq(recyclerWasteType.wasteTypeId, wasteType.id))
    .where(eq(recyclerWasteType.recyclerUserId, userId));

  return rows;
}

async function getWasteProviderWasteTypes(userId: string) {
  const rows = await db
    .select({
      slug: wasteType.slug,
      label: wasteType.label,
    })
    .from(wasteProviderWasteType)
    .innerJoin(wasteType, eq(wasteProviderWasteType.wasteTypeId, wasteType.id))
    .where(eq(wasteProviderWasteType.wasteProviderUserId, userId));

  return rows;
}

export async function getUserProfileState(userId: string) {
  const [profile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId));

  if (!profile) {
    return {
      personalProfile: null,
      roleProfile: null,
      onboardingCompleted: false,
      role: null,
    };
  }

  if (profile.role === "recycler") {
    const [recycler] = await db
      .select()
      .from(recyclerProfile)
      .where(eq(recyclerProfile.userId, userId));

    return {
      personalProfile: profile,
      onboardingCompleted: Boolean(recycler),
      role: profile.role as OnboardingRole,
      roleProfile: recycler
        ? {
            ...recycler,
            wasteTypesAccepted: await getRecyclerWasteTypes(userId),
          }
        : null,
    };
  }

  const [provider] = await db
    .select()
    .from(wasteProviderProfile)
    .where(eq(wasteProviderProfile.userId, userId));

  return {
    personalProfile: profile,
    onboardingCompleted: Boolean(provider),
    role: profile.role as OnboardingRole,
    roleProfile: provider
      ? {
          ...provider,
          wasteTypesProvided: await getWasteProviderWasteTypes(userId),
        }
      : null,
  };
}

export async function buildAuthProfile(session: AuthSession) {
  const profileState = await getUserProfileState(session.user.id);

  return {
    session: session.session,
    user: {
      ...session.user,
      name: profileState.personalProfile?.fullName ?? session.user.name,
    },
    onboardingCompleted: profileState.onboardingCompleted,
    onboardingRole: profileState.role,
    personalProfile: profileState.personalProfile,
    roleProfile: profileState.roleProfile,
    wasteTypes: wasteTypeOptions,
    meta: {
      recyclerPickupOptions,
      quantityUnitOptions,
      capacityUnitOptions,
      providerFrequencyOptions,
      wasteConditionOptions,
    },
  };
}

export function buildFallbackAuthProfile(session: AuthSession) {
  return {
    session: session.session,
    user: session.user,
    onboardingCompleted: false,
    onboardingRole: null,
    personalProfile: null,
    roleProfile: null,
    wasteTypes: wasteTypeOptions,
    meta: {
      recyclerPickupOptions,
      quantityUnitOptions,
      capacityUnitOptions,
      providerFrequencyOptions,
      wasteConditionOptions,
    },
  };
}

export async function createOnboardingProfile(
  session: AuthSession,
  input: OnboardingInput,
) {
  const existing = await getUserProfileState(session.user.id);

  if (existing.personalProfile) {
    return {
      ok: false as const,
      status: 409,
      message: "Onboarding already exists for this user.",
    };
  }

  return saveOnboardingProfile(session, input);
}

export async function updateOnboardingProfile(
  session: AuthSession,
  input: OnboardingInput,
) {
  return saveOnboardingProfile(session, input);
}

async function saveOnboardingProfile(session: AuthSession, input: OnboardingInput) {
  const now = new Date();
  const wasteTypeMap = await getWasteTypeMap();

  await db.transaction(async (tx) => {
    await tx
      .update(user)
      .set({
        name: input.fullName,
        updatedAt: now,
      })
      .where(eq(user.id, session.user.id));

    await tx
      .insert(userProfile)
      .values({
        userId: session.user.id,
        fullName: input.fullName,
        phoneNumber: input.phoneNumber,
        bio: input.bio ?? null,
        country: input.country,
        role: input.role,
        createdAt: now,
        updatedAt: now,
        onboardedAt: now,
      })
      .onConflictDoUpdate({
        target: userProfile.userId,
        set: {
          fullName: input.fullName,
          phoneNumber: input.phoneNumber,
          bio: input.bio ?? null,
          country: input.country,
          role: input.role,
          updatedAt: now,
          onboardedAt: now,
        },
      });

    if (input.role === "recycler") {
      await tx
        .delete(wasteProviderProfile)
        .where(eq(wasteProviderProfile.userId, session.user.id));

      await tx
        .insert(recyclerProfile)
        .values({
          userId: session.user.id,
          collectionCapacityAmount: input.recycler.collectionCapacityAmount,
          collectionCapacityUnit: input.recycler.collectionCapacityUnit,
          pickupAvailability: input.recycler.pickupAvailability,
          serviceCountry: input.recycler.serviceCountry,
          serviceState: input.recycler.serviceState,
          serviceCity: input.recycler.serviceCity,
          businessDescription: input.recycler.businessDescription ?? null,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: recyclerProfile.userId,
          set: {
            collectionCapacityAmount: input.recycler.collectionCapacityAmount,
            collectionCapacityUnit: input.recycler.collectionCapacityUnit,
            pickupAvailability: input.recycler.pickupAvailability,
            serviceCountry: input.recycler.serviceCountry,
            serviceState: input.recycler.serviceState,
            serviceCity: input.recycler.serviceCity,
            businessDescription: input.recycler.businessDescription ?? null,
            updatedAt: now,
          },
        });

      await tx
        .delete(recyclerWasteType)
        .where(eq(recyclerWasteType.recyclerUserId, session.user.id));

      await tx.insert(recyclerWasteType).values(
        input.recycler.wasteTypesAccepted.map((slug) => ({
          recyclerUserId: session.user.id,
          wasteTypeId: wasteTypeMap.get(slug)!,
          createdAt: now,
        })),
      );

      return;
    }

    await tx.delete(recyclerProfile).where(eq(recyclerProfile.userId, session.user.id));

    await tx
      .insert(wasteProviderProfile)
      .values({
        userId: session.user.id,
        estimatedQuantityAmount: input.wasteProvider.estimatedQuantityAmount,
        estimatedQuantityUnit: input.wasteProvider.estimatedQuantityUnit,
        frequency: input.wasteProvider.frequency,
        wasteCondition: input.wasteProvider.wasteCondition,
        country: input.wasteProvider.country,
        state: input.wasteProvider.state,
        city: input.wasteProvider.city,
        additionalNotes: input.wasteProvider.additionalNotes ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: wasteProviderProfile.userId,
        set: {
          estimatedQuantityAmount: input.wasteProvider.estimatedQuantityAmount,
          estimatedQuantityUnit: input.wasteProvider.estimatedQuantityUnit,
          frequency: input.wasteProvider.frequency,
          wasteCondition: input.wasteProvider.wasteCondition,
          country: input.wasteProvider.country,
          state: input.wasteProvider.state,
          city: input.wasteProvider.city,
          additionalNotes: input.wasteProvider.additionalNotes ?? null,
          updatedAt: now,
        },
      });

    await tx
      .delete(wasteProviderWasteType)
      .where(eq(wasteProviderWasteType.wasteProviderUserId, session.user.id));

    await tx.insert(wasteProviderWasteType).values(
      input.wasteProvider.wasteTypesProvided.map((slug) => ({
        wasteProviderUserId: session.user.id,
        wasteTypeId: wasteTypeMap.get(slug)!,
        createdAt: now,
      })),
    );
  });

  return {
    ok: true as const,
    status: 200,
    data: await buildAuthProfile(session),
  };
}

export async function deleteOnboardingProfile(userId: string) {
  await db.transaction(async (tx) => {
    await tx
      .delete(recyclerWasteType)
      .where(eq(recyclerWasteType.recyclerUserId, userId));
    await tx
      .delete(wasteProviderWasteType)
      .where(eq(wasteProviderWasteType.wasteProviderUserId, userId));
    await tx.delete(recyclerProfile).where(eq(recyclerProfile.userId, userId));
    await tx
      .delete(wasteProviderProfile)
      .where(eq(wasteProviderProfile.userId, userId));
    await tx.delete(userProfile).where(eq(userProfile.userId, userId));
  });
}
