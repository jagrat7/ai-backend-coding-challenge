import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  sequences,
  messages,
  aiGenerations,
  companies,
  tovConfigs,
} from "~/server/db/schema";
import { linkedInService } from "../linkedin/linkedin.service";
import { aiService } from "../ai/ai.service";
import type { LinkedInProfile } from "../linkedin/types";
import type {
  GenerateSequenceInput,
  GenerateSequenceResult,
} from "./types";
import type { ISequenceService } from "./sequence.interface";

export class SequenceService implements ISequenceService {
  async generateSequence(
    input: GenerateSequenceInput,
  ): Promise<GenerateSequenceResult> {
    // 1. Get or create prospect from LinkedIn
    const prospect = await linkedInService.getOrCreateProspect(
      input.prospectUrl,
    );

    // 2. Fetch company from DB
    const company = await db.query.companies.findFirst({
      where: eq(companies.id, input.companyId),
    });

    if (!company) {
      throw new Error(`Company not found: ${input.companyId}`);
    }

    // 3. Fetch TOV config from DB
    const tovConfig = await db.query.tovConfigs.findFirst({
      where: eq(tovConfigs.id, input.tovConfigId),
    });

    if (!tovConfig) {
      throw new Error(`TOV config not found: ${input.tovConfigId}`);
    }

    // 4. Generate messages using AI service
    const aiResult = await aiService.generateMessages({
      profile: prospect.profileData as LinkedInProfile,
      company: {
        context: company.context,
      },
      tovConfig: {
        formality: Number(tovConfig.formality),
        warmth: Number(tovConfig.warmth),
        directness: Number(tovConfig.directness),
      },
      messageCount: input.messageCount,
    });

    // 5. Save to database in a transaction
    const [sequence] = await db
      .insert(sequences)
      .values({
        prospectId: prospect.id,
        companyId: company.id,
        tovId: tovConfig.id,
      })
      .returning();

    if (!sequence) {
      throw new Error("Failed to create sequence");
    }

    // Save messages - convert confidence number to string for DB numeric type
    const messageRecords = await db
      .insert(messages)
      .values(
        aiResult.messages.map((msg, index) => ({
          sequenceId: sequence.id,
          body: msg.body,
          confidence: aiResult.confidenceScores[index]?.toString() ?? "0",
        })),
      )
      .returning();

    // Save AI generation metadata
    await db.insert(aiGenerations).values({
      sequenceId: sequence.id,
      model: aiResult.metadata.model,
      prompt: aiResult.prompt,
      tokens_used: aiResult.metadata.totalTokens,
      costUsd: aiResult.metadata.costUsd.toString(),
      thinkingProcess: aiResult.thinkingProcess,
      rawResponse: aiResult,
    });

    return {
      sequenceId: sequence.id,
      prospectId: prospect.id,
      messages: messageRecords.map((msg) => ({
        id: msg.id,
        body: msg.body,
        confidence: msg.confidence ? Number(msg.confidence) : null,
      })),
      thinkingProcess: aiResult.thinkingProcess,
    };
  }
}

export const sequenceService = new SequenceService();
