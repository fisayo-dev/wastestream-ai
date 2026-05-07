CREATE TABLE "recycler_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"collection_capacity_amount" text NOT NULL,
	"collection_capacity_unit" text NOT NULL,
	"pickup_availability" text NOT NULL,
	"service_country" text NOT NULL,
	"service_state" text NOT NULL,
	"service_city" text NOT NULL,
	"business_description" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recycler_waste_type" (
	"recycler_user_id" text NOT NULL,
	"waste_type_id" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "recycler_waste_type_pk" PRIMARY KEY("recycler_user_id","waste_type_id")
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"phone_number" text NOT NULL,
	"bio" text,
	"country" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"onboarded_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waste_provider_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"estimated_quantity_amount" text NOT NULL,
	"estimated_quantity_unit" text NOT NULL,
	"frequency" text NOT NULL,
	"waste_condition" text NOT NULL,
	"country" text NOT NULL,
	"state" text NOT NULL,
	"city" text NOT NULL,
	"additional_notes" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waste_provider_waste_type" (
	"waste_provider_user_id" text NOT NULL,
	"waste_type_id" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "waste_provider_waste_type_pk" PRIMARY KEY("waste_provider_user_id","waste_type_id")
);
--> statement-breakpoint
CREATE TABLE "waste_type" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "waste_type_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"label" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recycler_profile" ADD CONSTRAINT "recycler_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recycler_waste_type" ADD CONSTRAINT "recycler_waste_type_recycler_user_id_recycler_profile_user_id_fk" FOREIGN KEY ("recycler_user_id") REFERENCES "public"."recycler_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recycler_waste_type" ADD CONSTRAINT "recycler_waste_type_waste_type_id_waste_type_id_fk" FOREIGN KEY ("waste_type_id") REFERENCES "public"."waste_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_provider_profile" ADD CONSTRAINT "waste_provider_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_provider_waste_type" ADD CONSTRAINT "waste_provider_waste_type_waste_provider_user_id_waste_provider_profile_user_id_fk" FOREIGN KEY ("waste_provider_user_id") REFERENCES "public"."waste_provider_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_provider_waste_type" ADD CONSTRAINT "waste_provider_waste_type_waste_type_id_waste_type_id_fk" FOREIGN KEY ("waste_type_id") REFERENCES "public"."waste_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_profile_role_idx" ON "user_profile" USING btree ("role");--> statement-breakpoint
CREATE UNIQUE INDEX "waste_type_slug_unique" ON "waste_type" USING btree ("slug");