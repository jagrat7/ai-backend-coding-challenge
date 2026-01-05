import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

const linkedinProfileSchema = z.object({
  name: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
  experience: z
    .array(
      z.object({
        title: z.string().optional(),
        company: z.string().optional(),
        duration: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
  education: z
    .array(
      z.object({
        school: z.string().optional(),
        degree: z.string().optional(),
        field: z.string().optional(),
        dates: z.string().optional(),
      }),
    )
    .optional(),
});

export type LinkedInProfile = z.infer<typeof linkedinProfileSchema>;

function extractLinkedInId(url: string): string {
  const patterns = [
    /linkedin\.com\/in\/([^\/\?]+)/,
    /linkedin\.com\/pub\/([^\/\?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  throw new Error("Invalid LinkedIn URL format");
}

export const linkedinRouter = createTRPCRouter({
  scrapeProfile: publicProcedure
    .input(
      z.object({
        url: z
          .string()
          .url()
          .refine((url) => url.includes("linkedin.com"), {
            message: "Must be a LinkedIn URL",
          }),
      }),
    )
    .mutation(async ({ input }) => {
      if (!env.SCRAPINGDOG_API_KEY) {
        throw new Error("SCRAPINGDOG_API_KEY not configured");
      }

      const linkedinId = extractLinkedInId(input.url);

      const apiUrl = new URL("https://api.scrapingdog.com/profile/");
      apiUrl.searchParams.append("api_key", env.SCRAPINGDOG_API_KEY);
      apiUrl.searchParams.append("type", "profile");
      apiUrl.searchParams.append("id", linkedinId);

      const response = await fetch(apiUrl.toString());

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Scrapingdog API error: ${response.status} - ${errorText}`,
        );
      }

      const data = (await response.json()) as LinkedInProfile;

      return {
        success: true,
        linkedinId,
        profile: data,
      };
    }),
});
