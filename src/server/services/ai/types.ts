import { z } from "zod";
import type { LinkedInProfile } from "../linkedin/types";

export interface TovConfig {
  formality: number;
  warmth: number;
  directness: number;
}

export interface Company {
  name: string;
  description?: string | null;
  industry?: string | null;
  context: string;
}

export interface GenerateMessagesInput {
  profile: LinkedInProfile;
  company: Company;
  tovConfig: TovConfig;
  messageCount: number;
}

export const generatedMessageSchema = z.object({
  body: z.string(),
  confidence: z.number().min(0).max(1),
});

export const generateMessagesOutputSchema = z.object({
  messages: z.array(generatedMessageSchema),
  thinkingProcess: z.string(),
});

export type GeneratedMessage = z.infer<typeof generatedMessageSchema>;
export type GenerateMessagesOutput = z.infer<
  typeof generateMessagesOutputSchema
>;

export interface AiGenerationMetadata {
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  latencyMs: number;
}

export interface GenerateMessagesResult {
  messages: GeneratedMessage[];
  thinkingProcess: string;
  metadata: AiGenerationMetadata;
}
