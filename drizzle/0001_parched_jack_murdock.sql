CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospectId" uuid NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"industry" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prospects" DROP CONSTRAINT "prospects_linkedinId_unique";--> statement-breakpoint
ALTER TABLE "sequences" DROP CONSTRAINT "sequences_tovConfigId_tov_configs_id_fk";
--> statement-breakpoint
DROP INDEX "ai_generations_sequence_id_idx";--> statement-breakpoint
DROP INDEX "ai_generations_model_idx";--> statement-breakpoint
DROP INDEX "messages_sequence_id_idx";--> statement-breakpoint
DROP INDEX "prospects_linkedin_id_idx";--> statement-breakpoint
DROP INDEX "sequences_prospect_id_idx";--> statement-breakpoint
ALTER TABLE "ai_generations" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sequences" ADD COLUMN "companyId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "sequences" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tov_configs" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_prospectId_prospects_id_fk" FOREIGN KEY ("prospectId") REFERENCES "public"."prospects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sequences" ADD CONSTRAINT "sequences_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prospects" DROP COLUMN "linkedinId";--> statement-breakpoint
ALTER TABLE "sequences" DROP COLUMN "tovConfigId";--> statement-breakpoint
ALTER TABLE "sequences" DROP COLUMN "companyContext";--> statement-breakpoint
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_linkedinUrl_unique" UNIQUE("linkedinUrl");