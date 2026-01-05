import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { sequenceService } from "~/server/services/sequence/sequence.service";
import { companies, tovConfigs } from "~/server/db/schema";

export const sequenceRouter = createTRPCRouter({
  generate: publicProcedure
    .input(
      z.object({
        prospectUrl: z.string().url(),
        companyContext: z.string().min(1),
        messageCount: z.number().min(1).max(5).default(3),
        formality: z.number().min(0).max(1).default(0.5),
        warmth: z.number().min(0).max(1).default(0.5),
        directness: z.number().min(0).max(1).default(0.5),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Get or create company
      let company = await ctx.db.query.companies.findFirst({
        where: (companies, { eq }) => eq(companies.context, input.companyContext),
      });

      if (!company) {
        const [newCompany] = await ctx.db
          .insert(companies)
          .values({
            context: input.companyContext,
          })
          .returning();
        company = newCompany;
      }

      // Create TOV config
      const [tovConfig] = await ctx.db
        .insert(tovConfigs)
        .values({
          name: `Generated ${new Date().toISOString()}`,
          formality: input.formality.toString(),
          warmth: input.warmth.toString(),
          directness: input.directness.toString(),
        })
        .returning();

      if (!company || !tovConfig) {
        throw new Error("Failed to create company or TOV config");
      }

      // Generate sequence
      const result = await sequenceService.generateSequence({
        prospectUrl: input.prospectUrl,
        companyId: company.id,
        tovConfigId: tovConfig.id,
        messageCount: input.messageCount,
      });

      return result;
    }),
});
