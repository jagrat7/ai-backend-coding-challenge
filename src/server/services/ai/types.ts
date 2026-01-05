import type { InferSelectModel } from "drizzle-orm";
import type { LinkedInProfile } from "../linkedin/types";
import type { companies } from "~/server/db/schema";

export type TovConfig = {
  formality: number;
  warmth: number;
  directness: number;
};

export type Company = Pick<
  InferSelectModel<typeof companies>,
  "name" | "description" | "industry"
> & {
  context: string;
};

export interface GenerateMessagesInput {
  profile: LinkedInProfile;
  company: Company;
  tovConfig: TovConfig;
  messageCount: number;
}

export interface GeneratedMessage {
  body: string;
  confidence: number;
}

export interface AiGenerationMetadata {
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
}

export interface GenerateMessagesResult {
  messages: GeneratedMessage[];
  thinkingProcess: string;
  metadata: AiGenerationMetadata;
}
