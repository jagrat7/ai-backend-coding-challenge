ALTER TABLE "companies" ALTER COLUMN "context" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_context_unique" UNIQUE("context");