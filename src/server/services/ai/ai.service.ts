import { generateText, Output } from "ai";
import { buildSequencePrompt } from "./prompts/sequence.prompt";
import {
  generateMessagesOutputSchema,
  type GenerateMessagesInput,
  type GenerateMessagesResult,
} from "./types";
import type { IAiService } from "./ai.interface";

export class AiService implements IAiService {
  private readonly MODEL = "google/gemini-2.0-flash-001";
  private readonly COST_PER_MILLION_INPUT = 0.1;
  private readonly COST_PER_MILLION_OUTPUT = 0.4;

  async generateMessages(
    input: GenerateMessagesInput,
  ): Promise<GenerateMessagesResult> {
    const startTime = Date.now();

    const prompt = buildSequencePrompt(
      input.profile,
      input.company,
      input.tovConfig,
      input.messageCount,
    );

    const result = await generateText({
      model: this.MODEL,
      output: Output.object({
        schema: generateMessagesOutputSchema,
      }),
      providerOptions: {
        google: {
          thinkingConfig: {
            includeThoughts: true,
            thinkingBudget: 4096,
          },
        },
      },
      prompt,
    });

    const latencyMs = Date.now() - startTime;

    // AI Gateway provides usage metadata
    const usage = result.usage;
    const promptTokens = usage.inputTokens ?? 0;
    const completionTokens = usage.outputTokens ?? 0;
    const totalTokens = usage.totalTokens ?? 0;

    const costUsd = this.calculateCost(promptTokens, completionTokens);

    if (!result.output) {
      throw new Error("Failed to generate messages - no output returned");
    }

    // Capture reasoning from Gemini's thinking process
    const reasoning =
      result.reasoning?.map((r) => r.text).join("\n") ??
      result.output.thinkingProcess;

    return {
      messages: result.output.messages,
      thinkingProcess: reasoning ?? "",
      metadata: {
        model: this.MODEL,
        promptTokens,
        completionTokens,
        totalTokens,
        costUsd,
        latencyMs,
      },
    };
  }

  private calculateCost(
    promptTokens: number,
    completionTokens: number,
  ): number {
    const inputCost = (promptTokens / 1_000_000) * this.COST_PER_MILLION_INPUT;
    const outputCost =
      (completionTokens / 1_000_000) * this.COST_PER_MILLION_OUTPUT;
    return inputCost + outputCost;
  }
}

export const aiService = new AiService();
