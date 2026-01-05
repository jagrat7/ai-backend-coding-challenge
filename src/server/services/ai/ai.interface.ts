import type { GenerateMessagesInput, GenerateMessagesResult } from "./types";

export interface IAiService {
  generateMessages(
    input: GenerateMessagesInput,
  ): Promise<GenerateMessagesResult>;
}
