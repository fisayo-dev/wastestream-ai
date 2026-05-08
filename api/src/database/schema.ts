import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("emailVerified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("user_email_unique").on(table.email),
  }),
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => ({
    tokenIdx: uniqueIndex("session_token_unique").on(table.token),
    userIdIdx: index("session_userId_idx").on(table.userId),
  }),
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
  },
  (table) => ({
    userIdIdx: index("account_userId_idx").on(table.userId),
    providerAccountUnique: unique("account_provider_account_unique").on(
      table.providerId,
      table.accountId,
    ),
  }),
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
  },
  (table) => ({
    identifierIdx: index("verification_identifier_idx").on(table.identifier),
  }),
);

export const userProfile = pgTable(
  "user_profile",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    phoneNumber: text("phone_number").notNull(),
    bio: text("bio"),
    country: text("country").notNull(),
    role: text("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    onboardedAt: timestamp("onboarded_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    roleIdx: index("user_profile_role_idx").on(table.role),
  }),
);

export const wasteType = pgTable(
  "waste_type",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    slug: text("slug").notNull(),
    label: text("label").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("waste_type_slug_unique").on(table.slug),
  }),
);

export const recyclerProfile = pgTable("recycler_profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  collectionCapacityAmount: text("collection_capacity_amount").notNull(),
  collectionCapacityUnit: text("collection_capacity_unit").notNull(),
  pickupAvailability: text("pickup_availability").notNull(),
  serviceCountry: text("service_country").notNull(),
  serviceState: text("service_state").notNull(),
  serviceCity: text("service_city").notNull(),
  businessDescription: text("business_description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const wasteProviderProfile = pgTable("waste_provider_profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  estimatedQuantityAmount: text("estimated_quantity_amount").notNull(),
  estimatedQuantityUnit: text("estimated_quantity_unit").notNull(),
  frequency: text("frequency").notNull(),
  wasteCondition: text("waste_condition").notNull(),
  country: text("country").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  additionalNotes: text("additional_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const recyclerWasteType = pgTable(
  "recycler_waste_type",
  {
    recyclerUserId: text("recycler_user_id")
      .notNull()
      .references(() => recyclerProfile.userId, { onDelete: "cascade" }),
    wasteTypeId: integer("waste_type_id")
      .notNull()
      .references(() => wasteType.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      name: "recycler_waste_type_pk",
      columns: [table.recyclerUserId, table.wasteTypeId],
    }),
  }),
);

export const wasteProviderWasteType = pgTable(
  "waste_provider_waste_type",
  {
    wasteProviderUserId: text("waste_provider_user_id")
      .notNull()
      .references(() => wasteProviderProfile.userId, { onDelete: "cascade" }),
    wasteTypeId: integer("waste_type_id")
      .notNull()
      .references(() => wasteType.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      name: "waste_provider_waste_type_pk",
      columns: [table.wasteProviderUserId, table.wasteTypeId],
    }),
  }),
);

export const listing = pgTable(
  "listing",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    wasteTypeId: integer("waste_type_id").references(() => wasteType.id, {
      onDelete: "set null",
    }),
    quantity: text("quantity"),
    quantityUnit: text("quantity_unit"),
    condition: text("condition"),
    country: text("country"),
    state: text("state"),
    city: text("city"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    userIdIdx: index("listing_user_id_idx").on(table.userId),
  }),
);
