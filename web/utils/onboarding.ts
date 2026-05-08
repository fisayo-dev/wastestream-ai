import { BackendAuthProfile } from "@/lib/auth";
import { FormState } from "@/types/onboarding";

export const createEmptyForm = (): FormState => {
  return {
    fullName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    country: "",
    role: "recycler",
    recycler: {
      wasteTypesAccepted: [],
      collectionCapacityAmount: "",
      collectionCapacityUnit: "",
      pickupAvailability: "",
      serviceCountry: "",
      serviceState: "",
      serviceCity: "",
      businessDescription: "",
    },
    wasteProvider: {
      wasteTypesProvided: [],
      estimatedQuantityAmount: "",
      estimatedQuantityUnit: "",
      frequency: "",
      wasteCondition: "",
      country: "",
      state: "",
      city: "",
      additionalNotes: "",
    },
  };
};

export const buildFormFromProfile = (profile: BackendAuthProfile): FormState => {
  const nextState = createEmptyForm();
  nextState.fullName = profile.personalProfile?.fullName ?? profile.user.name ?? "";
  nextState.email = profile.user.email ?? "";
  nextState.phoneNumber = profile.personalProfile?.phoneNumber ?? "";
  nextState.bio = profile.personalProfile?.bio ?? "";
  nextState.country = profile.personalProfile?.country ?? "";
  nextState.role = profile.onboardingRole ?? "recycler";

  if (profile.onboardingRole === "recycler" && profile.roleProfile) {
    const recyclerProfile = profile.roleProfile;

    if ("wasteTypesAccepted" in recyclerProfile) {
      nextState.recycler = {
        wasteTypesAccepted: recyclerProfile.wasteTypesAccepted.map(
          (item) => item.slug,
        ),
        collectionCapacityAmount: recyclerProfile.collectionCapacityAmount,
        collectionCapacityUnit: recyclerProfile.collectionCapacityUnit,
        pickupAvailability: recyclerProfile.pickupAvailability,
        serviceCountry: recyclerProfile.serviceCountry,
        serviceState: recyclerProfile.serviceState,
        serviceCity: recyclerProfile.serviceCity,
        businessDescription: recyclerProfile.businessDescription ?? "",
      };
    }
  }

  if (profile.onboardingRole === "waste-provider" && profile.roleProfile) {
    const wasteProviderProfile = profile.roleProfile;

    if ("wasteTypesProvided" in wasteProviderProfile) {
      nextState.wasteProvider = {
        wasteTypesProvided: wasteProviderProfile.wasteTypesProvided.map(
          (item) => item.slug,
        ),
        estimatedQuantityAmount: wasteProviderProfile.estimatedQuantityAmount,
        estimatedQuantityUnit: wasteProviderProfile.estimatedQuantityUnit,
        frequency: wasteProviderProfile.frequency,
        wasteCondition: wasteProviderProfile.wasteCondition,
        country: wasteProviderProfile.country,
        state: wasteProviderProfile.state,
        city: wasteProviderProfile.city,
        additionalNotes: wasteProviderProfile.additionalNotes ?? "",
      };
    }
  }

  return nextState;
}

