import { generateObject } from "ai";
import { z } from "zod";
import {
  translateTovToInstructions,
  generateSystemMessage,
  generateUserMessage,
} from "./prompts/sequence.prompt";
import type {
  GenerateMessagesInput,
  GenerateMessagesResult,
  GeneratedMessage,
} from "./types";
import type { IAiService } from "./ai.interface";
import type { LinkedInProfile } from "../linkedin/types";

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

  scoreMessage(body: string, profile: LinkedInProfile): GeneratedMessage {
    const lowerBody = body.toLowerCase();
    let score = 0;

    // Check for name mention (+0.15)
    const name = profile.fullName ?? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim();
    if (name && lowerBody.includes(name.toLowerCase().split(" ")[0] ?? "")) {
      score += 0.15;
    }

    // Check for company mention (+0.2)
    const currentCompany = profile.experience?.[0]?.company_name;
    if (currentCompany && lowerBody.includes(currentCompany.toLowerCase())) {
      score += 0.2;
    }

    // Check for role/title mention (+0.1)
    const currentTitle = profile.experience?.[0]?.title;
    if (currentTitle && lowerBody.includes(currentTitle.toLowerCase())) {
      score += 0.1;
    }

    // Check for headline keywords (+0.1)
    if (profile.headline) {
      const headlineWords = profile.headline.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      const matchedWords = headlineWords.filter((word) => lowerBody.includes(word));
      if (matchedWords.length > 0) {
        score += Math.min(0.1, matchedWords.length * 0.03);
      }
    }

    // Check for word count in target range 50-150 (+0.2)
    const wordCount = body.split(/\s+/).length;
    if (wordCount >= 50 && wordCount <= 150) {
      score += 0.2;
    } else if (wordCount >= 30 && wordCount <= 200) {
      score += 0.1;
    }

    // Check for clear CTA indicators (+0.25)
    const ctaPatterns = ["let's", "would you", "can we", "interested in", "schedule", "connect", "chat", "call"];
    if (ctaPatterns.some((pattern) => lowerBody.includes(pattern))) {
      score += 0.25;
    }

    return {
      body,
      confidence: Math.min(1, Math.round(score * 100) / 100),
    };
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

      const confidenceScores = object.messages.map((msg) =>
        this.scoreMessage(msg.body, input.profile).confidence,
      );

      return {
        messages: object.messages,
        confidenceScores,
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
