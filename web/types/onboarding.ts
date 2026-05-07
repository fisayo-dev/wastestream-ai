export type Role = "recycler" | "waste-provider";

export type FormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  country: string;
  role: Role;
  recycler: {
    wasteTypesAccepted: string[];
    collectionCapacityAmount: string;
    collectionCapacityUnit: string;
    pickupAvailability: string;
    serviceCountry: string;
    serviceState: string;
    serviceCity: string;
    businessDescription: string;
  };
  wasteProvider: {
    wasteTypesProvided: string[];
    estimatedQuantityAmount: string;
    estimatedQuantityUnit: string;
    frequency: string;
    wasteCondition: string;
    country: string;
    state: string;
    city: string;
    additionalNotes: string;
  };
};
