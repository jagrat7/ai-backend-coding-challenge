import { pgTable } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";

export const prospects = pgTable("prospects", (d) => ({
  id: d.uuid().primaryKey().defaultRandom(),
  linkedinUrl: d.varchar().notNull().unique(),
  profileData: d.jsonb().notNull(),
  ...timestamps,
}));

export const tovConfigs = pgTable("tov_configs", (d) => ({
  id: d.uuid().primaryKey().defaultRandom(),
  name: d.varchar().notNull(),
  formality: d.numeric().notNull(),
  warmth: d.numeric().notNull(),
  directness: d.numeric().notNull(),
  ...timestamps,
}));

export const companies = pgTable("companies", (d) => ({
  id: d.uuid().primaryKey().defaultRandom(),
  prospectId: d
    .uuid()
    .notNull()
    .references(() => prospects.id, { onDelete: "cascade" }),
  name: d.varchar().notNull(),
  description: d.text(),
  industry: d.varchar(),
  ...timestamps,
}));

export const sequences = pgTable("sequences", (d) => ({
  id: d.uuid().primaryKey().defaultRandom(),
  prospectId: d
    .uuid()
    .notNull()
    .references(() => prospects.id, { onDelete: "cascade" }),
  companyId: d
    .uuid()
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  tovId: d
    .uuid()
    .notNull()
    .references(() => tovConfigs.id),
  ...timestamps,
}));

export const messages = pgTable("messages", (d) => ({
  id: d.uuid().primaryKey().defaultRandom(),
  sequenceId: d
    .uuid()
    .notNull()
    .references(() => sequences.id, { onDelete: "cascade" }),
  body: d.text().notNull(),
  confidence: d.numeric(),
  ...timestamps,
}));

export const aiGenerations = pgTable("ai_generations", (d) => ({
  id: d.uuid().primaryKey().defaultRandom(),
  sequenceId: d
    .uuid()
    .notNull()
    .references(() => sequences.id, { onDelete: "cascade" }),
  model: d.varchar().notNull(),
  prompt: d.text().notNull(),
  tokens_used: d.integer(),
  costUsd: d.numeric(),
  thinkingProcess: d.text(),
  rawResponse: d.jsonb(),
  ...timestamps,
}));
