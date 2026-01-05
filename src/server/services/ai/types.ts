import type { LinkedInProfile } from "../linkedin/types";

export type TovConfig = {
  formality: number;
  warmth: number;
  directness: number;
};

export type Company = {
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
  messages: Array<{ body: string }>;
  confidenceScores: number[];
  thinkingProcess: string;
  prompt: string;
  metadata: AiGenerationMetadata;
}
