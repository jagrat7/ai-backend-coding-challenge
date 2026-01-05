import type { GenerateMessagesInput, GenerateMessagesResult } from "./types";

export interface IAiService {
  buildTovInstructions(input: GenerateMessagesInput): string;
  calculateCost(promptTokens: number, completionTokens: number): number;
  generateMessages(
    input: GenerateMessagesInput,
  ): Promise<GenerateMessagesResult>;
}
