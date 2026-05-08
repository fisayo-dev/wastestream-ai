import { WasteTypeOption } from "@/types/waste";

export const onboardingSteps = [
  {
    id: 1,
    title: "Personal details",
    description: "Confirm your contact details before you join the marketplace.",
  },
  {
    id: 2,
    title: "Account type",
    description: "Tell WasteStream whether you supply waste or recycle it.",
  },
  {
    id: 3,
    title: "Operational details",
    description: "Add the details that drive matching and logistics.",
  },
] as const;

export const fallbackWasteTypes: WasteTypeOption[] = [
  { slug: "plastic", label: "Plastic" },
  { slug: "metal", label: "Metal" },
  { slug: "paper", label: "Paper" },
  { slug: "glass", label: "Glass" },
  { slug: "organic", label: "Organic" },
  { slug: "e-waste", label: "E-waste" },
  { slug: "textile", label: "Textile" },
  { slug: "rubber", label: "Rubber" },
];