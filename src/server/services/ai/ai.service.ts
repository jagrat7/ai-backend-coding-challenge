import { generateObject } from "ai";
import { z } from "zod";
import {
  translateTovToInstructions,
  generateSystemMessage,
  generateUserMessage,
} from "./prompts/sequence.prompt";
import type { GenerateMessagesInput, GenerateMessagesResult } from "./types";
import type { IAiService } from "./ai.interface";

export class AiService implements IAiService {
  private readonly MODEL = "google/gemini-3-flash";
  private readonly COST_PER_MILLION_INPUT = 0.1;
  private readonly COST_PER_MILLION_OUTPUT = 0.4;
  private readonly MAX_RETRIES = 3;

  buildTovInstructions(input: GenerateMessagesInput): string {
    return translateTovToInstructions(input.tovConfig);
  }

  calculateCost(promptTokens: number, completionTokens: number): number {
    const inputCost = (promptTokens / 1_000_000) * this.COST_PER_MILLION_INPUT;
    const outputCost =
      (completionTokens / 1_000_000) * this.COST_PER_MILLION_OUTPUT;
    return inputCost + outputCost;
  }


  async generateMessages(
    input: GenerateMessagesInput,
  ): Promise<GenerateMessagesResult> {
    const tovInstructions = this.buildTovInstructions(input);
    const systemMessage = generateSystemMessage(input.company, tovInstructions);
    const userMessage = generateUserMessage(input.profile, input.messageCount);
    const fullPrompt = `[SYSTEM]\n${systemMessage}\n\n[USER]\n${userMessage}`;

    try {
      const { object, usage, reasoning } = await generateObject({
        model: this.MODEL,
        maxRetries: this.MAX_RETRIES,
        schema: z.object({
          messages: z
            .array(
              z.object({
                body: z
                  .string()
                  .describe(
                    "The personalized outreach message body, 50-150 words, with clear call-to-action",
                  ),
                confidence: z
                  .number()
                  .min(0)
                  .max(1)
                  .describe(
                    "Confidence score (0-1) based on personalization quality and relevance to prospect profile",
                  ),
              }),
            )
            .length(input.messageCount)
            .describe(
              `Array of exactly ${input.messageCount} personalized outreach messages for the prospect`,
            ),
        }),
        providerOptions: {
          google: {
            thinkingConfig: {
              thinkingLevel: "low",
              includeThoughts: true,
            },
          },
        },
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      });

      const promptTokens = usage.inputTokens ?? 0;
      const completionTokens = usage.outputTokens ?? 0;
      const totalTokens = usage.totalTokens ?? 0;
      const costUsd = this.calculateCost(promptTokens, completionTokens);

      return {
        messages: object.messages,
        thinkingProcess: reasoning ?? "",
        prompt: fullPrompt,
        metadata: {
          model: this.MODEL,
          promptTokens,
          completionTokens,
          totalTokens,
          costUsd,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(
        `AI generation failed after ${this.MAX_RETRIES} retries: ${message}`,
      );
    }
  }
}

export const aiService = new AiService();
