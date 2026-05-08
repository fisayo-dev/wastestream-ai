import type { BackendAuthProfile } from "@/lib/auth";

type ListingItem = {
  id: string;
  wasteType: string;
  quantity: string;
  location: string;
  condition: string;
  date: string;
  matchScore?: number;
  status?: "active" | "pending" | "matched";
  interestedRecyclers?: number;
};

type MatchItem = {
  id: string;
  name: string;
  matchScore: number;
  reasons: string[];
};

type ProfilePreference = {
  label: string;
  value: string;
};

export function getDashboardHomeModel(session: BackendAuthProfile) {
  const role = session.personalProfile?.role ?? "waste-provider";

  if (role === "recycler") {
    return {
      role,
      stats: [
        { label: "Active listings nearby", value: "24" },
        { label: "Waste collected", value: "1.2t" },
        { label: "Match requests", value: "8" },
        {
          label: "Accepted waste categories",
          value: String(
            session.roleProfile && "wasteTypesAccepted" in session.roleProfile
              ? session.roleProfile.wasteTypesAccepted.length
              : 0,
          ),
        },
      ],
      listings: [
        {
          id: "r1",
          wasteType: "PET Plastic",
          quantity: "50kg",
          location: "Lagos",
          condition: "Sorted",
          date: "Today",
          matchScore: 92,
        },
        {
          id: "r2",
          wasteType: "Aluminum Cans",
          quantity: "35kg",
          location: "Ikeja",
          condition: "Clean",
          date: "2h ago",
          matchScore: 88,
        },
        {
          id: "r3",
          wasteType: "Cardboard",
          quantity: "120kg",
          location: "Yaba",
          condition: "Baled",
          date: "Yesterday",
          matchScore: 79,
        },
      ] satisfies ListingItem[],
      insightTitle: "AI Insight",
      insightText: "3 high-value plastic listings detected near Ikeja.",
      insightMeta: "Potential estimated value: ₦25,000",
    };
  }

  return {
    role,
    stats: [
      { label: "Listings created", value: "14" },
      { label: "Interested recyclers", value: "19" },
      { label: "Estimated waste value", value: "₦182,000" },
      {
        label: "Waste categories",
        value: String(
          session.roleProfile && "wasteTypesProvided" in session.roleProfile
            ? session.roleProfile.wasteTypesProvided.length
            : 0,
        ),
      },
    ],
    listings: [
      {
        id: "p1",
        wasteType: "PET Plastic",
        quantity: "50kg",
        location: "Lagos",
        condition: "Mixed",
        date: "Today",
        status: "active",
        interestedRecyclers: 4,
      },
      {
        id: "p2",
        wasteType: "HDPE Containers",
        quantity: "75kg",
        location: "Ibadan",
        condition: "Sorted",
        date: "Yesterday",
        status: "pending",
        interestedRecyclers: 2,
      },
      {
        id: "p3",
        wasteType: "Office Paper",
        quantity: "40kg",
        location: "Abuja",
        condition: "Clean",
        date: "2 days ago",
        status: "matched",
        interestedRecyclers: 6,
      },
    ] satisfies ListingItem[],
    insightTitle: "AI Suggestion",
    insightText: "Sorted plastics may increase recycling value by 30%.",
    insightMeta: "Focus on PET and HDPE batches first.",
  };
}

export function getMarketplaceListings(): ListingItem[] {
  return [
    {
      id: "l1",
      wasteType: "PET Plastic",
      quantity: "50kg",
      location: "Lagos",
      condition: "Mixed",
      date: "Today",
      matchScore: 92,
    },
    {
      id: "l2",
      wasteType: "Aluminum",
      quantity: "22kg",
      location: "Ikeja",
      condition: "Sorted",
      date: "Yesterday",
      matchScore: 86,
    },
    {
      id: "l3",
      wasteType: "Glass",
      quantity: "90kg",
      location: "Port Harcourt",
      condition: "Clean",
      date: "2d ago",
      matchScore: 80,
    },
    {
      id: "l4",
      wasteType: "Cardboard",
      quantity: "120kg",
      location: "Yaba",
      condition: "Baled",
      date: "3d ago",
      matchScore: 78,
    },
    {
      id: "l5",
      wasteType: "E-waste",
      quantity: "15kg",
      location: "Abuja",
      condition: "Mixed",
      date: "4d ago",
      matchScore: 73,
    },
    {
      id: "l6",
      wasteType: "Textile",
      quantity: "60kg",
      location: "Kano",
      condition: "Clean",
      date: "5d ago",
      matchScore: 69,
    },
  ];
}

export function getMatches(): MatchItem[] {
  return [
    {
      id: "m1",
      name: "Lagos PET Recovery",
      matchScore: 92,
      reasons: ["Accepts plastics", "Within 10km", "Pickup available"],
    },
    {
      id: "m2",
      name: "GreenLoop Metals",
      matchScore: 88,
      reasons: [
        "Accepts aluminum",
        "High acceptance history",
        "Fast response time",
      ],
    },
    {
      id: "m3",
      name: "Circular Fiber Hub",
      matchScore: 81,
      reasons: ["Accepts cardboard", "Weekly pickups", "Strong deal completion"],
    },
  ];
}

export function getProfilePreferences(
  session: BackendAuthProfile,
): ProfilePreference[] {
  const roleProfile = session.roleProfile;

  if (!roleProfile) {
    return [];
  }

  if ("pickupAvailability" in roleProfile) {
    return [
      { label: "Role", value: "Recycler" },
      { label: "Pickup preference", value: roleProfile.pickupAvailability },
      {
        label: "Collection capacity",
        value: `${roleProfile.collectionCapacityAmount} ${roleProfile.collectionCapacityUnit}`,
      },
      {
        label: "Service location",
        value: `${roleProfile.serviceCity}, ${roleProfile.serviceState}, ${roleProfile.serviceCountry}`,
      },
    ];
  }

  return [
    { label: "Role", value: "Waste provider" },
    { label: "Waste frequency", value: roleProfile.frequency },
    {
      label: "Estimated quantity",
      value: `${roleProfile.estimatedQuantityAmount} ${roleProfile.estimatedQuantityUnit}`,
    },
    {
      label: "Location",
      value: `${roleProfile.city}, ${roleProfile.state}, ${roleProfile.country}`,
    },
  ];
}
