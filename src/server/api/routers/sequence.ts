import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { sequenceService } from "~/server/services/sequence/sequence.service";

export const sequenceRouter = createTRPCRouter({
  generate: publicProcedure
    .input(
      z.object({
        prospectUrl: z.string().url(),
        companyId: z.string().uuid(),
        tovConfigId: z.string().uuid(),
        messageCount: z.number().min(1).max(5).default(3),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await sequenceService.generateSequence(input);
      return result;
    }),
});
