ALTER TABLE "companies" DROP CONSTRAINT "companies_prospectId_prospects_id_fk";
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "context" text;--> statement-breakpoint
ALTER TABLE "companies" DROP COLUMN "prospectId";--> statement-breakpoint
ALTER TABLE "companies" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "companies" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "companies" DROP COLUMN "industry";