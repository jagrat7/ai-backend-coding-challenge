CREATE TABLE "ai_generations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sequenceId" uuid NOT NULL,
	"model" varchar NOT NULL,
	"prompt" text NOT NULL,
	"tokens_used" integer,
	"costUsd" numeric,
	"thinkingProcess" text,
	"rawResponse" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sequenceId" uuid NOT NULL,
	"body" text NOT NULL,
	"confidence" numeric,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prospects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"linkedinId" varchar NOT NULL,
	"linkedinUrl" varchar NOT NULL,
	"profileData" jsonb NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "prospects_linkedinId_unique" UNIQUE("linkedinId")
);
--> statement-breakpoint
CREATE TABLE "sequences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospectId" uuid NOT NULL,
	"tovConfigId" uuid,
	"companyContext" text NOT NULL,
	"tovId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tov_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"formality" numeric NOT NULL,
	"warmth" numeric NOT NULL,
	"directness" numeric NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_sequenceId_sequences_id_fk" FOREIGN KEY ("sequenceId") REFERENCES "public"."sequences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sequenceId_sequences_id_fk" FOREIGN KEY ("sequenceId") REFERENCES "public"."sequences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sequences" ADD CONSTRAINT "sequences_prospectId_prospects_id_fk" FOREIGN KEY ("prospectId") REFERENCES "public"."prospects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sequences" ADD CONSTRAINT "sequences_tovConfigId_tov_configs_id_fk" FOREIGN KEY ("tovConfigId") REFERENCES "public"."tov_configs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sequences" ADD CONSTRAINT "sequences_tovId_tov_configs_id_fk" FOREIGN KEY ("tovId") REFERENCES "public"."tov_configs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_generations_sequence_id_idx" ON "ai_generations" USING btree ("sequenceId");--> statement-breakpoint
CREATE INDEX "ai_generations_model_idx" ON "ai_generations" USING btree ("model");--> statement-breakpoint
CREATE INDEX "messages_sequence_id_idx" ON "messages" USING btree ("sequenceId");--> statement-breakpoint
CREATE UNIQUE INDEX "prospects_linkedin_id_idx" ON "prospects" USING btree ("linkedinId");--> statement-breakpoint
CREATE INDEX "sequences_prospect_id_idx" ON "sequences" USING btree ("prospectId");