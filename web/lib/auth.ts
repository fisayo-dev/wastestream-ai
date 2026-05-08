import { WasteTypeOption } from "@/types/waste";

export const apiBaseUrl =
  process.env.NEXT_BACKEND_PUBLIC_URL ?? "http://localhost:2300/v1";

export const authBaseUrl =
  process.env.NEXT_BACKEND_AUTH_PUBLIC_URL ?? "http://localhost:2300/api/auth";

export const googleAuthUrl = `${authBaseUrl}/sign-in/social`;
export const sessionUrl = `${apiBaseUrl}/auth/session`;
export const authProfileUrl = `${apiBaseUrl}/auth/profile`;
export const logoutUrl = `${apiBaseUrl}/auth/logout`;
export const userProfileUrl = `${apiBaseUrl}/user/me`;

export type BackendSession = {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};



export type PersonalProfile = {
  userId: string;
  fullName: string;
  phoneNumber: string;
  bio: string | null;
  country: string;
  role: "recycler" | "waste-provider";
  createdAt: string;
  updatedAt: string;
  onboardedAt: string;
};

export type RecyclerRoleProfile = {
  userId: string;
  collectionCapacityAmount: string;
  collectionCapacityUnit: string;
  pickupAvailability: string;
  serviceCountry: string;
  serviceState: string;
  serviceCity: string;
  businessDescription: string | null;
  createdAt: string;
  updatedAt: string;
  wasteTypesAccepted: WasteTypeOption[];
};

export type WasteProviderRoleProfile = {
  userId: string;
  estimatedQuantityAmount: string;
  estimatedQuantityUnit: string;
  frequency: string;
  wasteCondition: string;
  country: string;
  state: string;
  city: string;
  additionalNotes: string | null;
  createdAt: string;
  updatedAt: string;
  wasteTypesProvided: WasteTypeOption[];
};

export type BackendAuthProfile = BackendSession & {
  onboardingCompleted: boolean;
  onboardingRole: "recycler" | "waste-provider" | null;
  personalProfile: PersonalProfile | null;
  roleProfile: RecyclerRoleProfile | WasteProviderRoleProfile | null;
  wasteTypes: WasteTypeOption[];
  meta: {
    recyclerPickupOptions: string[];
    quantityUnitOptions: string[];
    capacityUnitOptions: string[];
    providerFrequencyOptions: string[];
    wasteConditionOptions: string[];
  };
};
