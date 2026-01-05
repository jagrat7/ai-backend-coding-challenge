import type {
  GenerateMessagesInput,
  GenerateMessagesResult,
  GeneratedMessage,
} from "./types";
import type { LinkedInProfile } from "../linkedin/types";

export interface IAiService {
  buildTovInstructions(input: GenerateMessagesInput): string;
  calculateCost(promptTokens: number, completionTokens: number): number;
  scoreMessage(body: string, profile: LinkedInProfile): GeneratedMessage;
  generateMessages(
    input: GenerateMessagesInput,
  ): Promise<GenerateMessagesResult>;
}
